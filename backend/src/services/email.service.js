import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const getEmailConfig = () => {
  return {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    fromName: process.env.EMAIL_FROM_NAME || "SkillProof AI",
    fromAddress:
      process.env.EMAIL_FROM_ADDRESS ||
      process.env.SMTP_USER ||
      "no-reply@skillproof.local",
  };
};

const isSmtpConfigured = () => {
  const config = getEmailConfig();

  return Boolean(
    config.host &&
      config.port &&
      config.user &&
      config.pass &&
      config.fromAddress
  );
};

const createTransporter = () => {
  const config = getEmailConfig();

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

const getApplicationBaseUrl = () => {
  return (
    env.appBaseUrl ||
    process.env.APP_BASE_URL ||
    process.env.CLIENT_URL ||
    "http://localhost:5173"
  );
};

const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const buildCertificateEmailHtml = ({
  studentName,
  certificateId,
  skillTitle,
  verificationUrl,
  certificateUrl,
}) => {
  const safeStudentName = escapeHtml(studentName || "Student");
  const safeCertificateId = escapeHtml(certificateId || "");
  const safeSkillTitle = escapeHtml(skillTitle || "Verified Skill");

  return `
    <div style="font-family:Arial,sans-serif;background:#f4f6fb;padding:32px 16px;">
      <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:18px;padding:32px;border:1px solid #e5e7eb;box-shadow:0 10px 30px rgba(15,23,42,0.08);">

        <div style="display:inline-block;background:#eef2ff;color:#4338ca;padding:8px 14px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.08em;">
          SKILLPROOF AI CERTIFICATE
        </div>

        <h1 style="margin:24px 0 8px;color:#111827;font-size:28px;">
          Congratulations, ${safeStudentName}!
        </h1>

        <p style="font-size:16px;color:#4b5563;line-height:1.7;">
          Your SkillProof AI certificate has been generated successfully.
        </p>

        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:18px;margin:24px 0;">
          <p style="margin:0 0 10px;color:#111827;">
            <strong>Skill:</strong> ${safeSkillTitle}
          </p>

          <p style="margin:0;color:#111827;">
            <strong>Certificate ID:</strong> ${safeCertificateId}
          </p>
        </div>

        <p style="font-size:15px;color:#4b5563;line-height:1.7;">
          Open your certificate using the button below. The public verification
          link can be shared with employers or other credential verifiers.
        </p>

        <div style="margin-top:24px;">
          <a
            href="${certificateUrl}"
            style="display:inline-block;background:linear-gradient(90deg,#2563eb,#7c3aed);color:#ffffff;padding:13px 20px;border-radius:10px;text-decoration:none;font-weight:700;"
          >
            View Certificate
          </a>
        </div>

        <p style="margin-top:22px;">
          <a
            href="${verificationUrl}"
            style="color:#2563eb;font-weight:700;text-decoration:none;"
          >
            Open Public Verification Page
          </a>
        </p>

        <p style="font-size:13px;color:#6b7280;margin-top:32px;line-height:1.6;">
          This certificate is publicly verifiable through SkillProof AI.
        </p>
      </div>
    </div>
  `;
};

const buildSubmissionDecisionEmailHtml = ({
  studentName,
  challengeTitle,
  skillTitle,
  status,
  reviewNote,
  dashboardUrl,
}) => {
  const isApproved = status === "APPROVED";

  const safeStudentName = escapeHtml(studentName || "Student");
  const safeChallengeTitle = escapeHtml(
    challengeTitle || "SkillProof Challenge"
  );
  const safeSkillTitle = escapeHtml(skillTitle || "Skill Path");
  const safeReviewNote = escapeHtml(
    reviewNote ||
      (isApproved
        ? "Your project evidence met the verification requirements."
        : "Please review your project and submit an improved version.")
  );

  const statusLabel = isApproved ? "APPROVED" : "REJECTED";
  const statusColor = isApproved ? "#059669" : "#dc2626";
  const statusBackground = isApproved ? "#ecfdf5" : "#fef2f2";
  const statusBorder = isApproved ? "#a7f3d0" : "#fecaca";

  const heading = isApproved
    ? "Your submission was approved"
    : "Your submission needs improvement";

  const description = isApproved
    ? "Your project evidence has passed the verifier review. Your certificate can now be prepared by the SkillProof verifier."
    : "The verifier could not approve the current submission. Review the feedback below before improving your project.";

  return `
    <div style="font-family:Arial,sans-serif;background:#f4f6fb;padding:32px 16px;">
      <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:18px;padding:32px;border:1px solid #e5e7eb;box-shadow:0 10px 30px rgba(15,23,42,0.08);">

        <div style="display:inline-block;background:#eef2ff;color:#4338ca;padding:8px 14px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.08em;">
          SUBMISSION REVIEW
        </div>

        <h1 style="margin:24px 0 8px;color:#111827;font-size:28px;">
          ${heading}
        </h1>

        <p style="font-size:16px;color:#4b5563;line-height:1.7;">
          Hello ${safeStudentName}, ${description}
        </p>

        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:18px;margin:24px 0;">
          <p style="margin:0 0 10px;color:#111827;">
            <strong>Challenge:</strong> ${safeChallengeTitle}
          </p>

          <p style="margin:0 0 10px;color:#111827;">
            <strong>Skill:</strong> ${safeSkillTitle}
          </p>

          <p style="margin:0;color:#111827;">
            <strong>Decision:</strong>
            <span style="display:inline-block;margin-left:6px;padding:5px 10px;border-radius:999px;background:${statusBackground};border:1px solid ${statusBorder};color:${statusColor};font-size:12px;font-weight:700;">
              ${statusLabel}
            </span>
          </p>
        </div>

        <div style="background:${statusBackground};border:1px solid ${statusBorder};border-radius:14px;padding:18px;margin:24px 0;">
          <p style="margin:0 0 8px;color:#111827;font-weight:700;">
            Verifier feedback
          </p>

          <p style="margin:0;color:#4b5563;line-height:1.7;white-space:pre-line;">
            ${safeReviewNote}
          </p>
        </div>

        ${
          isApproved
            ? `
              <p style="font-size:15px;color:#4b5563;line-height:1.7;">
                You will receive another email after your certificate has been generated.
              </p>
            `
            : `
              <p style="font-size:15px;color:#4b5563;line-height:1.7;">
                Use the verifier feedback to improve the project. Contact the
                platform administrator if you need the challenge reopened for a
                new submission.
              </p>
            `
        }

        <div style="margin-top:24px;">
          <a
            href="${dashboardUrl}"
            style="display:inline-block;background:linear-gradient(90deg,#2563eb,#7c3aed);color:#ffffff;padding:13px 20px;border-radius:10px;text-decoration:none;font-weight:700;"
          >
            Open Student Dashboard
          </a>
        </div>

        <p style="font-size:13px;color:#6b7280;margin-top:32px;line-height:1.6;">
          This notification was sent automatically by SkillProof AI.
        </p>
      </div>
    </div>
  `;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!to) {
    return {
      skipped: true,
      reason: "Recipient email is missing",
    };
  }

  if (!isSmtpConfigured()) {
    console.log("Email not sent because SMTP is not configured.");

    console.log("Email preview:", {
      to,
      subject,
      text,
    });

    return {
      skipped: true,
      reason: "SMTP is not configured",
      preview: {
        to,
        subject,
        text,
      },
    };
  }

  const config = getEmailConfig();
  const transporter = createTransporter();

  const result = await transporter.sendMail({
    from: `"${config.fromName}" <${config.fromAddress}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("Email sent successfully:", result.messageId);

  return {
    skipped: false,
    messageId: result.messageId,
  };
};

export const verifyEmailConnection = async () => {
  if (!isSmtpConfigured()) {
    return {
      success: false,
      message: "SMTP is not configured.",
    };
  }

  const transporter = createTransporter();

  await transporter.verify();

  return {
    success: true,
    message: "SMTP connection verified successfully.",
  };
};

export const sendCertificateEmail = async ({
  to,
  studentName,
  certificateId,
  skillTitle,
}) => {
  if (!to) {
    return {
      skipped: true,
      reason: "Recipient email is missing",
    };
  }

  const baseUrl = getApplicationBaseUrl();

  const certificateUrl = `${baseUrl}/certificate/${certificateId}`;
  const verificationUrl = `${baseUrl}/verify/${certificateId}`;

  const subject = `Your SkillProof AI Certificate is Ready - ${
    skillTitle || "Verified Skill"
  }`;

  const text = `
Congratulations ${studentName || "Student"}!

Your SkillProof AI certificate has been generated successfully.

Skill: ${skillTitle || "Verified Skill"}
Certificate ID: ${certificateId}

View Certificate:
${certificateUrl}

Public Verification:
${verificationUrl}
  `.trim();

  const html = buildCertificateEmailHtml({
    studentName,
    certificateId,
    skillTitle,
    verificationUrl,
    certificateUrl,
  });

  return sendEmail({
    to,
    subject,
    text,
    html,
  });
};

export const sendSubmissionDecisionEmail = async ({
  to,
  studentName,
  challengeTitle,
  skillTitle,
  status,
  reviewNote,
}) => {
  if (!to) {
    return {
      skipped: true,
      reason: "Recipient email is missing",
    };
  }

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return {
      skipped: true,
      reason: "Submission status does not require a decision email",
    };
  }

  const baseUrl = getApplicationBaseUrl();
  const dashboardUrl = `${baseUrl}/student/dashboard`;

  const isApproved = status === "APPROVED";

  const subject = isApproved
    ? `Submission Approved - ${challengeTitle || "SkillProof Challenge"}`
    : `Submission Review Result - ${challengeTitle || "SkillProof Challenge"}`;

  const defaultReviewNote = isApproved
    ? "Your project evidence met the verification requirements."
    : "Please review the project requirements and improve your submission.";

  const finalReviewNote = reviewNote || defaultReviewNote;

  const text = `
Hello ${studentName || "Student"},

Your SkillProof AI submission review has been completed.

Challenge: ${challengeTitle || "SkillProof Challenge"}
Skill: ${skillTitle || "Skill Path"}
Decision: ${status}

Verifier feedback:
${finalReviewNote}

${
  isApproved
    ? "Your certificate can now be prepared by the verifier. You will receive another email when it is ready."
    : "Please use the verifier feedback to improve your project."
}

Student Dashboard:
${dashboardUrl}
  `.trim();

  const html = buildSubmissionDecisionEmailHtml({
    studentName,
    challengeTitle,
    skillTitle,
    status,
    reviewNote: finalReviewNote,
    dashboardUrl,
  });

  return sendEmail({
    to,
    subject,
    text,
    html,
  });
};