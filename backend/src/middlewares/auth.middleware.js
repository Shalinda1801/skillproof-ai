import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized. Token is missing.", "TOKEN_MISSING");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      throw new ApiError(401, "User no longer exists.", "USER_NOT_FOUND");
    }

    if (user.status !== "ACTIVE") {
      throw new ApiError(403, "Your account is not active.", "ACCOUNT_NOT_ACTIVE");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid or expired token.", "INVALID_TOKEN");
  }
});
