import nodemailer from "nodemailer";

const isEmailConfigured = () => {
  return (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
};

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendCertificateEmail = async ({
  to,
  studentName,
  certificateId,
  skillTitle,
}) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const certificateUrl = `${clientUrl}/certificate/${certificateId}`;
  const verifyUrl = `${clientUrl}/verify/${certificateId}`;

  if (!to || !certificateId) {
    console.log("Certificate email skipped: missing email or certificate ID.");

    return {
      skipped: true,
      reason: "Missing email or certificate ID",
    };
  }

  const subject = `Your SkillProof AI certificate is ready - ${certificateId}`;

  const html = `
    <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:30px;">
      <div style="max-width:650px; margin:auto; background:white; border-radius:18px; padding:30px; border:1px solid #e2e8f0;">
        <h1 style="margin:0; color:#0f172a;">
          Congratulations ${studentName || "Student"} 🎉
        </h1>

        <p style="font-size:16px; color:#475569; line-height:1.7;">
          Your SkillProof AI digital certificate has been generated successfully.
        </p>

        <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:18px; border-radius:14px; margin:22px 0;">
          <p style="margin:0; color:#334155;">
            <strong>Certificate ID:</strong> ${certificateId}
          </p>
          <p style="margin:8px 0 0; color:#334155;">
            <strong>Skill:</strong> ${skillTitle || "Verified Skill"}
          </p>
        </div>

        <p style="font-size:15px; color:#475569;">
          You can view and download your certificate using the button below.
        </p>

        <p>
          <a href="${certificateUrl}" style="display:inline-block; background:#2563eb; color:white; text-decoration:none; padding:12px 20px; border-radius:12px; font-weight:bold;">
            View Certificate
          </a>
        </p>

        <p style="font-size:15px; color:#475569;">
          Public verification link:
        </p>

        <p>
          <a href="${verifyUrl}" style="color:#2563eb;">${verifyUrl}</a>
        </p>

        <hr style="border:none; border-top:1px solid #e2e8f0; margin:28px 0;" />

        <p style="font-size:13px; color:#64748b;">
          SkillProof AI helps students turn real project work into verified skill credentials.
        </p>
      </div>
    </div>
  `;

  const text = `
Congratulations ${studentName || "Student"}!

Your SkillProof AI digital certificate has been generated successfully.

Certificate ID: ${certificateId}
Skill: ${skillTitle || "Verified Skill"}

View certificate:
${certificateUrl}

Verify publicly:
${verifyUrl}
  `;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || "SkillProof AI"}" <${
      process.env.SMTP_USER || "no-reply@skillproof.ai"
    }>`,
    to,
    subject,
    html,
    text,
  };

  if (!isEmailConfigured()) {
    console.log("Email not sent because SMTP is not configured.");
    console.log("Email preview:", mailOptions);

    return {
      skipped: true,
      reason: "SMTP not configured",
    };
  }

  const transporter = createTransporter();
  const info = await transporter.sendMail(mailOptions);

  return {
    skipped: false,
    messageId: info.messageId,
  };
};