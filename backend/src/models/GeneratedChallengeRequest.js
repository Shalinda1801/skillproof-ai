import mongoose from "mongoose";

const requestStatus = ["PENDING", "APPROVED", "REJECTED"];
const allowedLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const allowedDifficulties = ["EASY", "MEDIUM", "HARD"];

const allowedEvidenceTypes = [
  "GITHUB_LINK",
  "LIVE_DEMO_LINK",
  "SCREENSHOT",
  "PROJECT_EXPLANATION",
  "README",
];

const generatedChallengeRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    requestedLevel: {
      type: String,
      enum: allowedLevels,
      required: true,
    },

    interestArea: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 80,
    },

    extraNote: {
      type: String,
      trim: true,
      maxlength: 600,
      default: "",
    },

    generatedTitle: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },

    generatedInstructions: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
    },

    generatedDifficulty: {
      type: String,
      enum: allowedDifficulties,
      default: "MEDIUM",
    },

    generatedRequiredEvidence: [
      {
        type: String,
        enum: allowedEvidenceTypes,
      },
    ],

    generatedEvaluationCriteria: [
      {
        type: String,
        trim: true,
      },
    ],

    generatedSuggestedFeatures: [
      {
        type: String,
        trim: true,
      },
    ],

    generatedTags: [
      {
        type: String,
        trim: true,
      },
    ],

    deadlineDays: {
      type: Number,
      default: 7,
      min: 1,
      max: 90,
    },

    status: {
      type: String,
      enum: requestStatus,
      default: "PENDING",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    adminNote: {
      type: String,
      trim: true,
      maxlength: 600,
      default: "",
    },

    createdChallengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      default: null,
    },

    provider: {
      type: String,
      default: "MOCK",
    },

    model: {
      type: String,
      default: "mock-challenge-v1",
    },

    rawResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

generatedChallengeRequestSchema.index({ studentId: 1, status: 1 });
generatedChallengeRequestSchema.index({ status: 1, createdAt: -1 });

export const GeneratedChallengeRequest = mongoose.model(
  "GeneratedChallengeRequest",
  generatedChallengeRequestSchema
);