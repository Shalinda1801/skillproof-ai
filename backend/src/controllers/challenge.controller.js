import mongoose from "mongoose";
import { z } from "zod";
import { Challenge } from "../models/Challenge.js";
import { GeneratedChallengeRequest } from "../models/GeneratedChallengeRequest.js";
import { Skill } from "../models/Skill.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generatePersonalizedChallengeDraft } from "../services/personalizedChallenge.service.js";

const evidenceTypes = [
  "GITHUB_LINK",
  "LIVE_DEMO_LINK",
  "SCREENSHOT",
  "PROJECT_EXPLANATION",
  "README",
];

const createChallengeSchema = z.object({
  skillId: z.string().min(1, "Skill ID is required"),
  title: z.string().trim().min(3, "Title must have at least 3 characters"),
  instructions: z
    .string()
    .trim()
    .min(20, "Instructions must have at least 20 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  requiredEvidence: z.array(z.enum(evidenceTypes)).optional(),
  deadlineDays: z.number().min(1).max(90).optional(),
  isActive: z.boolean().optional(),
});

const updateChallengeSchema = createChallengeSchema.partial();

const aiChallengeRequestSchema = z.object({
  skillId: z.string().min(1, "Skill ID is required"),
  requestedLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  interestArea: z
    .string()
    .trim()
    .min(3, "Interest area must have at least 3 characters")
    .max(80, "Interest area cannot exceed 80 characters"),
  deadlineDays: z.number().min(1).max(90).optional(),
  extraNote: z.string().trim().max(600).optional(),
});

const reviewAiChallengeSchema = z.object({
  adminNote: z.string().trim().max(600).optional(),
});

const checkObjectId = (id, message, code) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, message, code);
  }
};

export const createChallenge = asyncHandler(async (req, res) => {
  const validatedData = createChallengeSchema.parse(req.body);

  checkObjectId(validatedData.skillId, "Invalid skill ID.", "INVALID_SKILL_ID");

  const skill = await Skill.findById(validatedData.skillId);

  if (!skill || !skill.isActive) {
    throw new ApiError(404, "Skill not found.", "SKILL_NOT_FOUND");
  }

  const challenge = await Challenge.create({
    ...validatedData,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Challenge created successfully.",
    challenge,
  });
});

export const requestPersonalizedChallenge = asyncHandler(async (req, res) => {
  const validatedData = aiChallengeRequestSchema.parse(req.body);

  checkObjectId(validatedData.skillId, "Invalid skill ID.", "INVALID_SKILL_ID");

  const skill = await Skill.findById(validatedData.skillId);

  if (!skill || !skill.isActive) {
    throw new ApiError(404, "Skill not found.", "SKILL_NOT_FOUND");
  }

  const generatedDraft = await generatePersonalizedChallengeDraft({
    skillTitle: skill.title,
    skillLevel: skill.level,
    requiredTags: skill.requiredTags || [],
    requestedLevel: validatedData.requestedLevel,
    interestArea: validatedData.interestArea,
    extraNote: validatedData.extraNote || "",
    deadlineDays: validatedData.deadlineDays || 7,
  });

  const request = await GeneratedChallengeRequest.create({
    studentId: req.user._id,
    skillId: skill._id,
    requestedLevel: validatedData.requestedLevel,
    interestArea: validatedData.interestArea,
    extraNote: validatedData.extraNote || "",
    deadlineDays: generatedDraft.deadlineDays,
    generatedTitle: generatedDraft.title,
    generatedInstructions: generatedDraft.instructions,
    generatedDifficulty: generatedDraft.difficulty,
    generatedRequiredEvidence: generatedDraft.requiredEvidence,
    generatedEvaluationCriteria: generatedDraft.evaluationCriteria,
    generatedSuggestedFeatures: generatedDraft.suggestedFeatures,
    generatedTags: generatedDraft.tags,
    provider: generatedDraft.provider,
    model: generatedDraft.model,
    rawResponse: generatedDraft.rawResponse,
  });

  const populatedRequest = await GeneratedChallengeRequest.findById(request._id)
    .populate("studentId", "name email role")
    .populate("skillId", "title level requiredTags");

  res.status(201).json({
    success: true,
    message: "Personalized challenge draft generated and sent for admin review.",
    request: populatedRequest,
  });
});

export const getMyPersonalizedChallengeRequests = asyncHandler(
  async (req, res) => {
    const requests = await GeneratedChallengeRequest.find({
      studentId: req.user._id,
    })
      .populate("skillId", "title level requiredTags")
      .populate("createdChallengeId", "title difficulty deadlineDays isActive")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  }
);

export const getPersonalizedChallengeRequestsForAdmin = asyncHandler(
  async (req, res) => {
    const filter = {};

    if (req.query.status) {
      const allowedStatuses = ["PENDING", "APPROVED", "REJECTED"];

      if (!allowedStatuses.includes(req.query.status)) {
        throw new ApiError(400, "Invalid request status.", "INVALID_STATUS");
      }

      filter.status = req.query.status;
    }

    const requests = await GeneratedChallengeRequest.find(filter)
      .populate("studentId", "name email role")
      .populate("skillId", "title level requiredTags")
      .populate("createdChallengeId", "title difficulty deadlineDays isActive")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  }
);

export const approvePersonalizedChallengeRequest = asyncHandler(
  async (req, res) => {
    const { requestId } = req.params;

    checkObjectId(
      requestId,
      "Invalid challenge request ID.",
      "INVALID_CHALLENGE_REQUEST_ID"
    );

    const validatedData = reviewAiChallengeSchema.parse(req.body);

    const request = await GeneratedChallengeRequest.findById(requestId);

    if (!request) {
      throw new ApiError(
        404,
        "Personalized challenge request not found.",
        "CHALLENGE_REQUEST_NOT_FOUND"
      );
    }

    if (request.status !== "PENDING") {
      throw new ApiError(
        409,
        "This challenge request has already been reviewed.",
        "CHALLENGE_REQUEST_ALREADY_REVIEWED"
      );
    }

    const challenge = await Challenge.create({
      skillId: request.skillId,
      title: request.generatedTitle,
      instructions: request.generatedInstructions,
      difficulty: request.generatedDifficulty,
      requiredEvidence: request.generatedRequiredEvidence,
      deadlineDays: request.deadlineDays,
      assignedStudentId: request.studentId,
      source: "AI_PERSONALIZED",
      isActive: true,
      createdBy: req.user._id,
    });

    request.status = "APPROVED";
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    request.adminNote =
      validatedData.adminNote || "AI-generated challenge approved by admin.";
    request.createdChallengeId = challenge._id;

    await request.save();

    const populatedRequest = await GeneratedChallengeRequest.findById(
      request._id
    )
      .populate("studentId", "name email role")
      .populate("skillId", "title level requiredTags")
      .populate("createdChallengeId", "title difficulty deadlineDays isActive");

    res.status(200).json({
      success: true,
      message: "Personalized challenge approved and created for student.",
      request: populatedRequest,
      challenge,
    });
  }
);

export const rejectPersonalizedChallengeRequest = asyncHandler(
  async (req, res) => {
    const { requestId } = req.params;

    checkObjectId(
      requestId,
      "Invalid challenge request ID.",
      "INVALID_CHALLENGE_REQUEST_ID"
    );

    const validatedData = reviewAiChallengeSchema.parse(req.body);

    const request = await GeneratedChallengeRequest.findById(requestId);

    if (!request) {
      throw new ApiError(
        404,
        "Personalized challenge request not found.",
        "CHALLENGE_REQUEST_NOT_FOUND"
      );
    }

    if (request.status !== "PENDING") {
      throw new ApiError(
        409,
        "This challenge request has already been reviewed.",
        "CHALLENGE_REQUEST_ALREADY_REVIEWED"
      );
    }

    request.status = "REJECTED";
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    request.adminNote =
      validatedData.adminNote || "AI-generated challenge rejected by admin.";

    await request.save();

    res.status(200).json({
      success: true,
      message: "Personalized challenge request rejected.",
      request,
    });
  }
);

export const getChallenges = asyncHandler(async (req, res) => {
  const filter = { isActive: true };

  if (req.user?.role === "STUDENT") {
    filter.$or = [
      { assignedStudentId: null },
      { assignedStudentId: req.user._id },
    ];
  }

  if (req.query.skillId) {
    checkObjectId(req.query.skillId, "Invalid skill ID.", "INVALID_SKILL_ID");
    filter.skillId = req.query.skillId;
  }

  const challenges = await Challenge.find(filter)
    .populate("skillId", "title level requiredTags")
    .populate("assignedStudentId", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: challenges.length,
    challenges,
  });
});

export const getChallengeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  checkObjectId(id, "Invalid challenge ID.", "INVALID_CHALLENGE_ID");

  const challenge = await Challenge.findById(id)
    .populate("skillId", "title level requiredTags")
    .populate("assignedStudentId", "name email");

  if (!challenge || !challenge.isActive) {
    throw new ApiError(404, "Challenge not found.", "CHALLENGE_NOT_FOUND");
  }

  if (
    req.user?.role === "STUDENT" &&
    challenge.assignedStudentId &&
    String(challenge.assignedStudentId._id) !== String(req.user._id)
  ) {
    throw new ApiError(
      403,
      "You are not allowed to access this personalized challenge.",
      "PERSONALIZED_CHALLENGE_FORBIDDEN"
    );
  }

  res.status(200).json({
    success: true,
    challenge,
  });
});

export const updateChallenge = asyncHandler(async (req, res) => {
  const { id } = req.params;

  checkObjectId(id, "Invalid challenge ID.", "INVALID_CHALLENGE_ID");

  const validatedData = updateChallengeSchema.parse(req.body);

  if (validatedData.skillId) {
    checkObjectId(validatedData.skillId, "Invalid skill ID.", "INVALID_SKILL_ID");
  }

  const challenge = await Challenge.findByIdAndUpdate(id, validatedData, {
    new: true,
    runValidators: true,
  });

  if (!challenge) {
    throw new ApiError(404, "Challenge not found.", "CHALLENGE_NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Challenge updated successfully.",
    challenge,
  });
});