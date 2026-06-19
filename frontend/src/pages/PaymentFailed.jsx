import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const PaymentFailed = () => {
  return (
    <>
      <Navbar />

      <main className="grid min-h-[80vh] place-items-center px-6 py-20">
        <div className="premium-card max-w-2xl rounded-[2rem] p-10 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-red-400/10 text-red-300">
            <AlertTriangle size={46} />
          </div>

          <h1 className="mt-6 text-4xl font-black">Payment failed</h1>
          <p className="mt-4 leading-8 text-slate-400">
            The payment was not completed. In the real gateway version, this page
            will show after a cancelled or failed transaction.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link to="/checkout/pro-certificate" className="primary-btn">
              <RefreshCcw className="mr-2" size={18} />
              Try Again
            </Link>
            <Link to="/pricing" className="secondary-btn">
              Back to Pricing
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PaymentFailed;