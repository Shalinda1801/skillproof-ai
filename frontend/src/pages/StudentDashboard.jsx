import {
  Award,
  Brain,
  ClipboardList,
  Code2,
  ExternalLink,
  Loader2,
  LogOut,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { challengeApi } from "../api/challengeApi";
import { submissionApi } from "../api/submissionApi";
import { certificateApi } from "../api/certificateApi";
import { useAuth } from "../context/AuthContext";

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const [githubLink, setGithubLink] = useState(
    "https://github.com/Shalinda1801/skillproof-ai"
  );
  const [liveDemoLink, setLiveDemoLink] = useState(
    "https://skillproof-ai-demo.vercel.app"
  );
  const [explanation, setExplanation] = useState(
    "This project is a MERN stack application with authentication, protected APIs, role-based dashboards, AI assessment support, and QR verified certificate workflow."
  );

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [challengeData, submissionData, certificateData] =
        await Promise.all([
          challengeApi.getChallenges(),
          submissionApi.getMySubmissions(),
          certificateApi.getMyCertificates(),
        ]);

      setChallenges(challengeData.challenges || []);
      setSubmissions(submissionData.submissions || []);
      setCertificates(certificateData.certificates || []);

      if ((challengeData.challenges || []).length > 0) {
        setSelectedChallenge(challengeData.challenges[0]);
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
   }, []);

 useEffect(() => {
  loadDashboardData();
}, [loadDashboardData]);

  const handleSubmitChallenge = async (event) => {
    event.preventDefault();

    if (!selectedChallenge) {
      setError("Please select a challenge first.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");
      setError("");

      await submissionApi.createSubmission({
        challengeId: selectedChallenge._id,
        githubLink,
        liveDemoLink,
        explanation,
        notes: "Submitted from student dashboard.",
      });

      setMessage(
        "Challenge submitted successfully. AI assessment has been triggered."
      );
      await loadDashboardData();
    } catch (err) {
      setError(err.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const statCards = [
    {
      title: "Available Challenges",
      value: challenges.length,
      icon: ClipboardList,
    },
    {
      title: "My Submissions",
      value: submissions.length,
      icon: Brain,
    },
    {
      title: "My Certificates",
      value: certificates.length,
      icon: Award,
    },
  ];

  return (
    <main className="min-h-screen px-6 py-6">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <ShieldCheck />
            </div>
            <div>
              <p className="text-lg font-black">SkillProof AI</p>
              <p className="text-sm text-slate-400">Student Dashboard</p>
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

        <section className="glass-card rounded-[2rem] p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-300">
            Welcome student
          </p>
          <h1 className="mt-3 text-4xl font-black">
            Hi {user?.name}, prove your skills with real challenges.
          </h1>
          <p className="mt-4 max-w-3xl text-slate-400">
            Submit project evidence, receive AI-assisted feedback, and earn
            QR-verified certificates after verifier approval.
          </p>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-3">
          {statCards.map((card) => (
            <div key={card.title} className="glass-card rounded-3xl p-6">
              <card.icon className="mb-5 text-blue-300" size={34} />
              <h2 className="text-xl font-black">{card.title}</h2>
              <p className="mt-2 text-4xl font-black gradient-text">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        {loading ? (
          <div className="mt-8 flex items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/50 p-10 text-slate-300">
            <Loader2 className="mr-3 animate-spin" />
            Loading dashboard...
          </div>
        ) : (
          <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-card rounded-[2rem] p-6">
              <h2 className="text-2xl font-black">Available Challenges</h2>
              <p className="mt-2 text-sm text-slate-400">
                Select a challenge and submit your evidence.
              </p>

              <div className="mt-5 space-y-4">
                {challenges.map((challenge) => (
                  <button
                    key={challenge._id}
                    onClick={() => setSelectedChallenge(challenge)}
                    className={`w-full rounded-3xl border p-5 text-left transition ${
                      selectedChallenge?._id === challenge._id
                        ? "border-blue-400/70 bg-blue-500/10"
                        : "border-slate-800 bg-slate-950/40 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-black">{challenge.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {challenge.skillId?.title || "Skill challenge"} •{" "}
                          {challenge.difficulty}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                        {challenge.deadlineDays} days
                      </span>
                    </div>
                  </button>
                ))}

                {challenges.length === 0 && (
                  <p className="rounded-2xl bg-slate-950/60 p-4 text-slate-400">
                    No challenges found. Create challenges from admin side
                    first.
                  </p>
                )}
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-6">
              <h2 className="text-2xl font-black">Submit Challenge Evidence</h2>

              {selectedChallenge && (
                <div className="mt-4 rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5">
                  <p className="text-sm font-bold text-blue-200">
                    Selected Challenge
                  </p>
                  <h3 className="mt-2 text-xl font-black">
                    {selectedChallenge.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {selectedChallenge.instructions}
                  </p>
                </div>
              )}

              {message && (
                <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
                  {message}
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmitChallenge} className="mt-5 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    GitHub repository link
                  </label>
                  <div className="relative">
                     <Code2
  className="absolute left-4 top-3.5 text-slate-500"
  size={18}
/>
                    <input
                      className="input-field pl-11"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Live demo link
                  </label>
                  <div className="relative">
                    <ExternalLink
                      className="absolute left-4 top-3.5 text-slate-500"
                      size={18}
                    />
                    <input
                      className="input-field pl-11"
                      value={liveDemoLink}
                      onChange={(e) => setLiveDemoLink(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Project explanation
                  </label>
                  <textarea
                    className="input-field min-h-36 resize-none"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                  />
                </div>

                <button
                  disabled={submitting}
                  className="primary-btn inline-flex w-full justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Evidence
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-[2rem] p-6">
            <h2 className="text-2xl font-black">My Submissions</h2>
            <div className="mt-5 space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission._id}
                  className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black">
                        {submission.challengeId?.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-400">
                        Status:{" "}
                        <span className="font-bold text-blue-300">
                          {submission.status}
                        </span>
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-400/10 px-3 py-1 text-xs font-bold text-blue-200">
                      {submission.challengeId?.difficulty}
                    </span>
                  </div>
                </div>
              ))}

              {submissions.length === 0 && (
                <p className="rounded-2xl bg-slate-950/60 p-4 text-slate-400">
                  No submissions yet.
                </p>
              )}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6">
            <h2 className="text-2xl font-black">My Certificates</h2>
            <div className="mt-5 space-y-4">
              {certificates.map((certificate) => (
                <div
                  key={certificate._id}
                  className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5"
                >
                  <h3 className="font-black">{certificate.skillId?.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Certificate ID: {certificate.certificateId}
                  </p>
                  <p className="mt-1 text-sm text-emerald-300">
                    Status: {certificate.status}
                  </p>
                </div>
              ))}

              {certificates.length === 0 && (
                <p className="rounded-2xl bg-slate-950/60 p-4 text-slate-400">
                  No certificates yet.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default StudentDashboard;