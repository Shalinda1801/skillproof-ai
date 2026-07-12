import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

const allowedEvidence = [
  "GITHUB_LINK",
  "LIVE_DEMO_LINK",
  "PROJECT_EXPLANATION",
  "README",
];

const normalizeArray = (value, fallback) => {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((item) => String(item)).slice(0, 8);
  }

  return fallback;
};

const normalizeDifficulty = (value) => {
  const difficulty = String(value || "MEDIUM").toUpperCase();

  if (["EASY", "MEDIUM", "HARD"].includes(difficulty)) {
    return difficulty;
  }

  return "MEDIUM";
};

const normalizeGeneratedChallenge = (data, fallbackInput) => {
  return {
    title:
      String(data.title || "").trim() ||
      `Build a ${fallbackInput.interestArea} project`,

    instructions:
      String(data.instructions || "").trim() ||
      `Build a practical ${fallbackInput.skillTitle} project related to ${fallbackInput.interestArea}. Include clean code, a README, and project explanation.`,

    difficulty: normalizeDifficulty(data.difficulty),

    deadlineDays: Number(data.deadlineDays) || fallbackInput.deadlineDays || 7,

    requiredEvidence: normalizeArray(data.requiredEvidence, allowedEvidence)
      .filter((item) => allowedEvidence.includes(item))
      .slice(0, 5),

    evaluationCriteria: normalizeArray(data.evaluationCriteria, [
      "Project meets the core functional requirements.",
      "Code is organized with clear folder structure.",
      "README explains setup and usage.",
      "Student can explain implementation decisions.",
    ]),

    suggestedFeatures: normalizeArray(data.suggestedFeatures, [
      "Authentication or role-based access where relevant.",
      "Clean UI and responsive layout.",
      "Error handling and validation.",
    ]),

    tags: normalizeArray(data.tags, [
      fallbackInput.skillTitle,
      fallbackInput.interestArea,
    ]),
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

  return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
};

const buildChallengePrompt = ({
  skillTitle,
  skillLevel,
  requiredTags,
  requestedLevel,
  interestArea,
  extraNote,
  deadlineDays,
}) => {
  return `
You are an AI challenge designer for a student skill verification platform.

Create ONE personalized project challenge for the student.

Skill Path: ${skillTitle}
Skill Level from platform: ${skillLevel}
Required Tags: ${(requiredTags || []).join(", ")}
Requested Level: ${requestedLevel}
Student Interest Area: ${interestArea}
Student Extra Note: ${extraNote || "No extra note"}
Deadline Days: ${deadlineDays}

Return only valid JSON in this exact shape:
{
  "title": "challenge title",
  "instructions": "clear project instructions",
  "difficulty": "EASY or MEDIUM or HARD",
  "deadlineDays": 7,
  "requiredEvidence": ["GITHUB_LINK", "LIVE_DEMO_LINK", "PROJECT_EXPLANATION", "README"],
  "evaluationCriteria": ["criterion 1", "criterion 2"],
  "suggestedFeatures": ["feature 1", "feature 2"],
  "tags": ["tag1", "tag2"]
}

Rules:
- The challenge must be practical and buildable by a student.
- The challenge must match the requested level.
- Do not ask for impossible enterprise-level features.
- Required evidence must use only these values:
  GITHUB_LINK, LIVE_DEMO_LINK, SCREENSHOT, PROJECT_EXPLANATION, README.
- Make instructions detailed enough for admin review.
`;
};

const createMockPersonalizedChallenge = (input) => {
  const level = String(input.requestedLevel || "INTERMEDIATE").toUpperCase();

  const difficulty =
    level === "ADVANCED" ? "HARD" : level === "BEGINNER" ? "EASY" : "MEDIUM";

  return normalizeGeneratedChallenge(
    {
      title: `${input.interestArea} Project for ${input.skillTitle}`,
      instructions: `Create a ${input.skillTitle} project focused on ${input.interestArea}. The project should include core CRUD functionality, clean folder structure, input validation, and a useful README. The student must submit a GitHub repository, a short explanation, and a live demo if available.`,
      difficulty,
      deadlineDays: input.deadlineDays,
      requiredEvidence: [
        "GITHUB_LINK",
        "PROJECT_EXPLANATION",
        "README",
        "LIVE_DEMO_LINK",
      ],
      evaluationCriteria: [
        "Project solves the selected real-world problem.",
        "Code structure is clean and understandable.",
        "README includes setup instructions and feature list.",
        "Student explanation clearly describes implementation decisions.",
      ],
      suggestedFeatures: [
        "Authentication if the project requires users.",
        "CRUD operations for the main resource.",
        "Responsive frontend pages.",
        "API validation and meaningful error handling.",
      ],
      tags: [input.skillTitle, input.interestArea, level],
    },
    input
  );
};

export const generatePersonalizedChallengeDraft = async (input) => {
  if (env.aiProvider === "gemini" && env.geminiApiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: env.geminiApiKey,
      });

      const response = await ai.models.generateContent({
        model: env.geminiModel,
        contents: buildChallengePrompt(input),
        config: {
          responseMimeType: "application/json",
        },
      });

      if (!response.text) {
        throw new Error("Gemini returned an empty response.");
      }

      const parsed = extractJsonFromText(response.text);

      return {
        ...normalizeGeneratedChallenge(parsed, input),
        provider: "GEMINI",
        model: env.geminiModel,
        rawResponse: parsed,
      };
    } catch (error) {
      console.error(
        `Gemini challenge generation failed. Using mock fallback: ${error.message}`
      );
    }
  }

  const mockChallenge = createMockPersonalizedChallenge(input);

  return {
    ...mockChallenge,
    provider:
      env.aiProvider === "gemini" && env.geminiApiKey
        ? "MOCK_FALLBACK"
        : "MOCK",
    model:
      env.aiProvider === "gemini" && env.geminiApiKey
        ? `fallback-after-${env.geminiModel}`
        : "mock-challenge-v1",
    rawResponse: mockChallenge,
  };
};
