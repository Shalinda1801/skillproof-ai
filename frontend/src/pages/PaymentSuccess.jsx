import {
  Award,
  CheckCircle2,
  Download,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { paymentApi } from "../api/paymentApi";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayment = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        setError("");

        const data = await paymentApi.getPaymentByOrderId(orderId);
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

      <main className="relative z-10 grid min-h-[85vh] place-items-center px-6 py-20 text-slate-100">
        <section className="mx-auto max-w-4xl">
          <div className="premium-card pro-card rounded-[2.5rem] p-8 text-center md:p-12">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] bg-emerald-400/10 text-emerald-300 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={54} />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-200">
              <Sparkles size={16} />
              Returned from payment
            </div>

            <h1 className="mt-6 text-5xl font-black leading-tight">
              Your payment return was{" "}
              <span className="gradient-text">successful.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              PayHere redirected you back to SkillProof AI. Final paid status is
              confirmed by the backend notification callback.
            </p>

            {loading && (
              <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950/60 px-5 py-3 text-slate-300">
                <Loader2 className="animate-spin" size={18} />
                Checking payment status...
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            {payment && (
              <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/50 p-5 text-left">
                <p className="text-sm text-slate-400">Order ID</p>
                <p className="mt-1 font-black">{payment.orderId}</p>

                <p className="mt-4 text-sm text-slate-400">Payment Status</p>
                <p className="mt-1 font-black text-emerald-300">
                  {payment.status}
                </p>

                <p className="mt-4 text-sm text-slate-400">Amount</p>
                <p className="mt-1 font-black">
                  {payment.currency} {payment.amount}
                </p>
              </div>
            )}

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "Payment returned",
                  text: "Checkout flow completed",
                },
                {
                  icon: Award,
                  title: "Certificate",
                  text: "Credential stays available",
                },
                {
                  icon: Download,
                  title: "Public proof",
                  text: "Verification page available",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5 text-left"
                >
                  <item.icon className="mb-4 text-emerald-300" size={30} />
                  <h3 className="font-black">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-2">
              <Link to="/student/dashboard" className="primary-btn text-center">
                Go to Student Dashboard
              </Link>

              <Link to="/pricing" className="secondary-btn text-center">
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