import {
  Award,
  Brain,
  ClipboardList,
  ExternalLink,
  Loader2,
  LogOut,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { challengeApi } from "../api/challengeApi";
import { certificateApi } from "../api/certificateApi";
import { submissionApi } from "../api/submissionApi";
import { useAuth } from "../context/AuthContext";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import { skillApi } from "../api/skillApi";
import { paymentApi } from "../api/paymentApi";

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  const [challenges, setChallenges] = useState([]);
  const [skills, setSkills] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [personalizedRequests, setPersonalizedRequests] = useState([]);
  
  const [formData, setFormData] = useState({
    githubLink: "https://github.com/Shalinda1801/skillproof-ai",
    liveDemoLink: "https://skillproof-ai-demo.vercel.app",
    explanation:
      "This project is a full-stack skill verification platform with authentication, challenge submission, AI-assisted assessment, admin approval, and QR certificate verification.",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [aiChallengeLoading, setAiChallengeLoading] = useState(false);

   const [aiChallengeForm, setAiChallengeForm] = useState({
  skillId: "",
  requestedLevel: "INTERMEDIATE",
  interestArea: "ecommerce",
  deadlineDays: 7,
  extraNote: "I want to practice authentication and product management.",
});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

const [
  skillData,
  challengeData,
  submissionData,
  certificateData,
  personalizedRequestData,
  paymentData,
] = await Promise.all([
  skillApi.getSkills(),
  challengeApi.getChallenges(),
  submissionApi.getMySubmissions(),
  certificateApi.getMyCertificates(),
  challengeApi.getMyPersonalizedChallengeRequests(),
  paymentApi.getMyPayments(),
]);

      const loadedChallenges = challengeData.challenges || [];
      const loadedSkills = skillData.skills || [];
      const loadedSubmissions = submissionData.submissions || [];
      const loadedCertificates = certificateData.certificates || [];
      const loadedPersonalizedRequests = personalizedRequestData.requests || [];
      const loadedPayments = paymentData.payments || [];

      setChallenges(loadedChallenges);
      setSkills(loadedSkills);
      setSubmissions(loadedSubmissions);
      setCertificates(loadedCertificates);
      setPersonalizedRequests(loadedPersonalizedRequests);
      setPayments(loadedPayments);
      setSelectedChallenge(loadedChallenges[0] || null);
      setAiChallengeForm((currentData) => ({
  ...currentData,
  skillId: loadedSkills[0]?._id || currentData.skillId,
}));
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

    const [
  skillData,
  challengeData,
  submissionData,
  certificateData,
  personalizedRequestData,
  paymentData,
] = await Promise.all([
  skillApi.getSkills(),
  challengeApi.getChallenges(),
  submissionApi.getMySubmissions(),
  certificateApi.getMyCertificates(),
  challengeApi.getMyPersonalizedChallengeRequests(),
  paymentApi.getMyPayments(),
]);

      const loadedChallenges = challengeData.challenges || [];
      const loadedSkills = skillData.skills || [];
      const loadedSubmissions = submissionData.submissions || [];
      const loadedCertificates = certificateData.certificates || [];
      const loadedPersonalizedRequests =
        personalizedRequestData.requests || [];
        const loadedPayments = paymentData.payments || [];

      setSkills(loadedSkills);
      setChallenges(loadedChallenges);
      setSubmissions(loadedSubmissions);
      setCertificates(loadedCertificates);
      setPersonalizedRequests(loadedPersonalizedRequests);
      setPayments(loadedPayments);
      setSelectedChallenge(loadedChallenges[0] || null);

      setAiChallengeForm((currentData) => ({
        ...currentData,
        skillId: loadedSkills[0]?._id || currentData.skillId,
      }));
    } catch (err) {
      setError(err.message || "Failed to load student dashboard.");
    } finally {
      setLoading(false);
    }
  };

  fetchInitialDashboardData();
}, []);
    
    const handleAiChallengeChange = (event) => {
  const { name, value } = event.target;

  setAiChallengeForm((currentData) => ({
    ...currentData,
    [name]: name === "deadlineDays" ? Number(value) : value,
  }));
};

const handleRequestAiChallenge = async (event) => {
  event.preventDefault();

  if (!aiChallengeForm.skillId) {
    setError("Please select a skill first.");
    return;
  }

  try {
    setAiChallengeLoading(true);
    setMessage("");
    setError("");

    await challengeApi.requestPersonalizedChallenge(aiChallengeForm);

    setMessage(
      "AI challenge draft generated successfully and sent for admin review."
    );

    await loadDashboardData();
  } catch (err) {
    setError(err.message || "AI challenge request failed.");
  } finally {
    setAiChallengeLoading(false);
  }
};
  
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
   
  const getCertificatePayment = (certificate) => {
  return payments.find((payment) => {
    const paymentCertificateId =
      payment.certificateId?._id || payment.certificateId;

    return (
      paymentCertificateId === certificate._id ||
      payment.certificatePublicId === certificate.certificateId
    );
  });
};

const isCertificatePaid = (certificate) => {
  return getCertificatePayment(certificate)?.status === "PAID";
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
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-600 shadow-lg shadow-purple-600/30">
        <Sparkles />
      </div>

      <div>
        <h2 className="text-2xl font-black">
          Generate My AI Challenge
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Tell Gemini what you want to practice. Admin will review before it becomes available.
        </p>
      </div>
    </div>

    <form onSubmit={handleRequestAiChallenge} className="mt-6">
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        Skill path
      </label>
      <select
        className="input-field"
        name="skillId"
        value={aiChallengeForm.skillId}
        onChange={handleAiChallengeChange}
      >
        <option value="">Select skill</option>

    {skills.map((skill) => (
  <option key={skill._id} value={skill._id}>
    {skill.title}
  </option>
))}   
      </select>

      <label className="mb-2 mt-5 block text-sm font-semibold text-slate-300">
        Requested level
      </label>
      <select
        className="input-field"
        name="requestedLevel"
        value={aiChallengeForm.requestedLevel}
        onChange={handleAiChallengeChange}
      >
        <option value="BEGINNER">BEGINNER</option>
        <option value="INTERMEDIATE">INTERMEDIATE</option>
        <option value="ADVANCED">ADVANCED</option>
      </select>

      <label className="mb-2 mt-5 block text-sm font-semibold text-slate-300">
        Interest area
      </label>
      <input
        className="input-field"
        name="interestArea"
        value={aiChallengeForm.interestArea}
        onChange={handleAiChallengeChange}
        placeholder="ecommerce, education, finance, productivity..."
      />

      <label className="mb-2 mt-5 block text-sm font-semibold text-slate-300">
        Deadline days
      </label>
      <input
        className="input-field"
        type="number"
        min="1"
        max="90"
        name="deadlineDays"
        value={aiChallengeForm.deadlineDays}
        onChange={handleAiChallengeChange}
      />

      <label className="mb-2 mt-5 block text-sm font-semibold text-slate-300">
        Extra note
      </label>
      <textarea
        className="input-field min-h-24 resize-none"
        name="extraNote"
        value={aiChallengeForm.extraNote}
        onChange={handleAiChallengeChange}
        placeholder="Example: I want to practice JWT authentication and product management."
      />

      <button
        type="submit"
        className="primary-btn mt-6 inline-flex w-full justify-center gap-2"
        disabled={aiChallengeLoading}
      >
        {aiChallengeLoading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Sparkles size={18} />
        )}
        {aiChallengeLoading
          ? "Generating Challenge..."
          : "Generate My AI Challenge"}
      </button>
    </form>
  </div>

  <div className="glass-card rounded-[2rem] p-6">
    <h2 className="text-2xl font-black">My AI Challenge Requests</h2>
    <p className="mt-2 text-sm text-slate-400">
      Your generated challenge drafts will appear here while waiting for admin approval.
    </p>

    <div className="mt-5 space-y-4">
      {personalizedRequests.map((request) => (
        <div
          key={request._id}
          className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-black">
                {request.generatedTitle}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Skill: {request.skillId?.title || "Skill"}
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

          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
            {request.generatedInstructions}
          </p>

          {request.createdChallengeId && (
            <p className="mt-4 text-sm font-bold text-emerald-300">
              Approved challenge is now available in your challenge list.
            </p>
          )}
        </div>
      ))}

      {personalizedRequests.length === 0 && (
        <p className="rounded-2xl bg-slate-950/60 p-4 text-slate-400">
          No AI challenge requests yet.
        </p>
      )}
    </div>
  </div>
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
          <div className="mt-4">
  {isCertificatePaid(certificate) ? (
    <>
      <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-200">
        Payment completed. Certificate access unlocked.
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to={`/certificate/${certificate.certificateId}`}
          className="secondary-btn text-sm"
        >
          View Certificate
        </Link>

        <Link
          to={`/verify/${certificate.certificateId}`}
          className="secondary-btn text-sm"
        >
          Verify Publicly
        </Link>
      </div>
    </>
  ) : (
    <>
      <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm font-bold text-amber-100">
        Payment required to unlock certificate access.
      </div>

      <Link
        to={`/checkout/${certificate._id}`}
        className="primary-btn inline-flex text-sm"
      >
        Pay Certificate Fee
      </Link>
    </>
  )}
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