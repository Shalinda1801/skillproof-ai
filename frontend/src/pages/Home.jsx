import { ArrowRight, Brain, CheckCircle2, QrCode, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Brain,
    title: "AI-Assisted Assessment",
    text: "Automatically evaluates student submissions and gives structured feedback.",
  },
  {
    icon: ShieldCheck,
    title: "Verifier Approval",
    text: "Admins review AI feedback and submitted evidence before certificate approval.",
  },
  {
    icon: QrCode,
    title: "QR Verification",
    text: "Companies can verify certificates using a public verification link.",
  },
];

const Home = () => {
  return (
    <main className="min-h-screen overflow-hidden px-6 py-6 text-slate-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight">SkillProof AI</p>
            <p className="text-xs text-slate-400">Verify skills. Build trust.</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/login" className="secondary-btn">
            Login
          </Link>
          <Link to="/register" className="primary-btn">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
            <CheckCircle2 size={16} />
            AI-based student skill verification platform
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Turn student skills into{" "}
            <span className="gradient-text">verified micro-credentials.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            SkillProof AI helps students prove practical skills using challenge
            submissions, AI feedback, verifier approval, and QR-verified
            certificates companies can trust.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/register" className="primary-btn inline-flex items-center gap-2">
              Start Verification
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="secondary-btn">
              Login to Dashboard
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-blue-500/30 blur-3xl" />
          <div className="absolute -right-8 bottom-8 h-44 w-44 rounded-full bg-purple-500/30 blur-3xl" />

          <div className="glass-card relative rounded-[2rem] p-7">
            <div className="rounded-[1.5rem] border border-slate-700/60 bg-slate-950/70 p-6">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Verification Score</p>
                  <p className="text-5xl font-black gradient-text">84%</p>
                </div>
                <div className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-400/15 text-emerald-300">
                  <ShieldCheck size={34} />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  ["GitHub Evidence", "Verified"],
                  ["AI Assessment", "Completed"],
                  ["Admin Review", "Approved"],
                  ["QR Certificate", "Generated"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3"
                  >
                    <span className="text-slate-300">{label}</span>
                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-300">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 pb-16 md:grid-cols-3">
        {features.map((item) => (
          <div key={item.title} className="glass-card rounded-3xl p-6">
            <item.icon className="mb-5 text-blue-300" size={32} />
            <h3 className="text-xl font-black">{item.title}</h3>
            <p className="mt-3 leading-7 text-slate-400">{item.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Home;