import mongoose from "mongoose";

const allowedDifficulties = ["EASY", "MEDIUM", "HARD"];

const allowedEvidenceTypes = [
  "GITHUB_LINK",
  "LIVE_DEMO_LINK",
  "SCREENSHOT",
  "PROJECT_EXPLANATION",
  "README",
];

const challengeSchema = new mongoose.Schema(
  {
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: [true, "Skill ID is required"],
    },
    title: {
      type: String,
      required: [true, "Challenge title is required"],
      trim: true,
      minlength: [3, "Challenge title must have at least 3 characters"],
      maxlength: [120, "Challenge title cannot exceed 120 characters"],
    },
    instructions: {
      type: String,
      required: [true, "Challenge instructions are required"],
      trim: true,
      minlength: [20, "Instructions must have at least 20 characters"],
    },
    difficulty: {
      type: String,
      enum: allowedDifficulties,
      default: "EASY",
    },
    requiredEvidence: [
      {
        type: String,
        enum: allowedEvidenceTypes,
      },
    ],
    deadlineDays: {
      type: Number,
      default: 7,
      min: [1, "Deadline must be at least 1 day"],
      max: [90, "Deadline cannot exceed 90 days"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

challengeSchema.index({ skillId: 1, difficulty: 1 });

export const Challenge = mongoose.model("Challenge", challengeSchema);