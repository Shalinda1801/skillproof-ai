import crypto from "crypto";
import { z } from "zod";
import { Certificate } from "../models/Certificate.js";
import { Payment } from "../models/Payment.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCertificatePaymentSchema = z.object({
  certificateId: z.string().min(1, "Certificate ID is required"),
});

const formatAmount = (amount) => {
  return Number(amount).toFixed(2);
};

const getPaymentMode = () => {
  return process.env.PAYMENT_MODE || "demo";
};

const getPayHereConfig = () => {
  return {
    merchantId: process.env.PAYHERE_MERCHANT_ID || "",
    merchantSecret: process.env.PAYHERE_MERCHANT_SECRET || "",
    currency: process.env.PAYHERE_CURRENCY || "LKR",
    amount: Number(process.env.CERTIFICATE_PAYMENT_AMOUNT || 1500),
    sandboxUrl: "https://sandbox.payhere.lk/pay/checkout",
  };
};

const generatePayHereHash = ({
  merchantId,
  orderId,
  amount,
  currency,
  merchantSecret,
}) => {
  const hashedSecret = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();

  const rawHash = `${merchantId}${orderId}${amount}${currency}${hashedSecret}`;

  return crypto.createHash("md5").update(rawHash).digest("hex").toUpperCase();
};

const generateNotifyHash = ({
  merchantId,
  orderId,
  payhereAmount,
  payhereCurrency,
  statusCode,
  merchantSecret,
}) => {
  const hashedSecret = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();

  const rawHash = `${merchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${hashedSecret}`;

  return crypto.createHash("md5").update(rawHash).digest("hex").toUpperCase();
};

export const createCertificatePayment = asyncHandler(async (req, res) => {
  const validatedData = createCertificatePaymentSchema.parse(req.body);

  const config = getPayHereConfig();
  const paymentMode = getPaymentMode();

  const certificate = await Certificate.findById(validatedData.certificateId)
    .populate("studentId", "name email")
    .populate("skillId", "title");

  if (!certificate) {
    throw new ApiError(404, "Certificate not found.", "CERTIFICATE_NOT_FOUND");
  }

  if (certificate.studentId._id.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You cannot pay for another student's certificate.",
      "FORBIDDEN"
    );
  }

  const existingPaidPayment = await Payment.findOne({
    certificateId: certificate._id,
    studentId: req.user._id,
    status: "PAID",
  });

  const baseUrl = process.env.APP_BASE_URL || "http://localhost:5173";

  if (existingPaidPayment) {
    return res.status(200).json({
      success: true,
      message: "Certificate payment is already completed.",
      alreadyPaid: true,
      payment: existingPaidPayment,
      redirectUrl: `${baseUrl}/payment-success?order_id=${existingPaidPayment.orderId}`,
    });
  }

  const orderId = `SP-${Date.now()}-${certificate.certificateId}`;
  const amount = formatAmount(config.amount);
  const currency = config.currency;

  const payment = await Payment.create({
    orderId,
    studentId: req.user._id,
    certificateId: certificate._id,
    certificatePublicId: certificate.certificateId,
    amount: Number(amount),
    currency,
    status: "PENDING",
  });

  if (paymentMode === "demo") {
    payment.status = "PAID";
    payment.providerPaymentId = `DEMO-${Date.now()}`;
    payment.paymentMethod = "DEMO_PAYMENT";
    payment.paidAt = new Date();
    payment.rawNotifyPayload = {
      mode: "demo",
      message: "Payment marked as PAID automatically for local demo.",
    };

    await payment.save();

    return res.status(201).json({
      success: true,
      message: "Demo payment completed successfully.",
      demoMode: true,
      payment,
      redirectUrl: `${baseUrl}/payment-success?order_id=${orderId}`,
    });
  }

  if (!config.merchantId || !config.merchantSecret) {
    throw new ApiError(
      500,
      "PayHere credentials are not configured.",
      "PAYHERE_NOT_CONFIGURED"
    );
  }

  const hash = generatePayHereHash({
    merchantId: config.merchantId,
    orderId,
    amount,
    currency,
    merchantSecret: config.merchantSecret,
  });

  const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:5000";

  const checkoutData = {
    sandbox: true,
    checkoutUrl: config.sandboxUrl,
    merchant_id: config.merchantId,
    return_url: `${baseUrl}/payment-success?order_id=${orderId}`,
    cancel_url: `${baseUrl}/payment-failed?order_id=${orderId}`,
    notify_url: `${apiBaseUrl}/api/payments/payhere/notify`,
    order_id: orderId,
    items: `SkillProof AI Certificate - ${
      certificate.skillId?.title || "Skill Certificate"
    }`,
    amount,
    currency,
    first_name: certificate.studentId?.name || "Student",
    last_name: "",
    email: certificate.studentId?.email || req.user.email,
    phone: "0770000000",
    address: "Colombo",
    city: "Colombo",
    country: "Sri Lanka",
    hash,
  };

  res.status(201).json({
    success: true,
    message: "Payment order created successfully.",
    payment,
    checkoutData,
  });
});

export const handlePayHereNotify = asyncHandler(async (req, res) => {
  const {
    merchant_id,
    order_id,
    payment_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
    method,
  } = req.body;

  const config = getPayHereConfig();

  const localMd5Sig = generateNotifyHash({
    merchantId: merchant_id,
    orderId: order_id,
    payhereAmount: payhere_amount,
    payhereCurrency: payhere_currency,
    statusCode: status_code,
    merchantSecret: config.merchantSecret,
  });

  if (localMd5Sig !== md5sig) {
    throw new ApiError(
      400,
      "Invalid PayHere signature.",
      "INVALID_PAYHERE_SIGNATURE"
    );
  }

  const payment = await Payment.findOne({ orderId: order_id });

  if (!payment) {
    throw new ApiError(404, "Payment not found.", "PAYMENT_NOT_FOUND");
  }

  payment.providerPaymentId = payment_id || "";
  payment.paymentMethod = method || "";
  payment.rawNotifyPayload = req.body;

  if (String(status_code) === "2") {
    payment.status = "PAID";
    payment.paidAt = new Date();
  } else if (String(status_code) === "-2") {
    payment.status = "FAILED";
  } else if (String(status_code) === "0") {
    payment.status = "PENDING";
  } else {
    payment.status = "FAILED";
  }

  await payment.save();

  res.status(200).send("OK");
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({
    studentId: req.user._id,
  })
    .populate("certificateId", "certificateId status issuedAt")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    payments,
  });
});

export const getPaymentByOrderId = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const payment = await Payment.findOne({
    orderId,
    studentId: req.user._id,
  }).populate("certificateId", "certificateId status issuedAt");

  if (!payment) {
    throw new ApiError(404, "Payment not found.", "PAYMENT_NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    payment,
  });
});