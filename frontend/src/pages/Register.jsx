import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import AnimatedBackground from "../components/ui/AnimatedBackground";
import { useAuth } from "../context/useAuth";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must have at least 2 characters"),

  email: z
    .string()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must have at least 6 characters"),

  role: z.enum(["STUDENT", "COMPANY"]),
});

const Register = () => {
  const {
    register: registerUser,
    getDashboardPath,
  } = useAuth();

  const navigate = useNavigate();

  const [serverError, setServerError] =
    useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
    },
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");

      const user =
        await registerUser(data);

      navigate(
        getDashboardPath(user.role)
      );
    } catch (error) {
      setServerError(
        error?.message ||
          "Registration failed. Please try again."
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
            <section className="relative hidden min-h-[760px] overflow-hidden bg-gradient-to-br from-[#7C3AED] via-[#4F46E5] to-[#2563EB] p-10 text-white lg:flex lg:flex-col lg:justify-between">
              <div className="pointer-events-none absolute -left-24 bottom-16 h-80 w-80 rounded-full bg-cyan-300/20 blur-[105px]" />

              <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-[105px]" />

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

                  Build proof that matters
                </div>

                <h2 className="mt-7 max-w-lg text-4xl font-black leading-[1.12] tracking-tight">
                  Turn practical work into trusted credentials.
                </h2>

                <p className="mt-5 max-w-lg text-base leading-8 text-indigo-100">
                  Create your account, complete real challenges, receive
                  AI-assisted feedback, and earn credentials reviewed by
                  human verifiers.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    "Practical challenge workflow",
                    "AI-assisted project assessment",
                    "QR-verifiable certificates",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 backdrop-blur-xl"
                    >
                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-cyan-200"
                      />

                      <span className="text-sm font-bold">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="relative z-10 text-xs font-medium text-indigo-100/80">
                Create once. Build evidence continuously.
              </p>
            </section>

            {/* =====================================================
                REGISTER FORM
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
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-600 to-blue-600 text-white shadow-[0_14px_34px_rgba(79,70,229,0.24)] lg:hidden">
                  <ShieldCheck size={28} />
                </div>

                <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600">
                  Join SkillProof
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Create account
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Start your skill verification journey.
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
                {/* FULL NAME */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      className="input-field"
                      style={{
                        paddingLeft: "3rem",
                      }}
                      placeholder="Your full name"
                      {...register("name")}
                    />
                  </div>

                  {errors.name && (
                    <p className="mt-2 text-sm font-semibold text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

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
                      style={{
                        paddingLeft: "3rem",
                      }}
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
                      autoComplete="new-password"
                      className="input-field"
                      style={{
                        paddingLeft: "3rem",
                      }}
                      placeholder="At least 6 characters"
                      {...register("password")}
                    />
                  </div>

                  {errors.password && (
                    <p className="mt-2 text-sm font-semibold text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* ACCOUNT TYPE */}
                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Account type
                  </label>

                  <div className="relative">
                    <Building2
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      id="role"
                      className="input-field"
                      style={{
                        paddingLeft: "3rem",
                      }}
                      {...register("role")}
                    >
                      <option value="STUDENT">
                        Student
                      </option>

                      <option value="COMPANY">
                        Company / HR
                      </option>
                    </select>
                  </div>
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

                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-black text-indigo-600 transition hover:text-violet-600"
                >
                  Login
                </Link>
              </p>

              <div className="mt-7 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />

                  <p className="text-xs leading-6 text-slate-600">
                    Your account gives you secure access to the SkillProof
                    challenge, assessment, verification, and credential
                    workflow.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Register;