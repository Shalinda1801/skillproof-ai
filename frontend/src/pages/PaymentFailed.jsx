import {
  AlertTriangle,
  ArrowLeft,
  CreditCard,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import AnimatedBackground from "../components/ui/AnimatedBackground";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const PaymentFailed = () => {
  const [searchParams] =
    useSearchParams();

  const orderId =
    searchParams.get("order_id");

  return (
    <>
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 grid min-h-[85vh] place-items-center px-6 py-20 text-slate-900">
        <section className="mx-auto w-full max-w-4xl">
          <div className="premium-card pro-card rounded-[2.5rem] p-8 text-center md:p-12">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] border border-red-200 bg-red-50 text-red-600 shadow-[0_18px_45px_rgba(239,68,68,0.10)]">
              <AlertTriangle size={54} />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-red-700">
              <CreditCard size={16} />

              Payment not completed
            </div>

            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight">
              Payment could not be{" "}

              <span className="gradient-text">
                completed.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              The transaction was cancelled,
              failed, or not confirmed. You can
              retry the checkout from your Student
              Dashboard.
            </p>

            {orderId && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white/85 p-4 text-sm text-slate-600 shadow-sm">
                Order ID:{" "}

                <span className="font-black text-slate-900">
                  {orderId}
                </span>
              </div>
            )}

            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white/80 p-6 text-left shadow-sm">
              <h2 className="flex items-center gap-3 text-xl font-black text-slate-900">
                <ShieldCheck className="text-indigo-600" />

                What happens next?
              </h2>

              <div className="mt-5 space-y-4 text-slate-600">
                <p>
                  • No paid certificate access is
                  recorded for this attempt.
                </p>

                <p>
                  • You can safely try again from
                  the dashboard.
                </p>

                <p>
                  • The backend only marks payments
                  as PAID after PayHere
                  confirmation.
                </p>
              </div>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-2">
              <Link
                to="/student/dashboard"
                className="primary-btn inline-flex justify-center gap-2 text-center"
              >
                <RefreshCcw size={18} />

                Back to Dashboard
              </Link>

              <Link
                to="/pricing"
                className="secondary-btn inline-flex justify-center gap-2 text-center"
              >
                <ArrowLeft size={18} />

                Back to Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default PaymentFailed;