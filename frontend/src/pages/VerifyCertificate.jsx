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

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import { certificateApi } from "../api/certificateApi";

import AnimatedBackground from "../components/ui/AnimatedBackground";

const VerifyCertificate = () => {
  const { certificateId } =
    useParams();

  const [
    certificateData,
    setCertificateData,
  ] = useState(null);

  const [inputId, setInputId] =
    useState(certificateId || "");

  const [loading, setLoading] =
    useState(Boolean(certificateId));

  const [error, setError] =
    useState("");

  const handleVerifyCertificate =
    async (id) => {
      const trimmedId =
        String(id || "").trim();

      if (!trimmedId) {
        setError(
          "Please enter a certificate ID."
        );

        return;
      }

      try {
        setLoading(true);
        setError("");
        setCertificateData(null);

        const response =
          await certificateApi.verifyCertificate(
            trimmedId
          );

        setCertificateData(response);
      } catch (err) {
        setError(
          err.message ||
            "Certificate verification failed."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    const verifyFromUrl = async () => {
      const trimmedId =
        String(
          certificateId || ""
        ).trim();

      if (!trimmedId) return;

      try {
        setInputId(trimmedId);
        setLoading(true);
        setError("");
        setCertificateData(null);

        const response =
          await certificateApi.verifyCertificate(
            trimmedId
          );

        setCertificateData(response);
      } catch (err) {
        setError(
          err.message ||
            "Certificate verification failed."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyFromUrl();
  }, [certificateId]);

  const certificate =
    certificateData?.certificate;

  return (
    <>
      <AnimatedBackground />

      <main className="relative z-10 min-h-screen px-6 py-6 text-slate-900">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-10 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl">
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-[0_12px_30px_rgba(16,185,129,0.18)]">
                <ShieldCheck />
              </div>

              <div>
                <p className="text-lg font-black text-slate-900">
                  SkillProof AI
                </p>

                <p className="text-sm text-slate-500">
                  Certificate Verification
                </p>
              </div>
            </Link>

            <Link
              to="/login"
              className="secondary-btn"
            >
              Login
            </Link>
          </nav>

          <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/85 p-8 shadow-[0_28px_90px_rgba(51,65,85,0.12)] backdrop-blur-2xl md:p-10">
            <div className="verify-orb left-[-8%] top-[-20%] h-72 w-72 bg-emerald-400/25" />

            <div className="verify-orb bottom-[-25%] right-[-10%] h-80 w-80 bg-violet-400/20" />

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
                  <ShieldCheck size={17} />

                  Public verifier
                </div>

                <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
                  Verify a certificate{" "}

                  <span className="gradient-text">
                    instantly.
                  </span>
                </h1>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                  Enter a SkillProof certificate ID
                  to check whether the credential is
                  valid, revoked, or not found.
                </p>

                <div className="mt-8 flex flex-col gap-4 md:flex-row">
                  <input
                    className="input-field"
                    value={inputId}
                    onChange={(event) =>
                      setInputId(
                        event.target.value
                      )
                    }
                    placeholder="Example: CERT-2026-000001"
                  />

                  <button
                    onClick={() =>
                      handleVerifyCertificate(
                        inputId
                      )
                    }
                    className="primary-btn inline-flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2
                        className="animate-spin"
                        size={18}
                      />
                    ) : (
                      <Search size={18} />
                    )}

                    Verify
                  </button>
                </div>
              </div>

              <div className="verify-badge-card rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-indigo-50 p-7 text-center shadow-sm">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] border border-emerald-200 bg-white text-emerald-600 shadow-[0_16px_40px_rgba(16,185,129,0.13)]">
                  <ShieldCheck size={52} />
                </div>

                <h2 className="mt-6 text-2xl font-black text-slate-900">
                  Trusted Credential Check
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Public certificate verification
                  helps companies confirm student
                  skill credentials.
                </p>
              </div>
            </div>
          </section>

          {loading && (
            <div className="mt-8 flex items-center justify-center rounded-3xl border border-slate-200 bg-white/80 p-10 text-slate-600 shadow-sm">
              <Loader2 className="mr-3 animate-spin" />

              Verifying certificate...
            </div>
          )}

          {error && (
            <div className="mt-8 rounded-[2rem] border border-red-200 bg-red-50 p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle
                  className="text-red-600"
                  size={34}
                />

                <div>
                  <h2 className="text-2xl font-black text-red-800">
                    Verification failed
                  </h2>

                  <p className="mt-2 text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {certificate && (
            <section className="verify-result-card pro-card mt-8 p-8">
              <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                    <CheckCircle2 size={18} />

                    {certificateData?.result ||
                      "VALID"}
                  </div>

                  <h2 className="mt-5 text-4xl font-black text-slate-900">
                    Certificate is verified.
                  </h2>

                  <p className="mt-3 text-slate-500">
                    Certificate ID:{" "}
                    {
                      certificate.certificateId
                    }
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                  <ShieldCheck
                    className="mx-auto text-emerald-600"
                    size={48}
                  />

                  <p className="mt-3 text-sm font-black text-emerald-700">
                    Trusted Credential
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-8 grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-sm">
                  <User className="mb-4 text-indigo-600" />

                  <p className="text-sm text-slate-500">
                    Student
                  </p>

                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    {
                      certificate.student?.name
                    }
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {
                      certificate.student?.email
                    }
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-sm">
                  <Award className="mb-4 text-violet-600" />

                  <p className="text-sm text-slate-500">
                    Skill
                  </p>

                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    {
                      certificate.skill?.title
                    }
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Level:{" "}
                    {
                      certificate.assessment
                        ?.skillLevel
                    }
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-sm">
                  <ShieldCheck className="mb-4 text-emerald-600" />

                  <p className="text-sm text-slate-500">
                    Score
                  </p>

                  <h3 className="mt-1 text-3xl font-black gradient-text">
                    {
                      certificate.assessment
                        ?.score
                    }
                    %
                  </h3>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white/85 p-5 shadow-sm">
                  <Calendar className="mb-4 text-cyan-600" />

                  <p className="text-sm text-slate-500">
                    Issued date
                  </p>

                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    {new Date(
                      certificate.issuedAt
                    ).toLocaleDateString()}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Verification count:{" "}
                    {
                      certificate.verificationCount
                    }
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