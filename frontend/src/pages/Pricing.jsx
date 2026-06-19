import {
  Award,
  Brain,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SectionBadge from "../components/ui/SectionBadge";

const plans = [
  {
    name: "Starter",
    price: "Free",
    subtitle: "For students starting skill verification",
    features: [
      "View available challenges",
      "Submit project evidence",
      "AI-assisted feedback",
      "Basic certificate eligibility",
    ],
    button: "Start Free",
    path: "/register",
    highlighted: false,
  },
  {
    name: "Pro Certificate",
    price: "LKR 1,500",
    subtitle: "For verified certificate generation",
    features: [
      "Everything in Starter",
      "Admin reviewed certificate",
      "QR public verification",
      "Certificate verification page",
      "Company-friendly credential link",
    ],
    button: "Continue to Payment",
    path: "/checkout/pro-certificate",
    highlighted: true,
  },
  {
    name: "Institution",
    price: "Custom",
    subtitle: "For institutes and training centers",
    features: [
      "Bulk student verification",
      "Admin review workflow",
      "Certificate management",
      "Verification tracking",
      "Custom branding support",
    ],
    button: "Contact Us",
    path: "/#contact",
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <>
      <Navbar />

      <main className="relative overflow-hidden px-6 py-20 text-slate-100">
        <div className="video-feel-bg" />

        <section className="relative mx-auto max-w-7xl">
          <SectionBadge>Pricing</SectionBadge>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-6xl">
                Simple pricing for{" "}
                <span className="gradient-text">verified skills.</span>
              </h1>
              <p className="mt-5 max-w-2xl leading-8 text-slate-400">
                Students can start free, then pay only when they need a
                professionally reviewed QR-verifiable certificate.
              </p>
            </div>

            <div className="premium-card pro-rounded-3xl p-5">
              <CreditCard className="mb-3 text-blue-300" />
              <p className="font-black">Sandbox Payment Ready</p>
              <p className="mt-1 text-sm text-slate-400">
                PayHere integration can connect here later.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`premium-card card-hover rounded-[2rem] p-7 ${
                  plan.highlighted
                    ? "border-blue-400/50 shadow-blue-600/20"
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="mb-5 inline-flex rounded-full bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-200">
                    Recommended
                  </div>
                )}

                <h2 className="text-2xl font-black">{plan.name}</h2>
                <p className="mt-2 min-h-12 text-slate-400">{plan.subtitle}</p>

                <p className="mt-6 text-4xl font-black gradient-text">
                  {plan.price}
                </p>

                <div className="mt-7 space-y-4">
                  {plan.features.map((feature) => (
                    <p key={feature} className="flex items-start gap-3 text-slate-300">
                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-emerald-300"
                      />
                      {feature}
                    </p>
                  ))}
                </div>

                <Link
                  to={plan.path}
                  className={`mt-8 inline-flex w-full justify-center ${
                    plan.highlighted ? "primary-btn" : "secondary-btn"
                  }`}
                >
                  {plan.button}
                </Link>
              </div>
            ))}
          </div>

          <section className="mt-14 grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: Brain,
                title: "AI feedback first",
                text: "AI helps review submissions before certificate approval.",
              },
              {
                icon: ShieldCheck,
                title: "Human approval",
                text: "Admin review keeps final certificate decisions trusted.",
              },
              {
                icon: Award,
                title: "QR verification",
                text: "Certificates can be publicly verified by companies.",
              },
            ].map((item) => (
              <div key={item.title} className="premium-card rounded-[2rem] p-6">
                <item.icon className="mb-5 text-purple-300" size={34} />
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{item.text}</p>
              </div>
            ))}
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Pricing;