import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import AnimatedBackground from "../components/ui/AnimatedBackground";
import { useAuth } from "../context/useAuth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const { login, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");

      const user = await login(data);

      navigate(getDashboardPath(user.role));
    } catch (error) {
      setServerError(
        error?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <>
      <AnimatedBackground />

      <main className="relative z-10 min-h-screen px-4 py-6 text-slate-900 sm:px-6 sm:py-8">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(51,65,85,0.14)] lg:grid-cols-[0.95fr_1.05fr]">
            {/* =====================================================
                LEFT BRAND PANEL
            ====================================================== */}
            <section className="relative hidden min-h-[690px] overflow-hidden bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] p-10 text-white lg:flex lg:flex-col lg:justify-between">
              <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-[100px]" />

              <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-[110px]" />

              <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.16]" />

              {/* Logo */}
              <Link
                to="/"
                className="relative z-10 inline-flex items-center gap-3"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur-xl">
                  <ShieldCheck size={25} />
                </div>

                <div>
                  <p className="text-lg font-black tracking-tight">
                    SkillProof AI
                  </p>

                  <p className="text-xs font-medium text-indigo-100">
                    AI Skill Verification Platform
                  </p>
                </div>
              </Link>

              {/* Main content */}
              <div className="relative z-10 py-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-xl">
                  <Sparkles size={16} />

                  Trusted skill evidence
                </div>

                <h2 className="mt-7 max-w-lg text-4xl font-black leading-[1.12] tracking-tight">
                  Welcome back to your verification workspace.
                </h2>

                <p className="mt-5 max-w-lg text-base leading-8 text-indigo-100">
                  Continue reviewing challenges, submitting real project
                  evidence, and building credentials that can be verified
                  publicly.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    {
                      icon: Brain,
                      label: "AI-assisted assessment",
                    },
                    {
                      icon: LockKeyhole,
                      label: "Secure role-based access",
                    },
                    {
                      icon: CheckCircle2,
                      label: "QR-verifiable certificates",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 backdrop-blur-xl"
                    >
                      <item.icon size={18} />

                      <span className="text-sm font-bold">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="relative z-10 text-xs font-medium text-indigo-100/80">
                Verified projects. Human-approved credentials.
              </p>
            </section>

            {/* =====================================================
                LOGIN FORM
            ====================================================== */}
            <section className="bg-white p-7 sm:p-10 lg:p-12">
              <Link
                to="/"
                className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-indigo-700"
              >
                <ArrowLeft size={16} />

                Back to home
              </Link>

              <div className="mb-8">
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 text-white shadow-[0_14px_34px_rgba(79,70,229,0.24)] lg:hidden">
                  <ShieldCheck size={28} />
                </div>

                <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600">
                  Secure Login
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Welcome back
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Login to continue to your SkillProof AI workspace.
                </p>
              </div>

              {serverError && (
                <div
                  className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
                  role="alert"
                >
                  {serverError}
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className="input-field"
                      style={{ paddingLeft: "3rem" }}
                      placeholder="you@example.com"
                      {...register("email")}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-2 text-sm font-semibold text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      className="input-field"
                      style={{ paddingLeft: "3rem" }}
                      placeholder="Enter your password"
                      {...register("password")}
                    />
                  </div>

                  {errors.password && (
                    <p className="mt-2 text-sm font-semibold text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="primary-btn flex w-full items-center justify-center gap-2 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="animate-spin"
                        size={18}
                      />

                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                New here?{" "}
                <Link
                  to="/register"
                  className="font-black text-indigo-600 transition hover:text-violet-600"
                >
                  Create account
                </Link>
              </p>

              {/* DEMO DETAILS */}
              <div className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-600">
                  Demo Access
                </p>

                <p className="mt-2 break-all text-xs leading-6 text-slate-600">
                  <span className="font-black text-slate-800">
                    Admin:
                  </span>{" "}
                  admin@skillproof.com / admin123456
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;