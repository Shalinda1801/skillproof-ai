import mongoose from "mongoose";
import { AiAssessment } from "../models/AiAssessment.js";
import { Submission } from "../models/Submission.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { runAiAssessmentForSubmission } from "../services/aiAssessment.service.js";

const checkObjectId = (id, message, code) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, message, code);
  }
};

const isAdminUser = (user) => {
  return user.role === "ADMIN" || user.role === "SUPER_ADMIN";
};

export const assessSubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;

  checkObjectId(
    submissionId,
    "Invalid submission ID.",
    "INVALID_SUBMISSION_ID"
  );

  const assessment = await runAiAssessmentForSubmission({
    submissionId,
    requestedBy: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "AI assessment completed successfully.",
    assessment,
  });
});

export const getAssessmentBySubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;

  checkObjectId(
    submissionId,
    "Invalid submission ID.",
    "INVALID_SUBMISSION_ID"
  );

  const submission = await Submission.findById(submissionId);

  if (!submission) {
    throw new ApiError(404, "Submission not found.", "SUBMISSION_NOT_FOUND");
  }

  const isOwner = submission.studentId.toString() === req.user._id.toString();

  if (!isOwner && !isAdminUser(req.user)) {
    throw new ApiError(
      403,
      "You do not have permission to view this assessment.",
      "FORBIDDEN"
    );
  }

  const assessment = await AiAssessment.findOne({ submissionId })
    .populate("studentId", "name email role")
    .populate({
      path: "challengeId",
      select: "title difficulty skillId",
      populate: {
        path: "skillId",
        select: "title level requiredTags",
      },
    });

  if (!assessment) {
    throw new ApiError(
      404,
      "AI assessment not found for this submission.",
      "AI_ASSESSMENT_NOT_FOUND"
    );
  }

  res.status(200).json({
    success: true,
    assessment,
  });
});