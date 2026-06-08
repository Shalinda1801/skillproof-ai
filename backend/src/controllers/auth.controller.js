import { z } from "zod";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must have at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(6, "Password must have at least 6 characters"),
  role: z.enum(["STUDENT", "COMPANY"]).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const cleanUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    profile: user.profile,
    createdAt: user.createdAt,
  };
};

export const register = asyncHandler(async (req, res) => {
  const validatedData = registerSchema.parse(req.body);

  const existingUser = await User.findOne({ email: validatedData.email });

  if (existingUser) {
    throw new ApiError(409, "This email is already registered.", "EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await User.hashPassword(validatedData.password);

  const user = await User.create({
    name: validatedData.name,
    email: validatedData.email,
    passwordHash,
    role: validatedData.role || "STUDENT",
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: "Registration successful.",
    token,
    user: cleanUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const validatedData = loginSchema.parse(req.body);

  const user = await User.findOne({ email: validatedData.email }).select("+passwordHash");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.", "INVALID_CREDENTIALS");
  }

  const isPasswordCorrect = await user.comparePassword(validatedData.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password.", "INVALID_CREDENTIALS");
  }

  if (user.status !== "ACTIVE") {
    throw new ApiError(403, "Your account is not active.", "ACCOUNT_NOT_ACTIVE");
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    token,
    user: cleanUser(user),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: cleanUser(req.user),
  });
});
