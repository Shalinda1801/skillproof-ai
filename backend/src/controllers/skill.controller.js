import mongoose from "mongoose";
import { z } from "zod";
import { Skill } from "../models/Skill.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSkillSchema = z.object({
  title: z.string().trim().min(3, "Title must have at least 3 characters"),
  description: z.string().trim().min(10, "Description must have at least 10 characters"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  requiredTags: z.array(z.string().trim()).optional(),
  isActive: z.boolean().optional(),
});

const updateSkillSchema = createSkillSchema.partial();

const makeSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const createSkill = asyncHandler(async (req, res) => {
  const validatedData = createSkillSchema.parse(req.body);

  const slug = makeSlug(validatedData.title);

  const existingSkill = await Skill.findOne({
    $or: [{ title: validatedData.title }, { slug }],
  });

  if (existingSkill) {
    throw new ApiError(409, "Skill already exists.", "SKILL_ALREADY_EXISTS");
  }

  const skill = await Skill.create({
    ...validatedData,
    slug,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Skill created successfully.",
    skill,
  });
});

export const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({ isActive: true }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: skills.length,
    skills,
  });
});

export const getSkillById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid skill ID.", "INVALID_SKILL_ID");
  }

  const skill = await Skill.findById(id);

  if (!skill || !skill.isActive) {
    throw new ApiError(404, "Skill not found.", "SKILL_NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    skill,
  });
});

export const updateSkill = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid skill ID.", "INVALID_SKILL_ID");
  }

  const validatedData = updateSkillSchema.parse(req.body);

  if (validatedData.title) {
    validatedData.slug = makeSlug(validatedData.title);
  }

  const skill = await Skill.findByIdAndUpdate(id, validatedData, {
    new: true,
    runValidators: true,
  });

  if (!skill) {
    throw new ApiError(404, "Skill not found.", "SKILL_NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Skill updated successfully.",
    skill,
  });
});