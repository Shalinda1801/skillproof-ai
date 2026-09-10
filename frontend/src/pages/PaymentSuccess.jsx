import {
  Award,
  CheckCircle2,
  Download,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import { paymentApi } from "../api/paymentApi";

import AnimatedBackground from "../components/ui/AnimatedBackground";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const PaymentSuccess = () => {
  const [searchParams] =
    useSearchParams();

  const orderId =
    searchParams.get("order_id");

  const [payment, setPayment] =
    useState(null);

  const [loading, setLoading] =
    useState(Boolean(orderId));

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadPayment = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        setError("");

        const data =
          await paymentApi.getPaymentByOrderId(
            orderId
          );

        setPayment(data.payment);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load payment status."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPayment();
  }, [orderId]);

  return (
    <>
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 grid min-h-[85vh] place-items-center px-6 py-20 text-slate-900">
        <section className="mx-auto w-full max-w-4xl">
          <div className="premium-card pro-card rounded-[2.5rem] p-8 text-center md:p-12">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-[0_18px_45px_rgba(16,185,129,0.14)]">
              <CheckCircle2 size={54} />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              <Sparkles size={16} />

              Returned from payment
            </div>

            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight">
              Your payment return was{" "}

              <span className="gradient-text">
                successful.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              PayHere redirected you back to
              SkillProof AI. Final paid status is
              confirmed by the backend notification
              callback.
            </p>

            {loading && (
              <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-600 shadow-sm">
                <Loader2
                  className="animate-spin"
                  size={18}
                />

                Checking payment status...
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {payment && (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white/85 p-5 text-left shadow-sm">
                <p className="text-sm text-slate-500">
                  Order ID
                </p>

                <p className="mt-1 font-black text-slate-900">
                  {payment.orderId}
                </p>

                <p className="mt-4 text-sm text-slate-500">
                  Payment Status
                </p>

                <p className="mt-1 font-black text-emerald-600">
                  {payment.status}
                </p>

                <p className="mt-4 text-sm text-slate-500">
                  Amount
                </p>

                <p className="mt-1 font-black text-slate-900">
                  {payment.currency}{" "}
                  {payment.amount}
                </p>
              </div>
            )}

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title:
                    "Payment returned",
                  text:
                    "Checkout flow completed",
                },

                {
                  icon: Award,
                  title:
                    "Certificate",
                  text:
                    "Credential stays available",
                },

                {
                  icon: Download,
                  title:
                    "Public proof",
                  text:
                    "Verification page available",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white/80 p-5 text-left shadow-sm"
                >
                  <item.icon
                    className="mb-4 text-emerald-600"
                    size={30}
                  />

                  <h3 className="font-black text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-2">
              <Link
                to="/student/dashboard"
                className="primary-btn text-center"
              >
                Go to Student Dashboard
              </Link>

              <Link
                to="/pricing"
                className="secondary-btn text-center"
              >
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

export default PaymentSuccess;