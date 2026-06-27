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
import { challengeApi } from "../api/challengeApi";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import { useAuth } from "../context/AuthContext";

const isReviewableSubmission = (submission) => {
  return submission.status !== "REJECTED";
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [personalizedChallengeRequests, setPersonalizedChallengeRequests] =
    useState([]);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewNote, setReviewNote] = useState(
    "Submission approved after reviewing AI assessment and project evidence."
  );

  const [aiAssessmentResult, setAiAssessmentResult] = useState(null);
  const [showAiChallengeReview, setShowAiChallengeReview] = useState(false);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getAssessmentFromResponse = (response) => {
    return (
      response?.assessment ||
      response?.aiAssessment ||
      response?.data?.assessment ||
      response
    );
  };

  const resetReviewWorkspace = () => {
    setSelectedSubmission(null);
    setAiAssessmentResult(null);
    setReviewNote(
      "Submission approved after reviewing AI assessment and project evidence."
    );
  };

  const loadAdminData = async ({
    keepSelected = true,
    autoSelectFirstReviewable = false,
  } = {}) => {
    try {
      setLoading(true);
      setError("");

      const [submissionData, certificateData, challengeRequestData] =
        await Promise.all([
          adminApi.getAllSubmissions(),
          adminApi.getAllCertificates(),
          challengeApi.getPersonalizedChallengeRequestsForAdmin(),
        ]);

      const loadedSubmissions = submissionData.submissions || [];
      const loadedCertificates = certificateData.certificates || [];
      const loadedChallengeRequests = challengeRequestData.requests || [];
      const loadedReviewSubmissions =
        loadedSubmissions.filter(isReviewableSubmission);

      setSubmissions(loadedSubmissions);
      setCertificates(loadedCertificates);
      setPersonalizedChallengeRequests(loadedChallengeRequests);

      setSelectedSubmission((currentSubmission) => {
        if (autoSelectFirstReviewable) {
          return loadedReviewSubmissions[0] || null;
        }

        if (!keepSelected || !currentSubmission) {
          return null;
        }

        const updatedSelectedSubmission = loadedSubmissions.find(
          (submission) => submission._id === currentSubmission._id
        );

        if (!updatedSelectedSubmission) {
          return null;
        }

        if (updatedSelectedSubmission.status === "REJECTED") {
          return null;
        }

        return updatedSelectedSubmission;
      });

      return {
        submissions: loadedSubmissions,
        certificates: loadedCertificates,
        requests: loadedChallengeRequests,
      };
    } catch (err) {
      setError(err.message || "Failed to load admin data.");
      return null;
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  const fetchInitialAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [submissionData, certificateData, challengeRequestData] =
        await Promise.all([
          adminApi.getAllSubmissions(),
          adminApi.getAllCertificates(),
          challengeApi.getPersonalizedChallengeRequestsForAdmin(),
        ]);

      const loadedSubmissions = submissionData.submissions || [];
      const loadedCertificates = certificateData.certificates || [];
      const loadedChallengeRequests = challengeRequestData.requests || [];
      const loadedReviewSubmissions =
        loadedSubmissions.filter(isReviewableSubmission);

      setSubmissions(loadedSubmissions);
      setCertificates(loadedCertificates);
      setPersonalizedChallengeRequests(loadedChallengeRequests);
      setSelectedSubmission(loadedReviewSubmissions[0] || null);
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
      setAiAssessmentResult(null);

      const response = await adminApi.runAiAssessment(selectedSubmission._id);
      const assessment = getAssessmentFromResponse(response);

      setAiAssessmentResult(assessment);
      setMessage("AI assessment completed successfully.");

      await loadAdminData({
        keepSelected: true,
      });
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
    setError("");
    setMessage("");

    await adminApi.updateSubmissionStatus(selectedSubmission._id, {
      status: "APPROVED",
      reviewNote,
    });

    const approvedSubmission = {
      ...selectedSubmission,
      status: "APPROVED",
    };

    setSelectedSubmission(approvedSubmission);
    setSubmissions((currentSubmissions) =>
      currentSubmissions.map((submission) =>
        submission._id === approvedSubmission._id
          ? approvedSubmission
          : submission
      )
    );

    setMessage(
      "Submission approved successfully. You can now generate the certificate."
    );
  } catch (error) {
    setError(
      error.response?.data?.message ||
        error.message ||
        "Failed to approve submission."
    );
  } finally {
    setActionLoading("");
  }
};

  const handleReject = async () => {
  if (!selectedSubmission) return;

  try {
    setActionLoading("reject");
    setError("");
    setMessage("");

    await adminApi.updateSubmissionStatus(selectedSubmission._id, {
      status: "REJECTED",
      reviewNote: reviewNote || "Submission rejected after review.",
    });

    await loadAdminData({
      keepSelected: false,
    });

    resetReviewWorkspace();

    setMessage("Submission rejected successfully.");
  } catch (error) {
    setError(
      error.response?.data?.message ||
        error.message ||
        "Failed to reject submission."
    );
  } finally {
    setActionLoading("");
  }
};

  const handleApproveAiChallengeRequest = async (requestId) => {
    try {
      setActionLoading(`approve-ai-${requestId}`);
      setMessage("");
      setError("");

      await challengeApi.approvePersonalizedChallengeRequest(requestId, {
        adminNote: "AI-generated personalized challenge approved by admin.",
      });

      setMessage("AI challenge request approved successfully.");

      await loadAdminData({
        keepSelected: true,
      });
    } catch (err) {
      setError(err.message || "AI challenge approval failed.");
    } finally {
      setActionLoading("");
    }
  };

  const handleRejectAiChallengeRequest = async (requestId) => {
    try {
      setActionLoading(`reject-ai-${requestId}`);
      setMessage("");
      setError("");

      await challengeApi.rejectPersonalizedChallengeRequest(requestId, {
        adminNote: "AI-generated personalized challenge rejected by admin.",
      });

      setMessage("AI challenge request rejected.");

      await loadAdminData({
        keepSelected: true,
      });
    } catch (err) {
      setError(err.message || "AI challenge rejection failed.");
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

      await loadAdminData({
        keepSelected: false,
      });

      resetReviewWorkspace();

      setMessage("Certificate generated successfully.");
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

  const pendingAiChallengeRequests = personalizedChallengeRequests.filter(
    (request) => request.status === "PENDING"
  );

  const pendingAiChallengeCount = pendingAiChallengeRequests.length;

  const reviewSubmissions = submissions.filter(isReviewableSubmission);

  const shouldShowReviewWorkspace =
    selectedSubmission && selectedSubmission.status !== "REJECTED";

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

              <section className="mt-8 glass-card rounded-[2rem] p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-300">
                      AI Challenge Review
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Personalized AI Challenge Requests
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      Keep this panel closed to keep the dashboard clean. Open
                      it only when you want to review generated challenge
                      drafts.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-3 text-sm">
                      <span className="text-slate-400">Total:</span>{" "}
                      <span className="font-black text-blue-300">
                        {personalizedChallengeRequests.length}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-3 text-sm">
                      <span className="text-slate-400">Pending:</span>{" "}
                      <span className="font-black text-amber-200">
                        {pendingAiChallengeCount}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        setShowAiChallengeReview(
                          (currentValue) => !currentValue
                        )
                      }
                      className="primary-btn inline-flex items-center gap-2"
                    >
                      <Sparkles size={18} />
                      {showAiChallengeReview
                        ? "Hide Review Panel"
                        : "Open Review Panel"}
                    </button>
                  </div>
                </div>

                {showAiChallengeReview && (
                  <>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() =>
                          loadAdminData({
                            keepSelected: true,
                          })
                        }
                        className="secondary-btn inline-flex items-center gap-2"
                      >
                        <RefreshCcw size={16} />
                        Refresh Requests
                      </button>
                    </div>

                    <div className="mt-6 grid gap-5 lg:grid-cols-2">
                      {pendingAiChallengeRequests.map((request) => (
                        <div
                          key={request._id}
                          className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-black">
                                {request.generatedTitle}
                              </h3>

                              <p className="mt-2 text-sm leading-6 text-slate-400">
                                Student: {request.studentId?.name || "Student"}{" "}
                                • {request.studentId?.email || "No email"}
                              </p>

                              <p className="mt-1 text-sm text-slate-400">
                                Skill: {request.skillId?.title || "Skill path"}
                              </p>

                              <p className="mt-1 text-sm text-slate-400">
                                Interest: {request.interestArea}
                              </p>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                request.status === "APPROVED"
                                  ? "bg-emerald-400/10 text-emerald-200"
                                  : request.status === "REJECTED"
                                  ? "bg-red-400/10 text-red-200"
                                  : "bg-amber-400/10 text-amber-200"
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>

                          <div className="mt-5 max-h-48 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                            <h4 className="font-black text-blue-300">
                              Generated Instructions
                            </h4>

                            <p className="mt-2 text-sm leading-7 text-slate-300">
                              {request.generatedInstructions}
                            </p>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                              <h4 className="font-black text-purple-300">
                                Challenge Details
                              </h4>

                              <p className="mt-3 text-sm text-slate-400">
                                Difficulty:{" "}
                                <span className="font-bold text-slate-200">
                                  {request.generatedDifficulty}
                                </span>
                              </p>

                              <p className="mt-2 text-sm text-slate-400">
                                Deadline:{" "}
                                <span className="font-bold text-slate-200">
                                  {request.deadlineDays} days
                                </span>
                              </p>

                              <p className="mt-2 text-sm text-slate-400">
                                Provider:{" "}
                                <span className="font-bold text-slate-200">
                                  {request.provider}
                                </span>
                              </p>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                              <h4 className="font-black text-emerald-300">
                                Required Evidence
                              </h4>

                              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                                {(request.generatedRequiredEvidence || []).map(
                                  (item, index) => (
                                    <li key={index}>• {item}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-5 grid gap-3 md:grid-cols-2">
                            <button
                              onClick={() =>
                                handleApproveAiChallengeRequest(request._id)
                              }
                              className="primary-btn inline-flex justify-center gap-2"
                              disabled={Boolean(actionLoading)}
                            >
                              {actionLoading ===
                              `approve-ai-${request._id}` ? (
                                <Loader2 className="animate-spin" size={18} />
                              ) : (
                                <ShieldCheck size={18} />
                              )}
                              Approve Challenge
                            </button>

                            <button
                              onClick={() =>
                                handleRejectAiChallengeRequest(request._id)
                              }
                              className="secondary-btn inline-flex justify-center gap-2"
                              disabled={Boolean(actionLoading)}
                            >
                              {actionLoading === `reject-ai-${request._id}` ? (
                                <Loader2 className="animate-spin" size={18} />
                              ) : null}
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {pendingAiChallengeRequests.length === 0 && (
                      <p className="mt-6 rounded-2xl bg-slate-950/60 p-4 text-slate-400">
                        No pending AI challenge requests. Approved and rejected
                        requests are hidden from this review panel.
                      </p>
                    )}
                  </>
                )}
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
                      onClick={() =>
                        loadAdminData({
                          keepSelected: true,
                        })
                      }
                      className="secondary-btn inline-flex items-center gap-2"
                    >
                      <RefreshCcw size={16} />
                      Refresh
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {reviewSubmissions.map((submission) => (
                      <button
                        key={submission._id}
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setAiAssessmentResult(
                            submission.aiAssessment || null
                          );
                        }}
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

                    {reviewSubmissions.length === 0 && (
                      <p className="rounded-2xl bg-slate-950/60 p-4 text-slate-400">
                        No submissions waiting for review. Rejected submissions are hidden from this review list.
                      </p>
                    )}
                  </div>
                </div>

                <div className="glass-card rounded-[2rem] p-6">
                  <h2 className="text-2xl font-black">Review Workspace</h2>

                  {shouldShowReviewWorkspace ? (
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

                      {aiAssessmentResult && (
                        <div className="mt-5 rounded-3xl border border-purple-400/30 bg-purple-500/10 p-5">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                              <p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-300">
                                AI Assessment Result
                              </p>

                              <h4 className="mt-2 text-2xl font-black">
                                {aiAssessmentResult.score ?? 0}% Score
                              </h4>

                              <p className="mt-2 text-sm text-slate-300">
                                Skill Level:{" "}
                                <span className="font-bold text-blue-300">
                                  {aiAssessmentResult.skillLevel || "N/A"}
                                </span>
                              </p>
                            </div>

                            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-200">
                              Recommendation:{" "}
                              {aiAssessmentResult.certificateRecommendation ||
                                "NEEDS_REVIEW"}
                            </div>
                          </div>

                          <div className="mt-5 grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                              <h5 className="font-black text-emerald-300">
                                Strengths
                              </h5>

                              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                                {(aiAssessmentResult.strengths || []).map(
                                  (item, index) => (
                                    <li key={index}>• {item}</li>
                                  )
                                )}
                              </ul>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                              <h5 className="font-black text-amber-300">
                                Weaknesses
                              </h5>

                              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                                {(aiAssessmentResult.weaknesses || []).map(
                                  (item, index) => (
                                    <li key={index}>• {item}</li>
                                  )
                                )}
                              </ul>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                              <h5 className="font-black text-blue-300">
                                Improvements
                              </h5>

                              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                                {(aiAssessmentResult.improvements || []).map(
                                  (item, index) => (
                                    <li key={index}>• {item}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
                            <span className="rounded-full bg-slate-900 px-3 py-1">
                              Provider:{" "}
                              {aiAssessmentResult.provider || "MOCK/GEMINI"}
                            </span>

                            <span className="rounded-full bg-slate-900 px-3 py-1">
                              Model: {aiAssessmentResult.model || "N/A"}
                            </span>
                          </div>
                        </div>
                      )}

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

                     {selectedSubmission.status === "APPROVED" ? (
  <div className="mt-5">
    <button
      onClick={handleGenerateCertificate}
      className="primary-btn inline-flex w-full justify-center gap-2"
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
) : (
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
                            className="secondary-btn inline-flex justify-center gap-2 md:col-span-2"
                            disabled={Boolean(actionLoading)}
                          >
                            {actionLoading === "reject" ? (
                              <Loader2 className="animate-spin" size={18} />
                            ) : null}
                            Reject
                          </button>
                        </div>
                      )}
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