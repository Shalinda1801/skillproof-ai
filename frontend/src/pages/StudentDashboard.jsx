import {
  Award,
  Brain,
  ClipboardList,
  ExternalLink,
  Loader2,
  LogOut,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { challengeApi } from "../api/challengeApi";
import { certificateApi } from "../api/certificateApi";
import { submissionApi } from "../api/submissionApi";
import { useAuth } from "../context/AuthContext";
import AnimatedBackground from "../components/ui/AnimatedBackground";

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const [formData, setFormData] = useState({
    githubLink: "https://github.com/Shalinda1801/skillproof-ai",
    liveDemoLink: "https://skillproof-ai-demo.vercel.app",
    explanation:
      "This project is a full-stack skill verification platform with authentication, challenge submission, AI-assisted assessment, admin approval, and QR certificate verification.",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [challengeData, submissionData, certificateData] =
        await Promise.all([
          challengeApi.getChallenges(),
          submissionApi.getMySubmissions(),
          certificateApi.getMyCertificates(),
        ]);

      const loadedChallenges = challengeData.challenges || [];
      const loadedSubmissions = submissionData.submissions || [];
      const loadedCertificates = certificateData.certificates || [];

      setChallenges(loadedChallenges);
      setSubmissions(loadedSubmissions);
      setCertificates(loadedCertificates);
      setSelectedChallenge(loadedChallenges[0] || null);
    } catch (err) {
      setError(err.message || "Failed to load student dashboard.");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  const fetchInitialDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [challengeData, submissionData, certificateData] =
        await Promise.all([
          challengeApi.getChallenges(),
          submissionApi.getMySubmissions(),
          certificateApi.getMyCertificates(),
        ]);

      const loadedChallenges = challengeData.challenges || [];
      const loadedSubmissions = submissionData.submissions || [];
      const loadedCertificates = certificateData.certificates || [];

      setChallenges(loadedChallenges);
      setSubmissions(loadedSubmissions);
      setCertificates(loadedCertificates);
      setSelectedChallenge(loadedChallenges[0] || null);
    } catch (err) {
      setError(err.message || "Failed to load student dashboard.");
    } finally {
      setLoading(false);
    }
  };

  fetchInitialDashboardData();
}, []);
  const handleChange = (event) => {
    setFormData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmitChallenge = async (event) => {
    event.preventDefault();

    if (!selectedChallenge) {
      setError("Please select a challenge first.");
      return;
    }

    try {
      setSubmitLoading(true);
      setMessage("");
      setError("");

      await submissionApi.createSubmission({
        challengeId: selectedChallenge._id,
        githubLink: formData.githubLink,
        liveDemoLink: formData.liveDemoLink,
        explanation: formData.explanation,
        notes: formData.notes,
      });

      setMessage("Challenge evidence submitted successfully.");
      await loadDashboardData();
    } catch (err) {
      setError(err.message || "Submission failed.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const cards = [
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
    <>
      <AnimatedBackground />

      <main className="relative z-10 min-h-screen px-6 py-6 text-slate-100">
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

          <section className="glass-card pro-card rounded-[2rem] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-300">
              Student workspace
            </p>
            <h1 className="mt-3 max-w-5xl text-4xl font-black leading-tight md:text-5xl">
              Hi {user?.name}, prove your skills with real project evidence.
            </h1>
            <p className="mt-4 max-w-3xl text-slate-400">
              Submit challenge evidence, receive AI-assisted feedback, and earn
              QR-verifiable certificates after approval.
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
              Loading student dashboard...
            </div>
          ) : (
            <>
              <section className="mt-6 grid gap-5 md:grid-cols-3">
                {cards.map((card) => (
                  <div
                    key={card.title}
                    className="glass-card pro-card rounded-3xl p-6"
                  >
                    <card.icon className="mb-5 text-blue-300" size={34} />
                    <h2 className="text-xl font-black">{card.title}</h2>
                    <p className="mt-2 text-4xl font-black gradient-text">
                      {card.value}
                    </p>
                  </div>
                ))}
              </section>

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
                              {challenge.description}
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                              {challenge.skillId?.title || "Skill challenge"}
                            </p>
                          </div>

                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                            {challenge.difficulty || "TASK"}
                          </span>
                        </div>
                      </button>
                    ))}

                    {challenges.length === 0 && (
                      <p className="rounded-2xl bg-slate-950/60 p-4 text-slate-400">
                        No challenges available yet.
                      </p>
                    )}
                  </div>
                </div>

                <div className="glass-card rounded-[2rem] p-6">
                  <h2 className="text-2xl font-black">
                    Submit Challenge Evidence
                  </h2>

                  {selectedChallenge ? (
                    <>
                      <div className="mt-5 rounded-3xl border border-blue-400/20 bg-blue-400/10 p-5">
                        <p className="text-sm font-bold text-blue-200">
                          Selected Challenge
                        </p>
                        <h3 className="mt-2 text-xl font-black">
                          {selectedChallenge.title}
                        </h3>
                        <p className="mt-2 leading-7 text-slate-300">
                          {selectedChallenge.description}
                        </p>
                      </div>

                      <form onSubmit={handleSubmitChallenge} className="mt-5">
                        <label className="mb-2 block text-sm font-semibold text-slate-300">
                          GitHub repository link
                        </label>
                        <input
                          className="input-field"
                          name="githubLink"
                          value={formData.githubLink}
                          onChange={handleChange}
                          placeholder="https://github.com/username/project"
                        />

                        <label className="mb-2 mt-5 block text-sm font-semibold text-slate-300">
                          Live demo link
                        </label>
                        <input
                          className="input-field"
                          name="liveDemoLink"
                          value={formData.liveDemoLink}
                          onChange={handleChange}
                          placeholder="https://your-demo.vercel.app"
                        />

                        <label className="mb-2 mt-5 block text-sm font-semibold text-slate-300">
                          Project explanation
                        </label>
                        <textarea
                          className="input-field min-h-32 resize-none"
                          name="explanation"
                          value={formData.explanation}
                          onChange={handleChange}
                          placeholder="Explain what you built and what skills you used."
                        />

                        <label className="mb-2 mt-5 block text-sm font-semibold text-slate-300">
                          Extra notes
                        </label>
                        <textarea
                          className="input-field min-h-24 resize-none"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="Optional notes for the verifier."
                        />

                        <button
                          type="submit"
                          className="primary-btn mt-6 inline-flex w-full justify-center gap-2"
                          disabled={submitLoading}
                        >
                          {submitLoading ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <Send size={18} />
                          )}
                          Submit Evidence
                        </button>
                      </form>
                    </>
                  ) : (
                    <p className="mt-5 rounded-2xl bg-slate-950/60 p-4 text-slate-400">
                      Select a challenge first.
                    </p>
                  )}
                </div>
              </section>

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
                              {submission.challengeId?.title || "Challenge"}
                            </h3>
                            <p className="mt-2 text-sm text-slate-400">
                              Status:{" "}
                              <span className="font-bold text-blue-300">
                                {submission.status}
                              </span>
                            </p>
                          </div>

                          <a
                            href={submission.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-bold text-blue-300"
                          >
                            GitHub
                            <ExternalLink size={15} />
                          </a>
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
                        <h3 className="font-black">
                          {certificate.skillId?.title || "Skill Certificate"}
                        </h3>
                        <p className="mt-2 text-sm text-slate-400">
                          Certificate ID: {certificate.certificateId}
                        </p>
                        <p className="mt-1 text-sm text-emerald-300">
                          Status: {certificate.status}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
  <a
    href={`/certificate/${certificate.certificateId}`}
    className="secondary-btn text-sm"
  >
    View Certificate
  </a>

  <a
    href={`/verify/${certificate.certificateId}`}
    className="secondary-btn text-sm"
  >
    Verify Publicly
  </a>
</div>
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
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default StudentDashboard;