import mongoose from "mongoose";
import { z } from "zod";
import { Certificate } from "../models/Certificate.js";
import { VerificationLog } from "../models/VerificationLog.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateCertificateForSubmission } from "../services/certificate.service.js";
import { sendCertificateEmail } from "../services/email.service.js";

const revokeCertificateSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Revoke reason must have at least 5 characters")
    .max(500, "Revoke reason cannot exceed 500 characters"),
});

const checkObjectId = (id, message, code) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, message, code);
  }
};

const getRequestIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    ""
  );
};

export const generateCertificate = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;

  checkObjectId(
    submissionId,
    "Invalid submission ID.",
    "INVALID_SUBMISSION_ID"
  );

  const certificate = await generateCertificateForSubmission({
    submissionId,
    generatedBy: req.user._id,
  });

  const populatedCertificate = await Certificate.findById(certificate._id)
    .populate("studentId", "name email")
    .populate("skillId", "title level requiredTags")
    .populate("challengeId", "title difficulty")
    .populate("assessmentId", "score skillLevel certificateRecommendation");

  let emailResult = {
    skipped: true,
    reason: "Email not attempted",
  };

  try {
    emailResult = await sendCertificateEmail({
      to: populatedCertificate?.studentId?.email,
      studentName: populatedCertificate?.studentId?.name,
      certificateId: populatedCertificate?.certificateId,
      skillTitle: populatedCertificate?.skillId?.title,
    });
  } catch (emailError) {
    console.error("Certificate email failed:", emailError.message);

    emailResult = {
      skipped: true,
      reason: "Email sending failed",
      error: emailError.message,
    };
  }

  res.status(201).json({
    success: true,
    message: "Certificate generated successfully.",
    certificate: populatedCertificate || certificate,
    email: emailResult,
  });
});

export const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({
    studentId: req.user._id,
  })
    .populate("skillId", "title level requiredTags")
    .populate("challengeId", "title difficulty")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: certificates.length,
    certificates,
  });
});

export const getAllCertificatesForAdmin = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) {
    const allowedStatuses = ["PENDING", "APPROVED", "REVOKED"];

    if (!allowedStatuses.includes(req.query.status)) {
      throw new ApiError(400, "Invalid certificate status.", "INVALID_STATUS");
    }

    filter.status = req.query.status;
  }

  const certificates = await Certificate.find(filter)
    .populate("studentId", "name email role")
    .populate("skillId", "title level requiredTags")
    .populate("challengeId", "title difficulty")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: certificates.length,
    certificates,
  });
});

export const verifyCertificate = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;

  const certificate = await Certificate.findOne({ certificateId })
    .populate("studentId", "name email")
    .populate("skillId", "title level requiredTags")
    .populate("challengeId", "title difficulty")
    .populate("assessmentId", "score skillLevel certificateRecommendation");

  let result = "NOT_FOUND";

  if (certificate && certificate.status === "APPROVED") {
    result = "VALID";
    certificate.verificationCount += 1;
    await certificate.save();
  } else if (certificate && certificate.status === "REVOKED") {
    result = "REVOKED";
  }

  await VerificationLog.create({
    certificateId,
    certificateObjectId: certificate?._id || null,
    result,
    ipAddress: getRequestIp(req),
    userAgent: req.headers["user-agent"] || "",
  });

  if (!certificate) {
    throw new ApiError(404, "Certificate not found.", "CERTIFICATE_NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    result,
    certificate: {
      certificateId: certificate.certificateId,
      status: certificate.status,
      student: certificate.studentId,
      skill: certificate.skillId,
      challenge: certificate.challengeId,
      assessment: certificate.assessmentId,
      issuedAt: certificate.issuedAt,
      verificationUrl: certificate.verificationUrl,
      verificationCount: certificate.verificationCount,
      revokedAt: certificate.revokedAt,
      revokeReason: certificate.revokeReason,
    },
  });
});

export const revokeCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  checkObjectId(id, "Invalid certificate ID.", "INVALID_CERTIFICATE_ID");

  const validatedData = revokeCertificateSchema.parse(req.body);

  const certificate = await Certificate.findById(id);

  if (!certificate) {
    throw new ApiError(404, "Certificate not found.", "CERTIFICATE_NOT_FOUND");
  }

  if (certificate.status === "REVOKED") {
    throw new ApiError(
      409,
      "Certificate is already revoked.",
      "CERTIFICATE_ALREADY_REVOKED"
    );
  }

  certificate.status = "REVOKED";
  certificate.revokedBy = req.user._id;
  certificate.revokedAt = new Date();
  certificate.revokeReason = validatedData.reason;

  await certificate.save();

  res.status(200).json({
    success: true,
    message: "Certificate revoked successfully.",
    certificate,
  });
});