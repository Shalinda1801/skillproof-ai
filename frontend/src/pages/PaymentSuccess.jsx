import { Award, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const PaymentSuccess = () => {
  return (
    <>
      <Navbar />

      <main className="grid min-h-[80vh] place-items-center px-6 py-20">
        <div className="premium-card max-w-2xl rounded-[2rem] p-10 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-400/10 text-emerald-300">
            <CheckCircle2 size={46} />
          </div>

          <h1 className="mt-6 text-4xl font-black">Payment successful</h1>
          <p className="mt-4 leading-8 text-slate-400">
            Your certificate payment has been marked as successful. In the real
            payment gateway version, this page will be shown after PayHere
            confirms the transaction.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link to="/student/dashboard" className="primary-btn">
              Go to Dashboard
            </Link>
            <Link to="/verify/CERT-2026-000001" className="secondary-btn">
              View Demo Certificate
            </Link>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/50 p-5 text-left">
            <p className="flex items-center gap-3 text-slate-300">
              <ShieldCheck className="text-emerald-300" />
              Certificate verification flow is ready.
            </p>
            <p className="mt-3 flex items-center gap-3 text-slate-300">
              <Award className="text-purple-300" />
              Admin-generated certificate can be verified publicly.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PaymentSuccess;