import mongoose from "mongoose";
import { z } from "zod";
import { Challenge } from "../models/Challenge.js";
import { Submission } from "../models/Submission.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const githubUrlSchema = z
  .string()
  .trim()
  .url("GitHub link must be a valid URL")
  .refine((value) => {
    try {
      const url = new URL(value);
      const hostname = url.hostname.toLowerCase();

      return hostname === "github.com" || hostname.endsWith(".github.com");
    } catch {
      return false;
    }
  }, "GitHub link must be a github.com URL");

const optionalUrlSchema = z
  .string()
  .trim()
  .url("Live demo link must be a valid URL")
  .optional();

const createSubmissionSchema = z.object({
  challengeId: z.string().min(1, "Challenge ID is required"),
  githubLink: githubUrlSchema,
  liveDemoLink: optionalUrlSchema,
  explanation: z
    .string()
    .trim()
    .min(30, "Explanation must have at least 30 characters"),
  notes: z.string().trim().max(500, "Notes cannot exceed 500 characters").optional(),
});

const updateSubmissionStatusSchema = z.object({
  status: z.enum(["UNDER_REVIEW", "APPROVED", "REJECTED"]),
  reviewNote: z
    .string()
    .trim()
    .max(1000, "Review note cannot exceed 1000 characters")
    .optional(),
});

const checkObjectId = (id, message, code) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, message, code);
  }
};

const isAdminUser = (user) => {
  return user.role === "ADMIN" || user.role === "SUPER_ADMIN";
};

export const createSubmission = asyncHandler(async (req, res) => {
  const validatedData = createSubmissionSchema.parse(req.body);

  checkObjectId(
    validatedData.challengeId,
    "Invalid challenge ID.",
    "INVALID_CHALLENGE_ID"
  );

  const challenge = await Challenge.findById(validatedData.challengeId);

  if (!challenge || !challenge.isActive) {
    throw new ApiError(404, "Challenge not found.", "CHALLENGE_NOT_FOUND");
  }

  const existingSubmission = await Submission.findOne({
    studentId: req.user._id,
    challengeId: validatedData.challengeId,
  });

  if (existingSubmission) {
    throw new ApiError(
      409,
      "You have already submitted this challenge.",
      "DUPLICATE_SUBMISSION"
    );
  }

  const submission = await Submission.create({
    studentId: req.user._id,
    challengeId: validatedData.challengeId,
    githubLink: validatedData.githubLink,
    liveDemoLink: validatedData.liveDemoLink || "",
    explanation: validatedData.explanation,
    notes: validatedData.notes || "",
    status: "SUBMITTED",
  });

  const populatedSubmission = await Submission.findById(submission._id)
    .populate("challengeId", "title difficulty deadlineDays skillId")
    .populate("studentId", "name email role");

  res.status(201).json({
    success: true,
    message: "Submission created successfully.",
    submission: populatedSubmission,
  });
});

export const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({
    studentId: req.user._id,
  })
    .populate({
      path: "challengeId",
      select: "title difficulty deadlineDays skillId",
      populate: {
        path: "skillId",
        select: "title level requiredTags",
      },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: submissions.length,
    submissions,
  });
});

export const getAllSubmissions = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) {
    const allowedStatuses = [
      "SUBMITTED",
      "AI_REVIEWED",
      "UNDER_REVIEW",
      "APPROVED",
      "REJECTED",
    ];

    if (!allowedStatuses.includes(req.query.status)) {
      throw new ApiError(400, "Invalid submission status.", "INVALID_STATUS");
    }

    filter.status = req.query.status;
  }

  if (req.query.challengeId) {
    checkObjectId(
      req.query.challengeId,
      "Invalid challenge ID.",
      "INVALID_CHALLENGE_ID"
    );

    filter.challengeId = req.query.challengeId;
  }

  if (req.query.studentId) {
    checkObjectId(req.query.studentId, "Invalid student ID.", "INVALID_STUDENT_ID");

    filter.studentId = req.query.studentId;
  }

  const submissions = await Submission.find(filter)
    .populate("studentId", "name email role")
    .populate({
      path: "challengeId",
      select: "title difficulty deadlineDays skillId",
      populate: {
        path: "skillId",
        select: "title level requiredTags",
      },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: submissions.length,
    submissions,
  });
});

export const getSubmissionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  checkObjectId(id, "Invalid submission ID.", "INVALID_SUBMISSION_ID");

  const submission = await Submission.findById(id)
    .populate("studentId", "name email role")
    .populate({
      path: "challengeId",
      select: "title instructions difficulty deadlineDays requiredEvidence skillId",
      populate: {
        path: "skillId",
        select: "title description level requiredTags",
      },
    })
    .populate("reviewedBy", "name email role");

  if (!submission) {
    throw new ApiError(404, "Submission not found.", "SUBMISSION_NOT_FOUND");
  }

  const isOwner =
    submission.studentId._id.toString() === req.user._id.toString();

  if (!isOwner && !isAdminUser(req.user)) {
    throw new ApiError(
      403,
      "You do not have permission to view this submission.",
      "FORBIDDEN"
    );
  }

  res.status(200).json({
    success: true,
    submission,
  });
});

export const updateSubmissionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  checkObjectId(id, "Invalid submission ID.", "INVALID_SUBMISSION_ID");

  const validatedData = updateSubmissionStatusSchema.parse(req.body);

  const submission = await Submission.findById(id);

  if (!submission) {
    throw new ApiError(404, "Submission not found.", "SUBMISSION_NOT_FOUND");
  }

  submission.status = validatedData.status;
  submission.reviewNote = validatedData.reviewNote || "";
  submission.reviewedBy = req.user._id;
  submission.reviewedAt = new Date();

  await submission.save();

  const updatedSubmission = await Submission.findById(submission._id)
    .populate("studentId", "name email role")
    .populate({
      path: "challengeId",
      select: "title difficulty skillId",
      populate: {
        path: "skillId",
        select: "title level",
      },
    })
    .populate("reviewedBy", "name email role");

  res.status(200).json({
    success: true,
    message: "Submission status updated successfully.",
    submission: updatedSubmission,
  });
});