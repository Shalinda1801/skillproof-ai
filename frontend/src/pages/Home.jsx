import {
  Award,
  Brain,
  Calendar,
  ClipboardCheck,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SectionBadge from "../components/ui/SectionBadge";
import heroImage from "../assets/images/skillproof-hero-verified-talent.png";
import credentialImage from "../assets/images/skillproof-credential-verification.png";
import candidateDashboardImage from "../assets/images/skillproof-candidate-dashboard.png";
import reviewWorkspaceImage from "../assets/images/skillproof-review-workspace.png";
import trustedHiringImage from "../assets/images/skillproof-trusted-hiring.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const services = [
  {
    icon: Brain,
    title: "AI-Assisted Assessment",
    text: "Automatically analyzes student submissions and produces scores, strengths, weaknesses, and improvement suggestions.",
  },
  {
    icon: ClipboardCheck,
    title: "Verifier Workflow",
    text: "Admins review AI feedback and project evidence before approving or rejecting a certificate.",
  },
  {
    icon: Award,
    title: "QR Certificates",
    text: "Generate public, verifiable certificates with certificate IDs and QR-ready verification links.",
  },
  {
    icon: Search,
    title: "Public Verification",
    text: "Companies can verify certificates instantly without logging in.",
  },
];

const workflow = [
  "Student selects challenge",
  "Student submits GitHub evidence",
  "AI assessment is generated",
  "Admin reviews and approves",
  "QR certificate is issued",
];

const testimonials = [
  {
    name: "Tech Recruiter",
    role: "Hiring Team",
    text: "SkillProof AI makes student skills easier to verify because evidence, assessment, and certificate verification are connected.",
  },
  {
    name: "Student Developer",
    role: "MERN Learner",
    text: "The platform helps me present my projects as verified skills, not just portfolio links.",
  },
  {
    name: "Course Verifier",
    role: "Admin",
    text: "AI feedback speeds up review while keeping final approval under human control.",
  },
];

const Home = () => {
  return (
    <>
      <Navbar />
      <AnimatedBackground />
<main className="relative z-10 overflow-hidden text-slate-100">
      
        

        {/* HERO */}
        <section className="hero-grid relative px-6 py-24 lg:py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-200">
                <Sparkles size={17} />
                AI-powered skill verification platform
              </div>

              <h1 className="max-w-5xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                Turn student projects into{" "}
                <span className="gradient-text">trusted skill credentials.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                SkillProof AI helps students prove practical skills through
                challenge submissions, AI-assisted feedback, verifier approval,
                and QR-verified certificates.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/register" className="primary-btn">
                  Start Verification
                </Link>
                <Link to="/verify" className="secondary-btn">
                  Verify Certificate
                </Link>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
                {[
                  ["AI", "Assessment"],
                  ["QR", "Verify"],
                   ["360°", "Skill Proof"],
                ].map(([value, label]) => (
                  <div key={label} className="premium-card rounded-3xl p-5">
                    <p className="text-3xl font-black gradient-text">{value}</p>
                    <p className="mt-1 text-sm text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

       <motion.div
  className="relative"
  initial={{ opacity: 0, scale: 0.92, y: 30 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.8 }}
>
  <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/50 p-2 shadow-2xl shadow-blue-500/20">
    <img
      src={heroImage}
      alt="SkillProof verified talent dashboard"
      className="h-full w-full rounded-[2rem] object-cover"
    />
  </div>
</motion.div>

          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="relative px-6 py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionBadge>About</SectionBadge>
              <h2 className="text-4xl font-black md:text-5xl">
                Built for students, verifiers, and companies.
              </h2>
            </div>

            <div className="premium-card pro-card rounded-[2rem] p-8">
              <p className="text-lg leading-8 text-slate-300">
                Many students have projects, but companies need trusted proof.
                SkillProof AI connects project evidence, AI feedback, admin
                review, and certificate verification into one professional
                workflow.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  ["Students", "Submit evidence"],
                  ["Admins", "Review skills"],
                  ["Companies", "Verify certificates"],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-3xl bg-slate-950/60 p-5">
                    <h3 className="font-black">{title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <SectionBadge>Services</SectionBadge>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="max-w-3xl text-4xl font-black md:text-5xl">
                Everything needed for modern skill verification.
              </h2>
              <p className="max-w-xl leading-7 text-slate-400">
                The platform combines AI, human review, certificates, and public
                verification in one modern skill verification platform.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {services.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="premium-card card-hover tilt-card shine-card rounded-[2rem] p-6"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <item.icon className="mb-5 text-blue-300" size={34} />
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-400">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <SectionBadge>How it works</SectionBadge>
            <h2 className="max-w-3xl text-4xl font-black md:text-5xl">
              A complete skill proof workflow from submission to verification.
            </h2>

            <div className="mt-10 grid gap-5 md:grid-cols-5">
              {workflow.map((step, index) => (
                <div key={step} className="premium-card rounded-[2rem] p-6">
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/10 text-xl font-black text-blue-300">
                    {index + 1}
                  </div>
                  <p className="font-black">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

       {/* GALLERY */}
<section id="gallery" className="px-6 py-24">
  <div className="mx-auto max-w-7xl">
    <SectionBadge>Gallery</SectionBadge>

    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <h2 className="max-w-3xl text-4xl font-black md:text-5xl">
        A premium experience for verified talent and trusted hiring.
      </h2>

      <p className="max-w-xl leading-7 text-slate-400">
        SkillProof gives companies a clean way to review verified candidates,
        confirm credentials, and make confident hiring decisions.
      </p>
    </div>

    <div className="mt-10 grid gap-6 lg:grid-cols-2">
      <div className="premium-card rounded-[2.5rem] p-4">
        <img
          src={candidateDashboardImage}
          alt="Candidate dashboard preview"
          className="h-full w-full rounded-[2rem] object-cover"
        />
      </div>

      <div className="premium-card rounded-[2.5rem] p-4">
        <img
          src={credentialImage}
          alt="Credential verification preview"
          className="h-full w-full rounded-[2rem] object-cover"
        />
      </div>

      <div className="premium-card rounded-[2.5rem] p-4">
        <img
          src={reviewWorkspaceImage}
          alt="Review workspace preview"
          className="h-full w-full rounded-[2rem] object-cover"
        />
      </div>

      <div className="premium-card rounded-[2.5rem] p-4">
        <img
          src={trustedHiringImage}
          alt="Trusted hiring workflow preview"
          className="h-full w-full rounded-[2rem] object-cover"
        />
      </div>
    </div>
  </div>
</section>
        {/* TESTIMONIALS */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <SectionBadge>Testimonials</SectionBadge>
            <h2 className="max-w-3xl text-4xl font-black md:text-5xl">
              Designed for real-world trust.
            </h2>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {testimonials.map((item) => (
                <div key={item.name} className="premium-card rounded-[2rem] p-6">
                  <p className="leading-7 text-slate-300">“{item.text}”</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-800">
                      <Users size={22} />
                    </div>
                    <div>
                      <p className="font-black">{item.name}</p>
                      <p className="text-sm text-slate-400">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="px-6 py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionBadge>Contact</SectionBadge>
              <h2 className="text-4xl font-black md:text-5xl">
                Want to verify a skill credential?
              </h2>
              <p className="mt-5 leading-8 text-slate-400">
                Use the verification page to check a certificate, or login to
                access your student/admin dashboard.
              </p>
            </div>

            <div className="premium-card rounded-[2rem] p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <Link to="/verify" className="primary-btn text-center">
                  Verify Certificate
                </Link>
                <Link to="/login" className="secondary-btn text-center">
                  Login Dashboard
                </Link>
              </div>

              <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
                <Calendar className="mb-4 text-cyan-300" />
                <h3 className="text-xl font-black">Demo credentials</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Admin: admin@skillproof.com / admin123456
                  <br />
                  Student: kavindu@example.com / 123456
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;