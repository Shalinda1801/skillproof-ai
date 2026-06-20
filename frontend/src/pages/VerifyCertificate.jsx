import {
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  Loader2,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { certificateApi } from "../api/certificateApi";
import AnimatedBackground from "../components/ui/AnimatedBackground";

const VerifyCertificate = () => {
  const { certificateId } = useParams();

  const [certificateData, setCertificateData] = useState(null);
  const [inputId, setInputId] = useState(certificateId || "");
  const [loading, setLoading] = useState(Boolean(certificateId));
  const [error, setError] = useState("");

  const handleVerifyCertificate = async (id) => {
    const trimmedId = String(id || "").trim();

    if (!trimmedId) {
      setError("Please enter a certificate ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCertificateData(null);

      const response = await certificateApi.verifyCertificate(trimmedId);
      setCertificateData(response);
    } catch (err) {
      setError(err.message || "Certificate verification failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verifyFromUrl = async () => {
      const trimmedId = String(certificateId || "").trim();

      if (!trimmedId) return;

      try {
        setInputId(trimmedId);
        setLoading(true);
        setError("");
        setCertificateData(null);

        const response = await certificateApi.verifyCertificate(trimmedId);
        setCertificateData(response);
      } catch (err) {
        setError(err.message || "Certificate verification failed.");
      } finally {
        setLoading(false);
      }
    };

    verifyFromUrl();
  }, [certificateId]);

  const certificate = certificateData?.certificate;

  return (
    <>
      <AnimatedBackground />

      <main className="relative z-10 min-h-screen px-6 py-6 text-slate-100">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/30">
                <ShieldCheck />
              </div>
              <div>
                <p className="text-lg font-black">SkillProof AI</p>
                <p className="text-sm text-slate-400">
                  Certificate Verification
                </p>
              </div>
            </Link>

            <Link to="/login" className="secondary-btn">
              Login
            </Link>
          </nav>

          <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-950/70 p-8 shadow-2xl shadow-blue-950/20 backdrop-blur-2xl md:p-10">
            <div className="verify-orb left-[-8%] top-[-20%] h-72 w-72 bg-emerald-500/30" />
            <div className="verify-orb bottom-[-25%] right-[-10%] h-80 w-80 bg-purple-500/25" />

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-200">
                  <ShieldCheck size={17} />
                  Public verifier
                </div>

                <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-6xl">
                  Verify a certificate{" "}
                  <span className="gradient-text">instantly.</span>
                </h1>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
                  Enter a SkillProof certificate ID to check whether the
                  credential is valid, revoked, or not found.
                </p>

                <div className="mt-8 flex flex-col gap-4 md:flex-row">
                  <input
                    className="input-field"
                    value={inputId}
                    onChange={(event) => setInputId(event.target.value)}
                    placeholder="Example: CERT-2026-000001"
                  />

                  <button
                    onClick={() => handleVerifyCertificate(inputId)}
                    className="primary-btn inline-flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Search size={18} />
                    )}
                    Verify
                  </button>
                </div>
              </div>

              <div className="verify-badge-card rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-7 text-center">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] bg-emerald-400/10 text-emerald-300 shadow-lg shadow-emerald-500/20">
                  <ShieldCheck size={52} />
                </div>
                <h2 className="mt-6 text-2xl font-black">
                  Trusted Credential Check
                </h2>
                <p className="mt-3 leading-7 text-slate-400">
                  Public certificate verification helps companies confirm
                  student skill credentials.
                </p>
              </div>
            </div>
          </section>

          {loading && (
            <div className="mt-8 flex items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/70 p-10 text-slate-300">
              <Loader2 className="mr-3 animate-spin" />
              Verifying certificate...
            </div>
          )}

          {error && (
            <div className="mt-8 rounded-[2rem] border border-red-400/20 bg-red-400/10 p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="text-red-300" size={34} />
                <div>
                  <h2 className="text-2xl font-black text-red-100">
                    Verification failed
                  </h2>
                  <p className="mt-2 text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          {certificate && (
            <section className="verify-result-card pro-card mt-8 p-8">
              <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300">
                    <CheckCircle2 size={18} />
                    {certificateData?.result || "VALID"}
                  </div>

                  <h2 className="mt-5 text-4xl font-black">
                    Certificate is verified.
                  </h2>

                  <p className="mt-3 text-slate-400">
                    Certificate ID: {certificate.certificateId}
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-center">
                  <ShieldCheck className="mx-auto text-emerald-300" size={48} />
                  <p className="mt-3 text-sm font-bold text-emerald-200">
                    Trusted Credential
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
                  <User className="mb-4 text-blue-300" />
                  <p className="text-sm text-slate-400">Student</p>
                  <h3 className="mt-1 text-xl font-black">
                    {certificate.student?.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {certificate.student?.email}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
                  <Award className="mb-4 text-purple-300" />
                  <p className="text-sm text-slate-400">Skill</p>
                  <h3 className="mt-1 text-xl font-black">
                    {certificate.skill?.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Level: {certificate.assessment?.skillLevel}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
                  <ShieldCheck className="mb-4 text-emerald-300" />
                  <p className="text-sm text-slate-400">Score</p>
                  <h3 className="mt-1 text-3xl font-black gradient-text">
                    {certificate.assessment?.score}%
                  </h3>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
                  <Calendar className="mb-4 text-cyan-300" />
                  <p className="text-sm text-slate-400">Issued date</p>
                  <h3 className="mt-1 text-xl font-black">
                    {new Date(certificate.issuedAt).toLocaleDateString()}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Verification count: {certificate.verificationCount}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default VerifyCertificate;