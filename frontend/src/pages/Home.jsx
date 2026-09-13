import {
  ArrowRight,
  Award,
  Brain,
  Calendar,
  ClipboardCheck,
  Code2,
  GitBranch,
  Globe2,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import HeroSlider from "../components/ui/HeroSlider";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import AnimatedBackground from "../components/ui/AnimatedBackground";

import SectionBadge from "../components/ui/SectionBadge";


/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const revealLeft = {
  hidden: {
    opacity: 0,
    x: -40,
  },

  visible: {
    opacity: 1,
    x: 0,
  },
};


const revealRight = {
  hidden: {
    opacity: 0,
    x: 40,
  },

  visible: {
    opacity: 1,
    x: 0,
  },
};


/* =========================================================
   SERVICES
========================================================= */

const services = [
  {
    icon: Brain,
    title: "AI-Assisted Assessment",
    text: "Analyze project submissions and produce structured scores, strengths, weaknesses, and practical improvement suggestions.",
    iconClass: "text-violet-600",
    iconBg:
      "bg-gradient-to-br from-violet-50 to-purple-100 border-violet-200",
    glowClass: "bg-violet-400/15",
  },

  {
    icon: ClipboardCheck,
    title: "Human Verification",
    text: "Admins review project evidence and AI feedback before making the final approval or rejection decision.",
    iconClass: "text-blue-600",
    iconBg:
      "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200",
    glowClass: "bg-blue-400/15",
  },

  {
    icon: Award,
    title: "Trusted Certificates",
    text: "Issue digital certificates connected to approved projects, assessment results, students, and verified skills.",
    iconClass: "text-cyan-600",
    iconBg:
      "bg-gradient-to-br from-cyan-50 to-sky-100 border-cyan-200",
    glowClass: "bg-cyan-400/15",
  },

  {
    icon: Search,
    title: "Public Verification",
    text: "Companies can verify certificate status instantly through a certificate ID or public QR verification page.",
    iconClass: "text-emerald-600",
    iconBg:
      "bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-200",
    glowClass: "bg-emerald-400/15",
  },
];


/* =========================================================
   WORKFLOW
========================================================= */

const workflow = [
  {
    icon: Code2,
    title: "Select challenge",
    text: "Choose a practical challenge related to the selected skill path.",
  },

  {
    icon: GitBranch,
    title: "Submit evidence",
    text: "Submit GitHub, live demo, README, and project explanation.",
  },

  {
    icon: Brain,
    title: "AI assessment",
    text: "Receive structured project analysis and recommendations.",
  },

  {
    icon: UserCheck,
    title: "Admin review",
    text: "A verifier reviews the evidence and makes the final decision.",
  },

  {
    icon: QrCode,
    title: "Certificate issued",
    text: "An approved student receives a public QR-verifiable certificate.",
  },
];


/* =========================================================
   TESTIMONIALS
========================================================= */

const testimonials = [
  {
    name: "Student Developer",
    role: "SkillProof learner",
    text: "SkillProof turns my real project work into trusted proof instead of leaving it as only another portfolio link.",
  },

  {
    name: "Technical Verifier",
    role: "Review administrator",
    text: "The structured assessment saves review time while final approval stays under human control.",
  },

  {
    name: "Hiring Team",
    role: "Credential verifier",
    text: "The public verification page gives us a fast way to confirm that a candidate credential is genuine.",
  },
];


/* =========================================================
   HOME
========================================================= */

const Home = () => {
  return (
    <>
      <Navbar />

      <AnimatedBackground />

      <main className="relative z-10 overflow-hidden text-slate-900">

        {/* =================================================
            HERO
        ================================================== */}

        <section className="hero-grid relative min-h-[720px] overflow-hidden px-6 pb-24 pt-20 lg:pb-32 lg:pt-28">

          <HeroSlider />

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16">

            {/* HERO LEFT CONTENT */}

            <motion.div
              variants={revealLeft}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.75,
              }}
            >

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/75 px-4 py-2 text-sm font-extrabold text-indigo-700 shadow-sm backdrop-blur-xl">

                <Sparkles
                  size={17}
                  className="text-violet-500"
                />

                AI-powered skill verification platform

              </div>


              <h1 className="max-w-4xl text-5xl font-black leading-[1.04] tracking-[-0.045em] text-slate-900 md:text-7xl">

                Turn student projects into{" "}

                <span className="gradient-text">
                  trusted skill credentials.
                </span>

              </h1>


              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">

                Complete practical challenges, submit real evidence, receive
                AI-assisted feedback, and earn credentials approved by human
                verifiers.

              </p>


              <div className="mt-9 flex flex-wrap gap-4">

                <Link
                  to="/register"
                  className="primary-btn inline-flex items-center gap-2"
                >

                  Start Verification

                  <ArrowRight size={18} />

                </Link>


                <Link
                  to="/verify"
                  className="secondary-btn inline-flex items-center gap-2"
                >

                  <Search size={18} />

                  Verify Certificate

                </Link>

              </div>


              {/* FEATURE MINI CARDS */}

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">

                {[
                  {
                    value: "AI",
                    label: "Assessment",
                    icon: Brain,
                  },

                  {
                    value: "QR",
                    label: "Verification",
                    icon: QrCode,
                  },

                  {
                    value: "360°",
                    label: "Skill Proof",
                    icon: ShieldCheck,
                  },
                ].map((item, index) => (

                  <motion.div
                    key={item.label}
                    className="premium-card card-hover rounded-3xl p-5"
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.4 + index * 0.12,
                    }}
                    whileHover={{
                      y: -7,
                      scale: 1.02,
                    }}
                  >

                    <item.icon
                      className="text-indigo-500"
                      size={22}
                    />

                    <p className="mt-4 text-3xl font-black gradient-text">
                      {item.value}
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {item.label}
                    </p>

                  </motion.div>

                ))}

              </div>

            </motion.div>


          </div>

        </section>


        {/* =================================================
            TRUST STRIP
        ================================================== */}

        <section className="px-6 py-6">

          <div className="mx-auto max-w-7xl">

            <motion.div
              className="premium-card overflow-hidden rounded-[2rem] px-6 py-5"
              initial={{
                opacity: 0,
                y: 22,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
            >

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">

                  Built for trusted skill evidence

                </p>


                <div className="flex flex-wrap gap-3">

                  {[
                    {
                      icon: GitBranch,
                      text: "Project evidence",
                    },

                    {
                      icon: Brain,
                      text: "AI assessment",
                    },

                    {
                      icon: UserCheck,
                      text: "Human approval",
                    },

                    {
                      icon: Globe2,
                      text: "Public verification",
                    },
                  ].map((item) => (

                    <div
                      key={item.text}
                      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm"
                    >

                      <item.icon
                        size={16}
                        className="text-indigo-500"
                      />

                      {item.text}

                    </div>

                  ))}

                </div>

              </div>

            </motion.div>

          </div>

        </section>


        {/* =================================================
            ABOUT
        ================================================== */}

        <section
          id="about"
          className="relative px-6 py-24"
        >

          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">

            <motion.div
              variants={revealLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.65,
              }}
            >

              <SectionBadge>
                About
              </SectionBadge>


              <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">

                Built for students, verifiers, and companies.

              </h2>


              <p className="mt-5 max-w-xl leading-8 text-slate-600">

                SkillProof connects project evidence, structured assessment,
                verifier decisions, and public credentials in one complete
                professional workflow.

              </p>

            </motion.div>


            <motion.div
              className="premium-card pro-card relative overflow-hidden rounded-[2rem] p-8"
              variants={revealRight}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.65,
              }}
            >

              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-400/15 blur-3xl" />


              <div className="relative grid gap-5 md:grid-cols-3">

                {[
                  {
                    icon: Code2,
                    title: "Students",
                    text: "Complete challenges and submit real project evidence.",
                  },

                  {
                    icon: ClipboardCheck,
                    title: "Verifiers",
                    text: "Review assessment results and make trusted decisions.",
                  },

                  {
                    icon: Users,
                    title: "Companies",
                    text: "Verify candidate credentials without needing an account.",
                  },
                ].map((item, index) => (

                  <motion.div
                    key={item.title}
                    className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm"
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.12,
                    }}
                    whileHover={{
                      y: -6,
                    }}
                  >

                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600">

                      <item.icon size={24} />

                    </div>


                    <h3 className="mt-5 text-xl font-black text-slate-900">

                      {item.title}

                    </h3>


                    <p className="mt-3 leading-7 text-slate-600">

                      {item.text}

                    </p>

                  </motion.div>

                ))}

              </div>

            </motion.div>

          </div>

        </section>


        {/* =================================================
            SERVICES
        ================================================== */}

        <section
          id="services"
          className="px-6 py-24"
        >

          <div className="mx-auto max-w-7xl">

            <SectionBadge>
              Services
            </SectionBadge>


            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

              <h2 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 md:text-5xl">

                Everything needed for modern skill verification.

              </h2>


              <p className="max-w-xl leading-7 text-slate-600">

                AI assessment, human review, certificates, and public
                verification work together in one connected platform.

              </p>

            </div>


            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              {services.map((item, index) => (

                <motion.div
                  key={item.title}
                  className="premium-card card-hover shine-card group relative overflow-hidden rounded-[2rem] p-6"
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    y: -9,
                  }}
                >

                  <div
                    className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${item.glowClass}`}
                  />


                  <div
                    className={`relative grid h-14 w-14 place-items-center rounded-2xl border ${item.iconBg} ${item.iconClass}`}
                  >

                    <item.icon size={29} />

                  </div>


                  <h3 className="relative mt-6 text-xl font-black text-slate-900">

                    {item.title}

                  </h3>


                  <p className="relative mt-3 leading-7 text-slate-600">

                    {item.text}

                  </p>


                  <div className="relative mt-6 flex items-center gap-2 text-sm font-black text-indigo-600">

                    Explore feature

                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />

                  </div>

                </motion.div>

              ))}

            </div>

          </div>

        </section>


        {/* =================================================
            WORKFLOW
        ================================================== */}

        <section className="px-6 py-24">

          <div className="mx-auto max-w-7xl">

            <SectionBadge>
              How it works
            </SectionBadge>


            <h2 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 md:text-5xl">

              From project submission to trusted verification.

            </h2>


            <div className="relative mt-12">

              <div className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent lg:block" />


              <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-5">

                {workflow.map((step, index) => (

                  <motion.div
                    key={step.title}
                    className="premium-card card-hover relative rounded-[2rem] p-6"
                    initial={{
                      opacity: 0,
                      y: 28,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.12,
                    }}
                    whileHover={{
                      y: -7,
                    }}
                  >

                    <motion.div
                      className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl border border-indigo-200 bg-indigo-50 text-indigo-600"
                      animate={{
                        boxShadow: [
                          "0 0 0 rgba(79,70,229,0)",
                          "0 0 25px rgba(79,70,229,0.14)",
                          "0 0 0 rgba(79,70,229,0)",
                        ],
                      }}
                      transition={{
                        delay: index * 0.3,
                        duration: 3,
                        repeat: Infinity,
                      }}
                    >

                      <step.icon size={26} />

                    </motion.div>


                    <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-indigo-500">

                      Step {index + 1}

                    </p>


                    <h3 className="mt-2 text-lg font-black text-slate-900">

                      {step.title}

                    </h3>


                    <p className="mt-3 text-sm leading-6 text-slate-600">

                      {step.text}

                    </p>

                  </motion.div>

                ))}

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            PLATFORM PREVIEW
        ================================================== */}

        <section
          id="gallery"
          className="px-6 py-24"
        >

          <div className="mx-auto max-w-7xl">

            <SectionBadge>
              Platform preview
            </SectionBadge>


            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

              <h2 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 md:text-5xl">

                One connected workspace for evidence, review, and trust.

              </h2>


              <p className="max-w-xl leading-7 text-slate-600">

                Every step remains connected from the original project evidence
                to the final public credential.

              </p>

            </div>


            <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">

              {/* AI ASSESSMENT */}

              <motion.div
                className="premium-card relative overflow-hidden rounded-[2.5rem] p-7"
                initial={{
                  opacity: 0,
                  x: -35,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.7,
                }}
              >

                <div className="absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />


                <div className="relative flex items-center justify-between">

                  <div>

                    <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-600">

                      AI assessment

                    </p>


                    <h3 className="mt-3 text-3xl font-black text-slate-900">

                      Structured feedback, not a black-box decision.

                    </h3>

                  </div>


                  <Brain
                    className="hidden text-violet-500 md:block"
                    size={48}
                  />

                </div>


                <div className="relative mt-8 grid gap-4 md:grid-cols-[0.85fr_1.15fr]">

                  <div className="grid place-items-center rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">

                    <div className="relative grid h-44 w-44 place-items-center rounded-full border border-violet-200 bg-violet-50">

                      <motion.div
                        className="absolute h-32 w-32 rounded-full border border-violet-300"
                        animate={{
                          scale: [1, 1.13, 1],
                          opacity: [0.35, 0.85, 0.35],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                      />


                      <motion.div
                        animate={{
                          rotate: [0, 5, 0, -5, 0],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                        }}
                      >

                        <Brain
                          className="text-violet-600"
                          size={65}
                        />

                      </motion.div>

                    </div>


                    <p className="mt-5 text-center text-sm leading-6 text-slate-600">

                      Evaluating code quality, project structure, security,
                      performance, and documentation.

                    </p>

                  </div>


                  <div className="space-y-3">

                    {[
                      {
                        label: "Code quality",
                        value: 92,
                      },

                      {
                        label: "Functionality",
                        value: 88,
                      },

                      {
                        label: "Security",
                        value: 90,
                      },

                      {
                        label: "Documentation",
                        value: 84,
                      },
                    ].map((metric, index) => (

                      <div
                        key={metric.label}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                      >

                        <div className="flex justify-between">

                          <p className="text-sm font-bold text-slate-700">

                            {metric.label}

                          </p>


                          <p className="text-sm font-black text-indigo-600">

                            {metric.value}%

                          </p>

                        </div>


                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"
                            initial={{
                              width: 0,
                            }}
                            whileInView={{
                              width: `${metric.value}%`,
                            }}
                            viewport={{
                              once: true,
                            }}
                            transition={{
                              delay: index * 0.12,
                              duration: 0.9,
                            }}
                          />

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              </motion.div>


              {/* RIGHT SIDE */}

              <div className="grid gap-6">

                {/* HUMAN VERIFICATION */}

                <motion.div
                  className="premium-card card-hover rounded-[2rem] p-7"
                  initial={{
                    opacity: 0,
                    x: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.7,
                  }}
                >

                  <div className="flex items-center justify-between">

                    <div className="grid h-14 w-14 place-items-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">

                      <ClipboardCheck size={29} />

                    </div>


                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">

                      APPROVED

                    </span>

                  </div>


                  <h3 className="mt-6 text-2xl font-black text-slate-900">

                    Human verifier approval

                  </h3>


                  <p className="mt-3 leading-7 text-slate-600">

                    AI assists the review, while a trusted verifier remains in
                    control of the final certificate decision.

                  </p>

                </motion.div>


                {/* QR VERIFICATION */}

                <motion.div
                  className="premium-card card-hover rounded-[2rem] p-7"
                  initial={{
                    opacity: 0,
                    x: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15,
                  }}
                >

                  <div className="flex items-center justify-between">

                    <div className="grid h-14 w-14 place-items-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-600">

                      <QrCode size={29} />

                    </div>


                    <ShieldCheck
                      className="text-slate-400"
                      size={24}
                    />

                  </div>


                  <h3 className="mt-6 text-2xl font-black text-slate-900">

                    Public QR verification

                  </h3>


                  <p className="mt-3 leading-7 text-slate-600">

                    Employers can confirm the credential status, student,
                    skill, assessment score, and issue date.

                  </p>

                </motion.div>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            TESTIMONIALS
        ================================================== */}

        <section className="px-6 py-24">

          <div className="mx-auto max-w-7xl">

            <SectionBadge>
              Testimonials
            </SectionBadge>


            <h2 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 md:text-5xl">

              Designed for real-world trust.

            </h2>


            <div className="mt-10 grid gap-5 md:grid-cols-3">

              {testimonials.map((item, index) => (

                <motion.div
                  key={item.name}
                  className="premium-card card-hover rounded-[2rem] p-7"
                  initial={{
                    opacity: 0,
                    y: 24,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.12,
                  }}
                  whileHover={{
                    y: -7,
                  }}
                >

                  <div className="flex gap-1 text-amber-400">

                    {[1, 2, 3, 4, 5].map((star) => (

                      <Star
                        key={star}
                        size={16}
                        fill="currentColor"
                      />

                    ))}

                  </div>


                  <p className="mt-6 leading-7 text-slate-700">

                    “{item.text}”

                  </p>


                  <div className="mt-7 flex items-center gap-3">

                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600">

                      <Users size={22} />

                    </div>


                    <div>

                      <p className="font-black text-slate-900">

                        {item.name}

                      </p>


                      <p className="text-sm text-slate-500">

                        {item.role}

                      </p>

                    </div>

                  </div>

                </motion.div>

              ))}

            </div>

          </div>

        </section>


        {/* =================================================
            FINAL CTA
        ================================================== */}

        <section
          id="contact"
          className="px-6 py-24"
        >

          <motion.div
            className="premium-card pro-card relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] px-8 py-14 text-center md:px-14 md:py-20"
            initial={{
              opacity: 0,
              y: 35,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl" />


            <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-violet-400/15 blur-3xl" />


            <motion.div
              className="relative mx-auto grid h-20 w-20 place-items-center rounded-[1.75rem] bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 text-white shadow-[0_20px_55px_rgba(79,70,229,0.25)]"
              animate={{
                y: [0, -8, 0],
                rotate: [0, 3, 0, -3, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >

              <ShieldCheck size={38} />

            </motion.div>


            <div className="relative">

              <p className="mt-7 text-sm font-black uppercase tracking-[0.3em] text-indigo-600">

                Secure. Verified. Trusted.

              </p>


              <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl">

                Your practical skills deserve{" "}

                <span className="gradient-text">

                  trusted recognition.

                </span>

              </h2>


              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">

                Start a challenge, submit project evidence, and build a
                credential that companies can verify publicly.

              </p>


              <div className="mt-9 flex flex-wrap justify-center gap-4">

                <Link
                  to="/register"
                  className="primary-btn inline-flex items-center gap-2"
                >

                  Get Started

                  <ArrowRight size={18} />

                </Link>


                <Link
                  to="/verify"
                  className="secondary-btn inline-flex items-center gap-2"
                >

                  <Search size={18} />

                  Verify Certificate

                </Link>

              </div>

            </div>

          </motion.div>

        </section>


        {/* =================================================
            DEMO
        ================================================== */}

        <section className="px-6 pb-24">

          <div className="mx-auto max-w-7xl">

            <div className="premium-card rounded-[2rem] p-7">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-start gap-4">

                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-600">

                    <Calendar size={24} />

                  </div>


                  <div>

                    <h3 className="text-xl font-black text-slate-900">

                      Explore the SkillProof demo

                    </h3>


                    <p className="mt-2 text-sm leading-7 text-slate-600">

                      Admin: admin@skillproof.com / admin123456

                      <br />

                      Student: kavindu@example.com / 123456

                    </p>

                  </div>

                </div>


                <Link
                  to="/login"
                  className="secondary-btn inline-flex justify-center"
                >

                  Open Login

                </Link>

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
