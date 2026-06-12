import express from "express";
import {
  createSubmission,
  getAllSubmissions,
  getMySubmissions,
  getSubmissionById,
  updateSubmissionStatus,
} from "../controllers/submission.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", protect, allowRoles("STUDENT"), createSubmission);

router.get("/my", protect, allowRoles("STUDENT"), getMySubmissions);

router.get(
  "/",
  protect,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  getAllSubmissions
);

router.get(
  "/:id",
  protect,
  allowRoles("STUDENT", "ADMIN", "SUPER_ADMIN"),
  getSubmissionById
);

router.patch(
  "/:id/status",
  protect,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  updateSubmissionStatus
);

export default router;