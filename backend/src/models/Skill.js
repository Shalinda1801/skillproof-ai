import mongoose from "mongoose";

const allowedLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Skill title is required"],
      trim: true,
      minlength: [3, "Skill title must have at least 3 characters"],
      maxlength: [100, "Skill title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Skill description is required"],
      trim: true,
      minlength: [10, "Description must have at least 10 characters"],
    },
    level: {
      type: String,
      enum: allowedLevels,
      default: "BEGINNER",
    },
    requiredTags: [
      {
        type: String,
        trim: true,
      },
    ],
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

skillSchema.index({ title: "text", description: "text" });

export const Skill = mongoose.model("Skill", skillSchema);