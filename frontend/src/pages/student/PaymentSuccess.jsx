import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useStudentStore from "../../store/studentStore";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const [state, setState] = useState({ loading: true, status: "pending", course: null, message: "" });
  const getCheckoutStatus = useStudentStore((store) => store.getCheckoutStatus);
  const getMyCourses = useStudentStore((store) => store.getMyCourses);
  const sessionId = params.get("session_id");

  useEffect(() => {
    let active = true;
    let attempts = 0;
    let timer;

    const check = async () => {
      if (!sessionId) {
        if (active) setState({ loading: false, status: "invalid", course: null, message: "The checkout session ID is missing from this link." });
        return;
      }
      const result = await getCheckoutStatus(sessionId);
      if (!active) return;
      if (result.success && result.status === "paid") {
        setState({ loading: false, status: "paid", course: result.course });
        await getMyCourses();
        return;
      }
      if (result.success && result.status === "pending" && attempts < 20) {
        attempts += 1;
        timer = window.setTimeout(check, 2000);
        return;
      }
      setState({
        loading: false,
        status: result.success ? result.status : "unverified",
        course: result.course || null,
        message: result.success
          ? (result.status === "pending" ? "Payment is not confirmed yet. If this continues, check your Stripe webhook configuration." : "This checkout was not paid. You can retry from the course page.")
          : result.message,
      });
    };

    check();
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [sessionId, getCheckoutStatus, getMyCourses]);

  const message = state.loading
    ? "Confirming your payment and preparing your course access…"
    : state.status === "paid"
      ? `${state.course?.name || "Your course"} is ready in your student dashboard.`
      : state.message || "We could not confirm this payment. If you were charged, contact support with your Stripe receipt.";

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{state.status === "paid" ? "Payment successful" : state.loading ? "Checking payment" : "Payment status"}</h1>
        <p className="mt-3 text-slate-600">{message}</p>
        {!state.loading && <div className="mt-6 flex flex-wrap justify-center gap-3">
          {state.status === "paid" && <Link to="/student/lms" className="inline-flex rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700">Go to my courses</Link>}
          {state.status !== "paid" && <Link to={state.course?._id ? `/courses/${state.course._id}` : "/"} className="inline-flex rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700">Back to course</Link>}
        </div>}
      </div>
    </main>
  );
};

export default PaymentSuccess;
