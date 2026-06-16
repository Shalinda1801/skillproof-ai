import express from "express";
import {
  generateCertificate,
  getAllCertificatesForAdmin,
  getMyCertificates,
  revokeCertificate,
  verifyCertificate,
} from "../controllers/certificate.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/verify/:certificateId", verifyCertificate);

router.post(
  "/generate/:submissionId",
  protect,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  generateCertificate
);

router.get("/my", protect, allowRoles("STUDENT"), getMyCertificates);

router.get(
  "/admin",
  protect,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  getAllCertificatesForAdmin
);

router.patch(
  "/:id/revoke",
  protect,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  revokeCertificate
);

export default router;