import mongoose from "mongoose";
import { z } from "zod";
import { Challenge } from "../models/Challenge.js";
import { Skill } from "../models/Skill.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createChallengeSchema = z.object({
  skillId: z.string().min(1, "Skill ID is required"),
  title: z.string().trim().min(3, "Title must have at least 3 characters"),
  instructions: z.string().trim().min(20, "Instructions must have at least 20 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  requiredEvidence: z
    .array(
      z.enum([
        "GITHUB_LINK",
        "LIVE_DEMO_LINK",
        "SCREENSHOT",
        "PROJECT_EXPLANATION",
        "README",
      ])
    )
    .optional(),
  deadlineDays: z.number().min(1).max(90).optional(),
  isActive: z.boolean().optional(),
});

const updateChallengeSchema = createChallengeSchema.partial();

export const createChallenge = asyncHandler(async (req, res) => {
  const validatedData = createChallengeSchema.parse(req.body);

  if (!mongoose.Types.ObjectId.isValid(validatedData.skillId)) {
    throw new ApiError(400, "Invalid skill ID.", "INVALID_SKILL_ID");
  }

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

export const getChallenges = asyncHandler(async (req, res) => {
  const filter = { isActive: true };

  if (req.query.skillId) {
    if (!mongoose.Types.ObjectId.isValid(req.query.skillId)) {
      throw new ApiError(400, "Invalid skill ID.", "INVALID_SKILL_ID");
    }

    filter.skillId = req.query.skillId;
  }

  const challenges = await Challenge.find(filter)
    .populate("skillId", "title level requiredTags")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: challenges.length,
    challenges,
  });
});

export const getChallengeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid challenge ID.", "INVALID_CHALLENGE_ID");
  }

  const challenge = await Challenge.findById(id).populate(
    "skillId",
    "title level requiredTags"
  );

  if (!challenge || !challenge.isActive) {
    throw new ApiError(404, "Challenge not found.", "CHALLENGE_NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    challenge,
  });
});

export const updateChallenge = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid challenge ID.", "INVALID_CHALLENGE_ID");
  }

  const validatedData = updateChallengeSchema.parse(req.body);

  if (validatedData.skillId && !mongoose.Types.ObjectId.isValid(validatedData.skillId)) {
    throw new ApiError(400, "Invalid skill ID.", "INVALID_SKILL_ID");
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