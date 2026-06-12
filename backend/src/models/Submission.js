import mongoose from "mongoose";

const allowedStatuses = [
  "SUBMITTED",
  "AI_REVIEWED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
];

const submissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: [true, "Challenge ID is required"],
    },
    githubLink: {
      type: String,
      required: [true, "GitHub link is required"],
      trim: true,
    },
    liveDemoLink: {
      type: String,
      trim: true,
      default: "",
    },
    explanation: {
      type: String,
      required: [true, "Project explanation is required"],
      trim: true,
      minlength: [30, "Explanation must have at least 30 characters"],
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    files: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: allowedStatuses,
      default: "SUBMITTED",
    },
    reviewNote: {
      type: String,
      trim: true,
      default: "",
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
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index(
  {
    studentId: 1,
    challengeId: 1,
  },
  {
    unique: true,
  }
);

submissionSchema.index({
  status: 1,
  createdAt: -1,
});

export const Submission = mongoose.model("Submission", submissionSchema);