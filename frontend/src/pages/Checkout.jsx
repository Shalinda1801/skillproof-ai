import {
  AlertTriangle,
  ArrowLeft,
  Award,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { paymentApi } from "../api/paymentApi";

const Checkout = () => {
  const { planId } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isCertificateCheckout = planId && planId !== "pro-certificate";

  const submitPayHereForm = (checkoutData) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = checkoutData.checkoutUrl;

    Object.entries(checkoutData).forEach(([key, value]) => {
      if (key === "checkoutUrl" || key === "sandbox") return;

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value ?? "";
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handlePayNow = async () => {
    if (!isCertificateCheckout) {
      setError(
        "Please open checkout from your Student Dashboard certificate card."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await paymentApi.createCertificatePayment(planId);

      if (response.alreadyPaid) {
        window.location.href = "/student/dashboard";
        return;
      }

      if (response.redirectUrl) {
  window.location.href = response.redirectUrl;
  return;
}

submitPayHereForm(response.checkoutData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to start payment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 overflow-hidden px-6 py-20 text-slate-100">
        <section className="mx-auto max-w-7xl">
          <Link
            to="/student/dashboard"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </Link>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          {!isCertificateCheckout && (
            <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 shrink-0" size={18} />
                <p>
                  This checkout needs a real certificate ID. Go to your Student
                  Dashboard, find your certificate, then click Pay Certificate
                  Fee.
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
            <div className="premium-card pro-card rounded-[2.5rem] p-8 md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
                <Lock size={16} />
                Secure PayHere checkout
              </div>

              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight">
                Complete your{" "}
                <span className="gradient-text">certificate payment.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
                Your payment order is created securely by SkillProof AI. After
                payment, PayHere redirects you back to the success or failed
                page.
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Verified",
                    text: "Admin reviewed",
                  },
                  {
                    icon: Award,
                    title: "Certificate",
                    text: "QR ready",
                  },
                  {
                    icon: Sparkles,
                    title: "AI Review",
                    text: "Assessment included",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5"
                  >
                    <item.icon className="mb-4 text-blue-300" size={28} />
                    <h3 className="font-black">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-950/50 p-6">
                <h2 className="text-2xl font-black">Payment method</h2>
                <p className="mt-2 text-sm text-slate-400">
                  PayHere sandbox/live checkout will handle card and supported
                  gateway payment methods.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-blue-400/40 bg-blue-500/10 p-5 text-left">
                    <CreditCard className="mb-4 text-blue-300" size={30} />
                    <p className="font-black">PayHere Checkout</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Secure redirect payment flow
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5 text-left">
                    <ShieldCheck className="mb-4 text-emerald-300" size={30} />
                    <p className="font-black">Payment verification</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Backend validates PayHere notification hash
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="premium-card pro-card rounded-[2.5rem] p-8">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-purple-500/10 text-purple-300">
                <Award size={34} />
              </div>

              <h2 className="mt-6 text-3xl font-black">Order Summary</h2>
              <p className="mt-2 text-slate-400">
                Certificate ID: {isCertificateCheckout ? planId : "Not selected"}
              </p>

              <div className="mt-7 rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black">Pro Certificate</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      One verifier-approved certificate with public QR
                      verification.
                    </p>
                  </div>
                  <ShieldCheck className="shrink-0 text-emerald-300" />
                </div>

                <div className="mt-6 space-y-4 border-t border-slate-800 pt-5">
                  <div className="flex justify-between text-slate-400">
                    <span>Certificate payment</span>
                    <span>LKR 1,500</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>QR verification</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Platform fee</span>
                    <span>LKR 0</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-4 text-xl font-black">
                    <span>Total</span>
                    <span className="gradient-text">LKR 1,500</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                <p className="flex items-start gap-3 text-sm leading-6 text-emerald-100">
                  <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
                  After payment, you will return to SkillProof AI automatically.
Your certificate access will be updated once the payment is confirmed.
                </p>
              </div>

              <div className="mt-6 grid gap-4">
                <button
                  onClick={handlePayNow}
                  disabled={loading || !isCertificateCheckout}
                  className="primary-btn inline-flex justify-center gap-2 text-center disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <CreditCard size={18} />
                  )}
                  Continue to Secure Payment
                </button>

                <p className="text-center text-xs leading-6 text-slate-500">
                  You will be redirected to PayHere checkout.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Checkout;