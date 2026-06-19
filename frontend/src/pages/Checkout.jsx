import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Checkout = () => {
  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden px-6 py-20 text-slate-100">
        <div className="video-feel-bg" />

        <section className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Link
              to="/pricing"
              className="mb-6 inline-flex items-center gap-2 text-sm text-slate-300"
            >
              <ArrowLeft size={16} />
              Back to pricing
            </Link>

            <div className="premium-card rounded-[2rem] p-8">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-blue-500/10 text-blue-300">
                <CreditCard size={34} />
              </div>

              <h1 className="mt-6 text-4xl font-black">
                Complete certificate payment
              </h1>
              <p className="mt-4 leading-8 text-slate-400">
                This checkout page is prepared for the payment gateway flow.
                Later we can connect PayHere sandbox to process real test
                payments.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Certificate review fee",
                  "QR verification link",
                  "Public credential page",
                  "Admin approval workflow",
                ].map((item) => (
                  <p key={item} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={18} className="text-emerald-300" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="premium-card rounded-[2rem] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-300">
              Order summary
            </p>

            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">Pro Certificate</h2>
                  <p className="mt-2 text-slate-400">
                    One verified micro-credential certificate
                  </p>
                </div>
                <ShieldCheck className="text-emerald-300" size={34} />
              </div>

              <div className="mt-7 space-y-4 border-t border-slate-800 pt-5">
                <div className="flex justify-between text-slate-400">
                  <span>Certificate package</span>
                  <span>LKR 1,500</span>
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

            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="flex items-center gap-3 text-sm text-slate-400">
                <Lock size={17} className="text-emerald-300" />
                Secure sandbox checkout placeholder. Real PayHere connection can
                be added next.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Link to="/payment-success" className="primary-btn text-center">
                Simulate Success
              </Link>
              <Link to="/payment-failed" className="secondary-btn text-center">
                Simulate Failed
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Checkout;