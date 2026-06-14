import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";
import { AiAssessment } from "../models/AiAssessment.js";
import { Submission } from "../models/Submission.js";
import { ApiError } from "../utils/ApiError.js";

const clampScore = (score) => {
  const numericScore = Number(score);

  if (Number.isNaN(numericScore)) {
    return 60;
  }

  return Math.min(100, Math.max(0, numericScore));
};

const safeArray = (value, fallback) => {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((item) => String(item)).slice(0, 6);
  }

  return fallback;
};

const normalizeAssessment = (assessment) => {
  const score = clampScore(assessment.score);

  let skillLevel = assessment.skillLevel || "BEGINNER";
  skillLevel = String(skillLevel).toUpperCase();

  if (!["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(skillLevel)) {
    if (score >= 80) {
      skillLevel = "ADVANCED";
    } else if (score >= 60) {
      skillLevel = "INTERMEDIATE";
    } else {
      skillLevel = "BEGINNER";
    }
  }

  let certificateRecommendation =
    assessment.certificateRecommendation || "NEEDS_REVIEW";
  certificateRecommendation = String(certificateRecommendation)
    .toUpperCase()
    .replace(" ", "_");

  if (
    !["APPROVE", "NEEDS_REVIEW", "REJECT"].includes(certificateRecommendation)
  ) {
    certificateRecommendation =
      score >= 80 ? "APPROVE" : score >= 50 ? "NEEDS_REVIEW" : "REJECT";
  }

  return {
    score,
    skillLevel,
    strengths: safeArray(assessment.strengths, [
      "Submission includes a project explanation.",
      "GitHub evidence was provided.",
    ]),
    weaknesses: safeArray(assessment.weaknesses, [
      "Testing evidence is not clearly mentioned.",
      "Deployment evidence may need manual verification.",
    ]),
    improvements: safeArray(assessment.improvements, [
      "Add a clear README with setup instructions.",
      "Add screenshots, API documentation, and test cases.",
    ]),
    certificateRecommendation,
  };
};

const extractJsonFromText = (text) => {
  const cleaned = String(text)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("AI response did not contain JSON.");
  }

  const jsonText = cleaned.slice(firstBrace, lastBrace + 1);
  return JSON.parse(jsonText);
};

const buildPrompt = (submission) => {
  const challenge = submission.challengeId;
  const skill = challenge.skillId;

  return `
You are an AI verifier for a student skill verification platform.

Evaluate the student's project submission and return only valid JSON.

Skill Path: ${skill?.title || "Unknown Skill"}
Skill Level: ${skill?.level || "Unknown Level"}
Required Tags: ${(skill?.requiredTags || []).join(", ")}

Challenge Title: ${challenge?.title}
Challenge Difficulty: ${challenge?.difficulty}
Challenge Instructions: ${challenge?.instructions}

Student GitHub Link: ${submission.githubLink}
Student Live Demo Link: ${submission.liveDemoLink || "Not provided"}
Student Explanation: ${submission.explanation}
Student Notes: ${submission.notes || "No notes"}

Return JSON exactly in this shape:
{
  "score": 0,
  "skillLevel": "BEGINNER or INTERMEDIATE or ADVANCED",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "certificateRecommendation": "APPROVE or NEEDS_REVIEW or REJECT"
}

Rules:
- Score must be from 0 to 100.
- Do not approve only because a GitHub link exists.
- Give NEEDS_REVIEW if evidence is incomplete.
- Be fair to beginner students but mention missing testing, deployment, documentation, or security when needed.
`;
};

const createMockAssessment = (submission) => {
  let score = 62;

  if (submission.githubLink?.includes("github.com")) {
    score += 8;
  }

  if (submission.liveDemoLink) {
    score += 8;
  }

  if (submission.explanation && submission.explanation.length > 120) {
    score += 7;
  }

  if (
    submission.explanation?.toLowerCase().includes("authentication") ||
    submission.explanation?.toLowerCase().includes("api")
  ) {
    score += 5;
  }

  score = clampScore(score);

  return normalizeAssessment({
    score,
    skillLevel:
      score >= 80 ? "ADVANCED" : score >= 60 ? "INTERMEDIATE" : "BEGINNER",
    strengths: [
      "The submission includes a GitHub project link.",
      "The project explanation describes the main functionality clearly.",
      "The submission is connected to the selected challenge workflow.",
    ],
    weaknesses: [
      "Testing evidence is not clearly provided.",
      "Code quality and repository structure still require manual verifier review.",
      "Deployment link availability is not deeply verified in mock mode.",
    ],
    improvements: [
      "Add a detailed README with setup steps and screenshots.",
      "Add backend API tests using Jest and Supertest.",
      "Include deployment evidence and project architecture explanation.",
    ],
    certificateRecommendation:
      score >= 80 ? "APPROVE" : score >= 50 ? "NEEDS_REVIEW" : "REJECT",
  });
};

const createGeminiAssessment = async (submission) => {
  if (!env.geminiApiKey) {
    throw new Error("Gemini API key is missing.");
  }

  const ai = new GoogleGenAI({
    apiKey: env.geminiApiKey,
  });

  const response = await ai.models.generateContent({
    model: env.geminiModel,
    contents: buildPrompt(submission),
    config: {
      responseMimeType: "application/json",
    },
  });

  const parsedResponse = extractJsonFromText(response.text);
  return normalizeAssessment(parsedResponse);
};

const getSubmissionForAssessment = async (submissionId) => {
  const submission = await Submission.findById(submissionId)
    .populate("studentId", "name email role")
    .populate({
      path: "challengeId",
      select: "title instructions difficulty requiredEvidence skillId",
      populate: {
        path: "skillId",
        select: "title description level requiredTags",
      },
    });

  if (!submission) {
    throw new ApiError(404, "Submission not found.", "SUBMISSION_NOT_FOUND");
  }

  return submission;
};

export const runAiAssessmentForSubmission = async ({
  submissionId,
  requestedBy = null,
}) => {
  const submission = await getSubmissionForAssessment(submissionId);

  let provider = "MOCK";
  let model = "mock-assessment-v1";
  let assessmentResult;

  if (env.aiProvider === "gemini" && env.geminiApiKey) {
    try {
      assessmentResult = await createGeminiAssessment(submission);
      provider = "GEMINI";
      model = env.geminiModel;
    } catch (error) {
      console.error(`Gemini assessment failed. Using mock mode: ${error.message}`);
      assessmentResult = createMockAssessment(submission);
    }
  } else {
    assessmentResult = createMockAssessment(submission);
  }

  const savedAssessment = await AiAssessment.findOneAndUpdate(
    {
      submissionId: submission._id,
    },
    {
      submissionId: submission._id,
      studentId: submission.studentId._id,
      challengeId: submission.challengeId._id,
      score: assessmentResult.score,
      skillLevel: assessmentResult.skillLevel,
      strengths: assessmentResult.strengths,
      weaknesses: assessmentResult.weaknesses,
      improvements: assessmentResult.improvements,
      certificateRecommendation: assessmentResult.certificateRecommendation,
      provider,
      model,
      rawResponse: {
        ...assessmentResult,
        requestedBy,
      },
      assessedAt: new Date(),
    },
    {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    }
  )
    .populate("studentId", "name email role")
    .populate({
      path: "challengeId",
      select: "title difficulty skillId",
      populate: {
        path: "skillId",
        select: "title level requiredTags",
      },
    });

  if (["SUBMITTED", "UNDER_REVIEW"].includes(submission.status)) {
    submission.status = "AI_REVIEWED";
    await submission.save();
  }

  return savedAssessment;
};