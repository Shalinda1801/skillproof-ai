import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const allowedRoles = ["STUDENT", "COMPANY", "ADMIN", "SUPER_ADMIN"];
const allowedStatuses = ["ACTIVE", "BLOCKED"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must have at least 2 characters"],
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: allowedRoles,
      default: "STUDENT",
    },
    status: {
      type: String,
      enum: allowedStatuses,
      default: "ACTIVE",
    },
    profile: {
      bio: {
        type: String,
        default: "",
      },
      university: {
        type: String,
        default: "",
      },
      githubUrl: {
        type: String,
        default: "",
      },
      linkedInUrl: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.statics.hashPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

export const User = mongoose.model("User", userSchema);
