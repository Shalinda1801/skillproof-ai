import express from "express";
import {
  createChallenge,
  getChallengeById,
  getChallenges,
  updateChallenge,
} from "../controllers/challenge.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", protect, getChallenges);
router.get("/:id", protect, getChallengeById);

router.post("/", protect, allowRoles("ADMIN", "SUPER_ADMIN"), createChallenge);
router.patch("/:id", protect, allowRoles("ADMIN", "SUPER_ADMIN"), updateChallenge);

export default router;