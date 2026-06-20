import {
  ArrowLeft,
  Award,
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const Checkout = () => {
  const { planId } = useParams();

  return (
    <>
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 overflow-hidden px-6 py-20 text-slate-100">
        <section className="mx-auto max-w-7xl">
          <Link
            to="/pricing"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to pricing
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
            <div className="premium-card pro-card rounded-[2.5rem] p-8 md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
                <Lock size={16} />
                Secure checkout
              </div>

              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight">
                Complete your{" "}
                <span className="gradient-text">certificate payment.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
                This checkout flow is prepared for payment gateway integration.
                For the demo, you can simulate successful or failed payment
                outcomes.
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
                  Demo checkout UI. Real payment gateway connection can be added
                  later.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <button className="rounded-3xl border border-blue-400/40 bg-blue-500/10 p-5 text-left transition hover:border-blue-300">
                    <CreditCard className="mb-4 text-blue-300" size={30} />
                    <p className="font-black">Card Payment</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Visa / Mastercard demo option
                    </p>
                  </button>

                  <button className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5 text-left transition hover:border-slate-600">
                    <ShieldCheck className="mb-4 text-emerald-300" size={30} />
                    <p className="font-black">Gateway Sandbox</p>
                    <p className="mt-1 text-sm text-slate-400">
                      PayHere sandbox can connect here
                    </p>
                  </button>
                </div>
              </div>
            </div>

            <aside className="premium-card pro-card rounded-[2.5rem] p-8">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-purple-500/10 text-purple-300">
                <Award size={34} />
              </div>

              <h2 className="mt-6 text-3xl font-black">Order Summary</h2>
              <p className="mt-2 text-slate-400">
                Plan: {planId || "pro-certificate"}
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
                    <span>Certificate review</span>
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
                  Payment confirmation can later trigger certificate generation
                  or unlock the admin approval workflow.
                </p>
              </div>

           <div className="mt-6 grid gap-4">
  <Link to="/payment-success" className="primary-btn text-center">
    Pay Now
  </Link>

  <p className="text-center text-xs leading-6 text-slate-500">
    Demo mode: this button simulates a successful payment. In production,
    this will redirect to the real payment gateway.
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