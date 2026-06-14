import express from "express";
import {
  assessSubmission,
  getAssessmentBySubmission,
} from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/assess/:submissionId",
  protect,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessSubmission
);

router.get(
  "/assessment/:submissionId",
  protect,
  allowRoles("STUDENT", "ADMIN", "SUPER_ADMIN"),
  getAssessmentBySubmission
);

export default router;