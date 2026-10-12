import { useCallback, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useStudentStore from "../../store/studentStore";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const EmbeddedCourseCheckout = () => {
  const { courseId } = useParams();
  const createCheckout = useStudentStore((state) => state.enrollCourse);
  const [error, setError] = useState("");

  const fetchClientSecret = useCallback(async () => {
    const result = await createCheckout(courseId);
    if (!result.success || !result.clientSecret) {
      const message = result.message || "Could not start checkout.";
      setError(message);
      throw new Error(message);
    }
    return result.clientSecret;
  }, [courseId, createCheckout]);

  if (!publishableKey) {
    return <CheckoutError message="Stripe is not configured. Set VITE_STRIPE_PUBLISHABLE_KEY on the frontend and rebuild." />;
  }

  if (error) return <CheckoutError message={error} />;

  return (
    <main className="mx-auto min-h-[70vh] max-w-3xl px-4 py-10 sm:px-6">
      <Link to={`/courses/${courseId}`} className="text-sm font-medium text-indigo-700 hover:underline">← Back to course</Link>
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <h1 className="mb-5 text-2xl font-bold text-slate-900">Secure course checkout</h1>
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </main>
  );
};

const CheckoutError = ({ message }) => (
  <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
    <div className="w-full rounded-2xl border border-rose-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Checkout unavailable</h1>
      <p className="mt-3 text-rose-700">{message}</p>
      <Link to="/" className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white">Back to courses</Link>
    </div>
  </main>
);

export default EmbeddedCourseCheckout;
