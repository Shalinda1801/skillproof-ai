import {
  Award,
  Brain,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const workflowItems = [
  {
    label: "Project Evidence",
    value: "Submitted",
    icon: CheckCircle2,
  },
  {
    label: "AI Assessment",
    value: "Scored 90%",
    icon: Brain,
  },
  {
    label: "Verifier Review",
    value: "Approved",
    icon: ShieldCheck,
  },
  {
    label: "QR Certificate",
    value: "Generated",
    icon: QrCode,
  },
];

const HeroCredentialVisual = () => {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-purple-500/30 blur-3xl" />

      <div className="hero-visual-shell relative">
        <div className="hero-visual-card">
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">
                <Sparkles size={14} />
                Live Skill Credential
              </div>

              <p className="mt-5 text-sm text-slate-400">Verification Score</p>
              <h2 className="mt-1 text-7xl font-black gradient-text">90%</h2>
              <p className="mt-2 text-sm text-slate-400">
                AI-reviewed and verifier-approved
              </p>
            </div>

            <div className="hero-shield-orb">
              <ShieldCheck size={44} />
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {workflowItems.map((item, index) => (
              <div
                key={item.label}
                className="hero-flow-row"
                style={{ animationDelay: `${index * 0.35}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950/70 text-cyan-200">
                    <item.icon size={19} />
                  </div>
                  <span>{item.label}</span>
                </div>

                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-300">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-floating-badge hero-floating-badge-one">
          <Award size={22} />
          Verified
        </div>

        <div className="hero-floating-badge hero-floating-badge-two">
          <QrCode size={22} />
          QR Ready
        </div>
      </div>
    </div>
  );
};

export default HeroCredentialVisual;