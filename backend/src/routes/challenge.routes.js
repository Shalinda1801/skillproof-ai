import express from "express";
import {
  approvePersonalizedChallengeRequest,
  createChallenge,
  getChallengeById,
  getChallenges,
  getMyPersonalizedChallengeRequests,
  getPersonalizedChallengeRequestsForAdmin,
  rejectPersonalizedChallengeRequest,
  requestPersonalizedChallenge,
  updateChallenge,
} from "../controllers/challenge.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/ai-requests",
  protect,
  allowRoles("STUDENT"),
  requestPersonalizedChallenge
);

router.get(
  "/ai-requests/my",
  protect,
  allowRoles("STUDENT"),
  getMyPersonalizedChallengeRequests
);

router.get(
  "/ai-requests/admin",
  protect,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  getPersonalizedChallengeRequestsForAdmin
);

router.patch(
  "/ai-requests/:requestId/approve",
  protect,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  approvePersonalizedChallengeRequest
);

router.patch(
  "/ai-requests/:requestId/reject",
  protect,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  rejectPersonalizedChallengeRequest
);

router.get("/", protect, getChallenges);
router.get("/:id", protect, getChallengeById);

router.post("/", protect, allowRoles("ADMIN", "SUPER_ADMIN"), createChallenge);
router.patch(
  "/:id",
  protect,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  updateChallenge
);

export default router;