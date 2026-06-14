import mongoose from "mongoose";

const skillLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const recommendations = ["APPROVE", "NEEDS_REVIEW", "REJECT"];
const providers = ["MOCK", "GEMINI"];

const aiAssessmentSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
      unique: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    skillLevel: {
      type: String,
      enum: skillLevels,
      required: true,
    },
    strengths: [
      {
        type: String,
        trim: true,
      },
    ],
    weaknesses: [
      {
        type: String,
        trim: true,
      },
    ],
    improvements: [
      {
        type: String,
        trim: true,
      },
    ],
    certificateRecommendation: {
      type: String,
      enum: recommendations,
      required: true,
    },
    provider: {
      type: String,
      enum: providers,
      default: "MOCK",
    },
    model: {
      type: String,
      default: "mock-assessment-v1",
    },
    rawResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    assessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

aiAssessmentSchema.index({ studentId: 1, createdAt: -1 });
aiAssessmentSchema.index({ challengeId: 1, createdAt: -1 });

export const AiAssessment = mongoose.model("AiAssessment", aiAssessmentSchema);