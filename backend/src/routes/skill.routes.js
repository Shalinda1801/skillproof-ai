import express from "express";
import {
  createSkill,
  getSkillById,
  getSkills,
  updateSkill,
} from "../controllers/skill.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", getSkills);
router.get("/:id", getSkillById);

router.post("/", protect, allowRoles("ADMIN", "SUPER_ADMIN"), createSkill);
router.patch("/:id", protect, allowRoles("ADMIN", "SUPER_ADMIN"), updateSkill);

export default router;