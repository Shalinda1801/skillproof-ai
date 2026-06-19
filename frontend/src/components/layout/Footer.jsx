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
    { label: "Demo Certificate", path: "/verify/CERT-2026-000001" },
  ],
  Resources: [
    { label: "About", path: "/#about" },
    { label: "How It Works", path: "/#services" },
    { label: "Platform Preview", path: "/#gallery" },
    { label: "Contact", path: "/#contact" },
  ],
};

const capabilities = [
  { label: "AI Review", icon: Brain },
  { label: "Human Approval", icon: ClipboardCheck },
  { label: "QR Verification", icon: Search },
  { label: "Trusted Certificates", icon: Award },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-slate-800/80 bg-slate-950 px-6 py-16">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-600/25">
                <ShieldCheck size={28} />
              </div>
              <div>
                <p className="text-xl font-black tracking-tight">
                  SkillProof AI
                </p>
                <p className="text-sm text-slate-400">
                  Verified skills. Trusted credentials.
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-md leading-8 text-slate-400">
              SkillProof AI helps learners transform real project work into
              verifiable digital credentials that institutions, recruiters, and
              companies can trust.
            </p>

            <div className="mt-6 grid gap-3 text-sm text-slate-400">
              <p className="flex items-center gap-3">
                <Sparkles size={17} className="text-blue-300" />
                Smart review workflow for skill evidence
              </p>
              <p className="flex items-center gap-3">
                <ShieldCheck size={17} className="text-purple-300" />
                Secure role-based credential approval
              </p>
              <p className="flex items-center gap-3">
                <Award size={17} className="text-emerald-300" />
                Public certificate verification for employers
              </p>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-lg font-black">{title}</h3>
              <div className="mt-5 space-y-3">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="block text-sm font-medium text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-lg font-black">Platform Capabilities</h3>
              <p className="mt-2 text-sm text-slate-400">
                A complete credential workflow from evidence submission to
                public certificate verification.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {capabilities.map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm font-bold text-slate-300"
                >
                  <item.icon size={16} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} SkillProof AI. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/verify" className="hover:text-white">
              Verify Certificate
            </Link>
            <Link to="/pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link to="/login" className="hover:text-white">
              Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;