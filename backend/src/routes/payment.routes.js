import express from "express";
import {
  createCertificatePayment,
  getMyPayments,
  getPaymentByOrderId,
  handlePayHereNotify,
} from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/certificate",
  protect,
  allowRoles("STUDENT"),
  createCertificatePayment
);

router.get("/my", protect, allowRoles("STUDENT"), getMyPayments);

router.get(
  "/order/:orderId",
  protect,
  allowRoles("STUDENT"),
  getPaymentByOrderId
);

router.post("/payhere/notify", handlePayHereNotify);

export default router;