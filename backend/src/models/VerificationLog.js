import mongoose from "mongoose";

const verificationLogSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      trim: true,
    },
    certificateObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
      default: null,
    },
    result: {
      type: String,
      enum: ["VALID", "REVOKED", "NOT_FOUND"],
      required: true,
    },
    ipAddress: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

verificationLogSchema.index({ certificateId: 1, createdAt: -1 });
verificationLogSchema.index({ result: 1 });

export const VerificationLog = mongoose.model(
  "VerificationLog",
  verificationLogSchema
);