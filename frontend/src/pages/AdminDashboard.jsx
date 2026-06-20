import {
  Award,
  Brain,
  ClipboardCheck,
  ExternalLink,
  Loader2,
  LogOut,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewNote, setReviewNote] = useState(
    "Submission approved after reviewing AI assessment and project evidence."
  );

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [submissionData, certificateData] = await Promise.all([
        adminApi.getAllSubmissions(),
        adminApi.getAllCertificates(),
      ]);

      const loadedSubmissions = submissionData.submissions || [];

      setSubmissions(loadedSubmissions);
      setCertificates(certificateData.certificates || []);

      setSelectedSubmission((currentSubmission) => {
        if (!currentSubmission) {
          return loadedSubmissions[0] || null;
        }

        const updatedSelectedSubmission = loadedSubmissions.find(
          (submission) => submission._id === currentSubmission._id
        );

        return updatedSelectedSubmission || loadedSubmissions[0] || null;
      });
    } catch (err) {
      setError(err.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialAdminData = async () => {
      try {
        setLoading(true);
        setError("");

        const [submissionData, certificateData] = await Promise.all([
          adminApi.getAllSubmissions(),
          adminApi.getAllCertificates(),
        ]);

        const loadedSubmissions = submissionData.submissions || [];

        setSubmissions(loadedSubmissions);
        setCertificates(certificateData.certificates || []);
        setSelectedSubmission(loadedSubmissions[0] || null);
      } catch (err) {
        setError(err.message || "Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialAdminData();
  }, []);

  const handleRunAi = async () => {
    if (!selectedSubmission) return;

    try {
      setActionLoading("ai");
      setMessage("");
      setError("");

      await adminApi.runAiAssessment(selectedSubmission._id);
      setMessage("AI assessment completed successfully.");
      await loadAdminData();
    } catch (err) {
      setError(err.message || "AI assessment failed.");
    } finally {
      setActionLoading("");
    }
  };

  const handleApprove = async () => {
    if (!selectedSubmission) return;

    try {
      setActionLoading("approve");
      setMessage("");
      setError("");

      await adminApi.updateSubmissionStatus(selectedSubmission._id, {
        status: "APPROVED",
        reviewNote,
      });

      setMessage("Submission approved successfully.");
      await loadAdminData();
    } catch (err) {
      setError(err.message || "Approval failed.");
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission) return;

    try {
      setActionLoading("reject");
      setMessage("");
      setError("");

      await adminApi.updateSubmissionStatus(selectedSubmission._id, {
        status: "REJECTED",
        reviewNote: reviewNote || "Submission rejected after review.",
      });

      setMessage("Submission rejected.");
      await loadAdminData();
    } catch (err) {
      setError(err.message || "Reject failed.");
    } finally {
      setActionLoading("");
    }
  };

  const handleGenerateCertificate = async () => {
    if (!selectedSubmission) return;

    try {
      setActionLoading("certificate");
      setMessage("");
      setError("");

      await adminApi.generateCertificate(selectedSubmission._id);
      setMessage("Certificate generated successfully.");
      await loadAdminData();
    } catch (err) {
      setError(err.message || "Certificate generation failed.");
    } finally {
      setActionLoading("");
    }
  };

  const aiReviewedCount = submissions.filter(
    (item) => item.status === "AI_REVIEWED"
  ).length;

  const approvedCount = submissions.filter(
    (item) => item.status === "APPROVED"
  ).length;

  const statCards = [
    {
      title: "Submissions",
      value: submissions.length,
      icon: ClipboardCheck,
      color: "text-blue-300",
    },
    {
      title: "AI Reviewed",
      value: aiReviewedCount,
      icon: Brain,
      color: "text-purple-300",
    },
    {
      title: "Approved",
      value: approvedCount,
      icon: UserCheck,
      color: "text-emerald-300",
    },
    {
      title: "Certificates",
      value: certificates.length,
      icon: Award,
      color: "text-cyan-300",
    },
  ];

  return (
    <>
      <AnimatedBackground />

      <main className="relative z-10 min-h-screen px-6 py-6 text-slate-100">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-600 shadow-lg shadow-purple-600/30">
                <ShieldCheck />
              </div>
              <div>
                <p className="text-lg font-black">SkillProof AI</p>
                <p className="text-sm text-slate-400">Admin Dashboard</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="secondary-btn inline-flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>

          <section className="glass-card pro-card rounded-[2rem] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-300">
              Verifier workspace
            </p>

            <h1 className="mt-3 max-w-5xl text-4xl font-black leading-tight md:text-5xl">
              Welcome {user?.name}, review submissions and issue trusted
              certificates.
            </h1>

            <p className="mt-4 max-w-3xl text-slate-400">
              Manage student evidence, run AI-assisted assessment, approve
              submissions, and generate QR-verifiable certificates.
            </p>
          </section>

          {message && (
            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-8 flex items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/50 p-10 text-slate-300">
              <Loader2 className="mr-3 animate-spin" />
              Loading admin dashboard...
            </div>
          ) : (
            <>
              <section className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card) => (
                  <div
                    key={card.title}
                    className="glass-card pro-card rounded-3xl p-6"
                  >
                    <card.icon className={`mb-5 ${card.color}`} size={34} />
                    <h2 className="text-xl font-black">{card.title}</h2>
                    <p className="mt-2 text-4xl font-black gradient-text">
                      {card.value}
                    </p>
                  </div>
                ))}
              </section>

              <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="glass-card rounded-[2rem] p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black">
                        Student Submissions
                      </h2>
                      <p className="mt-2 text-sm text-slate-400">
                        Select evidence to review.
                      </p>
                    </div>

                    <button
                      onClick={loadAdminData}
                      className="secondary-btn inline-flex items-center gap-2"
                    >
                      <RefreshCcw size={16} />
                      Refresh
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {submissions.map((submission) => (
                      <button
                        key={submission._id}
                        onClick={() => setSelectedSubmission(submission)}
                        className={`w-full rounded-3xl border p-5 text-left transition ${
                          selectedSubmission?._id === submission._id
                            ? "border-purple-400/70 bg-purple-500/10"
                            : "border-slate-800 bg-slate-950/40 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-black">
                              {submission.challengeId?.title || "Challenge"}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {submission.studentId?.name || "Student"} •{" "}
                              {submission.studentId?.email || "No email"}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {submission.challengeId?.skillId?.title ||
                                "Skill challenge"}
                            </p>
                          </div>

                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                            {submission.status}
                          </span>
                        </div>
                      </button>
                    ))}

                    {submissions.length === 0 && (
                      <p className="rounded-2xl bg-slate-950/60 p-4 text-slate-400">
                        No submissions found.
                      </p>
                    )}
                  </div>
                </div>

                <div className="glass-card rounded-[2rem] p-6">
                  <h2 className="text-2xl font-black">Review Workspace</h2>

                  {selectedSubmission ? (
                    <>
                      <div className="mt-5 rounded-3xl border border-purple-400/20 bg-purple-400/10 p-5">
                        <p className="text-sm font-bold text-purple-200">
                          Selected Submission
                        </p>

                        <h3 className="mt-2 text-xl font-black">
                          {selectedSubmission.challengeId?.title}
                        </h3>

                        <p className="mt-2 text-sm text-slate-300">
                          Student: {selectedSubmission.studentId?.name} (
                          {selectedSubmission.studentId?.email})
                        </p>

                        <p className="mt-2 text-sm text-slate-300">
                          Status:{" "}
                          <span className="font-bold text-blue-300">
                            {selectedSubmission.status}
                          </span>
                        </p>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {selectedSubmission.githubLink && (
                          <a
                            href={selectedSubmission.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            className="secondary-btn inline-flex justify-center gap-2 text-center"
                          >
                            View GitHub
                            <ExternalLink size={16} />
                          </a>
                        )}

                        {selectedSubmission.liveDemoLink && (
                          <a
                            href={selectedSubmission.liveDemoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="secondary-btn inline-flex justify-center gap-2 text-center"
                          >
                            View Demo
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>

                      <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
                        <h4 className="font-black">Student Explanation</h4>
                        <p className="mt-2 leading-7 text-slate-400">
                          {selectedSubmission.explanation ||
                            "No explanation provided."}
                        </p>
                      </div>

                      <div className="mt-5">
                        <label className="mb-2 block text-sm font-semibold text-slate-300">
                          Review note
                        </label>
                        <textarea
                          className="input-field min-h-28 resize-none"
                          value={reviewNote}
                          onChange={(event) =>
                            setReviewNote(event.target.value)
                          }
                        />
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <button
                          onClick={handleRunAi}
                          className="secondary-btn inline-flex justify-center gap-2"
                          disabled={Boolean(actionLoading)}
                        >
                          {actionLoading === "ai" ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Sparkles size={18} />
                          )}
                          Run AI
                        </button>

                        <button
                          onClick={handleApprove}
                          className="primary-btn inline-flex justify-center gap-2"
                          disabled={Boolean(actionLoading)}
                        >
                          {actionLoading === "approve" ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <ShieldCheck size={18} />
                          )}
                          Approve
                        </button>

                        <button
                          onClick={handleReject}
                          className="secondary-btn inline-flex justify-center gap-2"
                          disabled={Boolean(actionLoading)}
                        >
                          Reject
                        </button>

                        <button
                          onClick={handleGenerateCertificate}
                          className="primary-btn inline-flex justify-center gap-2"
                          disabled={Boolean(actionLoading)}
                        >
                          {actionLoading === "certificate" ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Award size={18} />
                          )}
                          Generate Certificate
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="mt-5 rounded-2xl bg-slate-950/60 p-4 text-slate-400">
                      Select a submission first.
                    </p>
                  )}
                </div>
              </section>

              <section className="mt-8 glass-card rounded-[2rem] p-6">
                <h2 className="text-2xl font-black">Generated Certificates</h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {certificates.map((certificate) => (
                    <div
                      key={certificate._id}
                      className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5"
                    >
                      <h3 className="font-black">
                        {certificate.skillId?.title || "Skill Certificate"}
                      </h3>

                      <p className="mt-2 text-sm text-slate-400">
                        Student: {certificate.studentId?.name || "Student"}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Certificate ID: {certificate.certificateId}
                      </p>

                      <p className="mt-1 text-sm text-emerald-300">
                        Status: {certificate.status}
                      </p>

                      <a
                        href={`/verify/${certificate.certificateId}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-300"
                      >
                        Public verify page
                        <ExternalLink size={15} />
                      </a>
                    </div>
                  ))}
                </div>

                {certificates.length === 0 && (
                  <p className="mt-5 rounded-2xl bg-slate-950/60 p-4 text-slate-400">
                    No certificates generated yet.
                  </p>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;