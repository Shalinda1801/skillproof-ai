import QRCode from "qrcode";
import { env } from "../config/env.js";
import { AiAssessment } from "../models/AiAssessment.js";
import { Certificate } from "../models/Certificate.js";
import { Submission } from "../models/Submission.js";
import { ApiError } from "../utils/ApiError.js";

const buildCertificateId = async () => {
  const year = new Date().getFullYear();

  const count = await Certificate.countDocuments({
    certificateId: {
      $regex: `^CERT-${year}-`,
    },
  });

  const nextNumber = String(count + 1).padStart(6, "0");

  return `CERT-${year}-${nextNumber}`;
};

const buildVerificationUrl = (certificateId) => {
  return `${env.appBaseUrl}/verify/${certificateId}`;
};

const getSubmissionForCertificate = async (submissionId) => {
  const submission = await Submission.findById(submissionId)
    .populate("studentId", "name email role")
    .populate({
      path: "challengeId",
      select: "title difficulty skillId",
      populate: {
        path: "skillId",
        select: "title description level requiredTags",
      },
    });

  if (!submission) {
    throw new ApiError(404, "Submission not found.", "SUBMISSION_NOT_FOUND");
  }

  return submission;
};

export const generateCertificateForSubmission = async ({
  submissionId,
  generatedBy,
}) => {
  const existingCertificate = await Certificate.findOne({ submissionId });

  if (existingCertificate) {
    return existingCertificate;
  }

  const submission = await getSubmissionForCertificate(submissionId);

  if (submission.status !== "APPROVED") {
    throw new ApiError(
      400,
      "Submission must be approved before generating a certificate.",
      "SUBMISSION_NOT_APPROVED"
    );
  }

  const assessment = await AiAssessment.findOne({ submissionId });

  if (!assessment) {
    throw new ApiError(
      400,
      "AI assessment is required before generating a certificate.",
      "AI_ASSESSMENT_REQUIRED"
    );
  }

  if (assessment.certificateRecommendation === "REJECT") {
    throw new ApiError(
      400,
      "Certificate cannot be generated for a rejected AI recommendation.",
      "AI_RECOMMENDATION_REJECTED"
    );
  }

  const certificateId = await buildCertificateId();
  const verificationUrl = buildVerificationUrl(certificateId);
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

  const skillId = submission.challengeId.skillId._id;

  const certificate = await Certificate.create({
    certificateId,
    studentId: submission.studentId._id,
    skillId,
    challengeId: submission.challengeId._id,
    submissionId: submission._id,
    assessmentId: assessment._id,
    score: assessment.score,
    skillLevel: assessment.skillLevel,
    status: "APPROVED",
    verificationUrl,
    qrCodeDataUrl,
    issuedAt: new Date(),
    generatedBy,
  });

  return Certificate.findById(certificate._id)
    .populate("studentId", "name email role")
    .populate("skillId", "title description level requiredTags")
    .populate("challengeId", "title difficulty")
    .populate("assessmentId", "score skillLevel certificateRecommendation")
    .populate("generatedBy", "name email role");
};