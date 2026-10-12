import mongoose from "mongoose";

const coursePurchaseSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, lowercase: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "expired"],
      default: "pending",
      index: true,
    },
    stripeCheckoutSessionId: { type: String, unique: true, sparse: true },
    stripePaymentIntentId: { type: String, sparse: true },
    paidAt: Date,
  },
  { timestamps: true },
);

coursePurchaseSchema.index({ student: 1, course: 1, status: 1 });

export default mongoose.model("CoursePurchase", coursePurchaseSchema);
