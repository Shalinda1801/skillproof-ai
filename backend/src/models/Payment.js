import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
      required: true,
    },

    certificatePublicId: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "LKR",
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "CANCELLED"],
      default: "PENDING",
    },

    provider: {
      type: String,
      default: "PAYHERE",
    },

    providerPaymentId: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    rawNotifyPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ studentId: 1, createdAt: -1 });
paymentSchema.index({ certificateId: 1 });
paymentSchema.index({ status: 1 });

export const Payment = mongoose.model("Payment", paymentSchema);