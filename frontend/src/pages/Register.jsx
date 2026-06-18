import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";

const registerSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must have at least 6 characters"),
  role: z.enum(["STUDENT", "COMPANY"]),
});

const Register = () => {
  const { register: registerUser, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
      const user = await registerUser(data);
      navigate(getDashboardPath(user.role));
    } catch (error) {
      setServerError(error.message);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-6 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-300">
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="glass-card rounded-[2rem] p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black">Create account</h1>
              <p className="text-sm text-slate-400">Start your skill verification journey</p>
            </div>
          </div>

          {serverError && (
            <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Full name
              </label>
              <input className="input-field" {...register("name")} />
              {errors.name && (
                <p className="mt-2 text-sm text-red-300">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Email
              </label>
              <input className="input-field" {...register("email")} />
              {errors.email && (
                <p className="mt-2 text-sm text-red-300">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Password
              </label>
              <input type="password" className="input-field" {...register("password")} />
              {errors.password && (
                <p className="mt-2 text-sm text-red-300">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Account type
              </label>
              <select className="input-field" {...register("role")}>
                <option value="STUDENT">Student</option>
                <option value="COMPANY">Company / HR</option>
              </select>
            </div>

            <button disabled={isSubmitting} className="primary-btn flex w-full justify-center">
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-blue-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;