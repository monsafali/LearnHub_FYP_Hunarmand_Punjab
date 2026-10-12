import mongoose from "mongoose";
import Course from "../models/Courses.model.js";
import EnrollmentCourse from "../models/EnrollmentCourse.model.js";
import CoursePurchase from "../models/CoursePurchase.model.js";
import { ErrorHandler } from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { getStripeClient } from "../utils/stripe.js";

const getFrontendUrl = () => {
  const value = process.env.CLIENT_URL?.split(",")[0]?.trim();
  if (!value) throw new Error("CLIENT_URL must be set for Stripe Checkout redirects.");
  return new URL(value).origin;
};

const getStripeWebhookSecret = () => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe webhook is not configured. Set STRIPE_WEBHOOK_SECRET.");
  }
  return process.env.STRIPE_WEBHOOK_SECRET;
};

// Idempotent writes plus EnrollmentCourse's unique { student, course } index
// make repeated Stripe webhook deliveries safe without requiring MongoDB replica sets.
const fulfillPaidPurchase = async (purchase, paymentIntentId) => {
  await CoursePurchase.updateOne(
    { _id: purchase._id, status: { $ne: "paid" } },
    {
      $set: {
        status: "paid",
        paidAt: new Date(),
        ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
      },
    },
  );
  await EnrollmentCourse.updateOne(
    { student: purchase.student, course: purchase.course },
    {
      $setOnInsert: {
        student: purchase.student,
        course: purchase.course,
        amountPaid: purchase.amount,
        status: "active",
        progress: 0,
      },
    },
    { upsert: true, setDefaultsOnInsert: true },
  );
};

export const createCourseCheckoutSession = catchAsyncErrors(async (req, res, next) => {
  const { courseId } = req.params;
  if (!mongoose.isValidObjectId(courseId)) return next(new ErrorHandler("Invalid course id", 400));

  const course = await Course.findById(courseId).populate("trainer", "fullname");
  if (!course) return next(new ErrorHandler("Course not found", 404));

  const existing = await EnrollmentCourse.findOne({ student: req.user._id, course: courseId });
  if (existing) return next(new ErrorHandler("You are already enrolled in this course", 400));

  const amountMinor = Math.round(Number(course.price) * 100);
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) {
    return next(new ErrorHandler("Course price is invalid", 400));
  }

  // Keep course pricing in major units in MongoDB and configure the currency once
  // for the account (for example `pkr`). Never accept price/currency from the client.
  const currency = (process.env.STRIPE_CURRENCY || "pkr").toLowerCase();
  if (!/^[a-z]{3}$/.test(currency)) {
    return next(new ErrorHandler("Stripe currency must be a three-letter ISO currency code", 500));
  }
  const purchase = await CoursePurchase.create({
    student: req.user._id,
    course: course._id,
    amount: course.price,
    currency,
  });

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: req.user.email,
      client_reference_id: purchase._id.toString(),
      line_items: [{
        quantity: 1,
        price_data: {
          currency,
          unit_amount: amountMinor,
          product_data: {
            name: course.name,
            description: `Course by ${course.trainer?.fullname || "your instructor"}`,
            ...(course.imageUrl ? { images: [course.imageUrl] } : {}),
          },
        },
      }],
      metadata: {
        purchaseId: purchase._id.toString(),
        studentId: req.user._id.toString(),
        courseId: course._id.toString(),
      },
      ui_mode: "embedded",
      return_url: `${getFrontendUrl()}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    purchase.stripeCheckoutSessionId = session.id;
    await purchase.save();
    res.status(201).json({ success: true, clientSecret: session.client_secret });
  } catch (error) {
    await CoursePurchase.deleteOne({ _id: purchase._id, status: "pending" });
    throw error;
  }
});

export const handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = getStripeClient().webhooks.constructEvent(
      req.body,
      signature,
      getStripeWebhookSecret(),
    );
  } catch (error) {
    return res.status(400).send(`Webhook signature verification failed: ${error.message}`);
  }

  try {
    if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
      const session = event.data.object;
      if (session.payment_status === "paid") {
        const purchaseId = session.metadata?.purchaseId;
        const studentId = session.metadata?.studentId;
        const courseId = session.metadata?.courseId;
        if (!purchaseId || !studentId || !courseId) {
          return res.status(400).json({ received: false, error: "Missing purchase metadata" });
        }

        const purchase = await CoursePurchase.findOne({
          _id: purchaseId,
          student: studentId,
          course: courseId,
          stripeCheckoutSessionId: session.id,
        });
        if (!purchase) return res.status(400).json({ received: false, error: "Purchase not found" });

        // Reconcile amount/currency from Stripe before granting access.
        if (session.amount_total !== Math.round(purchase.amount * 100) || session.currency !== purchase.currency) {
          return res.status(400).json({ received: false, error: "Payment amount mismatch" });
        }

        await fulfillPaidPurchase(purchase, session.payment_intent);
      }
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      await CoursePurchase.updateOne(
        { stripeCheckoutSessionId: session.id, status: "pending" },
        { $set: { status: "expired" } },
      );
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);
    res.status(500).json({ received: false });
  }
};

export const getCheckoutStatus = catchAsyncErrors(async (req, res, next) => {
  const sessionId = String(req.query.session_id || "");
  if (!sessionId) return next(new ErrorHandler("Checkout session id is required", 400));
  let purchase = await CoursePurchase.findOne({
    stripeCheckoutSessionId: sessionId,
    student: req.user._id,
  }).populate("course", "name");
  if (!purchase) return next(new ErrorHandler("Purchase not found", 404));

  // Webhooks are the primary fulfillment path. This authenticated status check
  // also reconciles a paid Checkout Session if local webhook forwarding is down.
  if (purchase.status === "pending") {
    const stripeSession = await getStripeClient().checkout.sessions.retrieve(sessionId);
    if (
      stripeSession.metadata?.purchaseId !== purchase._id.toString() ||
      stripeSession.metadata?.studentId !== req.user._id.toString() ||
      stripeSession.metadata?.courseId !== purchase.course._id.toString()
    ) {
      return next(new ErrorHandler("Checkout session does not match this purchase", 403));
    }

    if (stripeSession.payment_status === "paid") {
      if (
        stripeSession.amount_total !== Math.round(purchase.amount * 100) ||
        stripeSession.currency !== purchase.currency
      ) {
        return next(new ErrorHandler("Payment amount does not match the course price", 400));
      }

      await fulfillPaidPurchase(purchase, stripeSession.payment_intent);
      purchase = await CoursePurchase.findById(purchase._id).populate("course", "name");
    }
  }

  res.json({
    success: true,
    status: purchase.status,
    course: purchase.course,
  });
});
