import {
  Award,
  CheckCircle2,
  Download,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const PaymentSuccess = () => {
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
              Payment completed
            </div>

            <h1 className="mt-6 text-5xl font-black leading-tight">
              Your certificate payment was{" "}
              <span className="gradient-text">successful.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Your payment has been recorded successfully. In the real gateway
              version, this page will show after payment confirmation from the
              payment provider.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "Payment verified",
                  text: "Transaction status completed",
                },
                {
                  icon: Award,
                  title: "Certificate ready",
                  text: "Credential flow unlocked",
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

              <Link
                to="/verify/CERT-2026-000001"
                className="secondary-btn text-center"
              >
                View Demo Certificate
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