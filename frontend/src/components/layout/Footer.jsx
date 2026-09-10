import {
  Award,
  Brain,
  ClipboardCheck,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { label: "Skill Verification", path: "/#services" },
    { label: "AI Assessment", path: "/#services" },
    { label: "Certificate Verification", path: "/verify" },
    { label: "Pricing", path: "/pricing" },
  ],

  Solutions: [
    { label: "For Students", path: "/register" },
    { label: "For Verifiers", path: "/login" },
    { label: "For Companies", path: "/verify" },
    {
      label: "Demo Certificate",
      path: "/verify/CERT-2026-000001",
    },
  ],

  Resources: [
    { label: "About", path: "/#about" },
    { label: "How It Works", path: "/#services" },
    { label: "Platform Preview", path: "/#gallery" },
    { label: "Contact", path: "/#contact" },
  ],
};

const capabilities = [
  {
    label: "AI Review",
    icon: Brain,
  },
  {
    label: "Human Approval",
    icon: ClipboardCheck,
  },
  {
    label: "QR Verification",
    icon: Search,
  },
  {
    label: "Trusted Certificates",
    icon: Award,
  },
];

const Footer = () => {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-slate-200 bg-white px-6 py-16">
      {/* Aurora */}
      <div className="pointer-events-none absolute -left-24 top-5 h-72 w-72 rounded-full bg-blue-400/10 blur-[100px]" />

      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-violet-400/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.45fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl" />

                <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 text-white shadow-[0_14px_35px_rgba(79,70,229,0.24)] transition duration-300 group-hover:-translate-y-1">
                  <ShieldCheck size={28} />
                </div>
              </div>

              <div>
                <p className="text-xl font-black tracking-tight text-slate-900">
                  SkillProof AI
                </p>

                <p className="text-sm font-medium text-slate-500">
                  Verified skills. Trusted credentials.
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-md leading-8 text-slate-600">
              SkillProof AI helps learners transform real project work into
              verifiable digital credentials that institutions, recruiters,
              and companies can trust.
            </p>

            <div className="mt-6 grid gap-3 text-sm font-medium text-slate-600">
              <p className="flex items-center gap-3">
                <Sparkles size={17} className="text-blue-500" />
                Smart review workflow for skill evidence
              </p>

              <p className="flex items-center gap-3">
                <ShieldCheck size={17} className="text-violet-500" />
                Secure role-based credential approval
              </p>

              <p className="flex items-center gap-3">
                <Award size={17} className="text-emerald-500" />
                Public certificate verification for employers
              </p>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-lg font-black text-slate-900">
                {title}
              </h3>

              <div className="mt-5 space-y-3">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="block text-sm font-semibold text-slate-500 transition hover:translate-x-1 hover:text-indigo-600"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Capabilities */}
        <div className="mt-12 rounded-[2rem] border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 p-6 shadow-[0_18px_50px_rgba(51,65,85,0.06)]">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Platform Capabilities
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                A complete credential workflow from evidence submission to
                public certificate verification.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {capabilities.map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:text-indigo-700"
                >
                  <item.icon size={16} className="text-indigo-500" />

                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} SkillProof AI. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5">
            <Link
              to="/verify"
              className="font-semibold transition hover:text-indigo-600"
            >
              Verify Certificate
            </Link>

            <Link
              to="/pricing"
              className="font-semibold transition hover:text-indigo-600"
            >
              Pricing
            </Link>

            <Link
              to="/login"
              className="font-semibold transition hover:text-indigo-600"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;