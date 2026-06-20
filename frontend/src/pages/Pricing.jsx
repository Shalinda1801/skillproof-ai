import {
  Award,
  Brain,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import SectionBadge from "../components/ui/SectionBadge";

const plans = [
  {
    name: "Starter",
    price: "Free",
    subtitle: "For learners starting skill verification",
    icon: Sparkles,
    features: [
      "Create student account",
      "View available challenges",
      "Submit project evidence",
      "Receive AI-assisted feedback",
    ],
    button: "Start Free",
    path: "/register",
    highlighted: false,
  },
  {
    name: "Pro Certificate",
    price: "LKR 1,500",
    subtitle: "For verified certificates and public proof",
    icon: Award,
    features: [
      "Everything in Starter",
      "Verifier-reviewed approval",
      "QR-verifiable certificate",
      "Public certificate validation page",
      "Company-friendly credential link",
    ],
    button: "Continue to Checkout",
    path: "/checkout/pro-certificate",
    highlighted: true,
  },
  {
    name: "Institution",
    price: "Custom",
    subtitle: "For training centers and academic teams",
    icon: Users,
    features: [
      "Bulk learner verification",
      "Admin review workspace",
      "Certificate management",
      "Verification tracking",
      "Custom workflow support",
    ],
    button: "Contact Sales",
    path: "/#contact",
    highlighted: false,
  },
];

const trustPoints = [
  {
    icon: Brain,
    title: "AI-assisted review",
    text: "Submissions can be reviewed with AI feedback before final approval.",
  },
  {
    icon: ShieldCheck,
    title: "Human verification",
    text: "Final certificate decisions stay trusted through verifier approval.",
  },
  {
    icon: CreditCard,
    title: "Payment-ready flow",
    text: "Checkout screens are prepared for payment gateway integration.",
  },
];

const Pricing = () => {
  return (
    <>
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 overflow-hidden px-6 py-20 text-slate-100">
        <section className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <SectionBadge>Pricing</SectionBadge>

              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
                Choose the right plan for{" "}
                <span className="gradient-text">trusted credentials.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                Start free with skill challenges, then upgrade when you need a
                verifier-approved certificate with public QR verification.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to="/register" className="primary-btn text-center">
                  Get Started
                </Link>
                <Link to="/verify" className="secondary-btn text-center">
                  Verify Certificate
                </Link>
              </div>
            </div>

            <div className="premium-card pro-card rounded-[2.5rem] p-8">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-blue-500/10 text-blue-300">
                <CreditCard size={34} />
              </div>

              <h2 className="mt-6 text-3xl font-black">
                Certificate payment flow
              </h2>

              <p className="mt-4 leading-8 text-slate-400">
                This pricing flow is designed like a real product checkout.
                Later, PayHere sandbox or another payment gateway can connect to
                the checkout page.
              </p>

              <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Certificate package</span>
                  <span className="font-black">LKR 1,500</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
                  <span className="text-slate-400">Public verification</span>
                  <span className="font-black text-emerald-300">Included</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`premium-card pro-card rounded-[2rem] p-7 ${
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

                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-950/70 text-blue-300">
                  <plan.icon size={28} />
                </div>

                <h2 className="mt-6 text-2xl font-black">{plan.name}</h2>
                <p className="mt-2 min-h-12 text-slate-400">
                  {plan.subtitle}
                </p>

                <p className="mt-6 text-4xl font-black gradient-text">
                  {plan.price}
                </p>

                <div className="mt-7 space-y-4">
                  {plan.features.map((feature) => (
                    <p
                      key={feature}
                      className="flex items-start gap-3 text-slate-300"
                    >
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
            {trustPoints.map((item) => (
              <div key={item.title} className="premium-card pro-card rounded-[2rem] p-6">
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