import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Calendar,
  CreditCard,
  Download,
  ShieldCheck,
  User,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { Link, useParams } from "react-router-dom";
import { certificateApi } from "../api/certificateApi";
import { paymentApi } from "../api/paymentApi";
import AnimatedBackground from "../components/ui/AnimatedBackground";

const CertificateView = () => {
  const { certificateId } = useParams();
  const certificateRef = useRef(null);

  const [downloading, setDownloading] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [certificateObjectId, setCertificateObjectId] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCertificate = async () => {
      try {
        setLoading(true);
        setError("");

        const [certificateResponse, myCertificatesResponse, paymentsResponse] =
          await Promise.all([
            certificateApi.verifyCertificate(certificateId),
            certificateApi.getMyCertificates(),
            paymentApi.getMyPayments(),
          ]);

        const myCertificates = myCertificatesResponse.certificates || [];
        const payments = paymentsResponse.payments || [];

        const matchingCertificate = myCertificates.find(
          (item) => item.certificateId === certificateId
        );

        const matchingPayment = payments.find((payment) => {
          const paymentCertificateId =
            payment.certificateId?._id || payment.certificateId;

          return (
            payment.certificatePublicId === certificateId ||
            paymentCertificateId === matchingCertificate?._id
          );
        });

        setCertificateData(certificateResponse);
        setCertificateObjectId(matchingCertificate?._id || "");
        setIsPaid(matchingPayment?.status === "PAID");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load certificate."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCertificate();
  }, [certificateId]);

  const certificate = certificateData?.certificate;
  const clientUrl = import.meta.env.VITE_CLIENT_URL || window.location.origin;
  const verifyUrl = `${clientUrl}/verify/${certificateId}`;

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);

      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 300,
        margin: 2,
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 297;
      const pageHeight = 210;

      pdf.setFillColor(255, 250, 240);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      pdf.setDrawColor(37, 99, 235);
      pdf.setLineWidth(1.4);
      pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);

      pdf.setDrawColor(124, 58, 237);
      pdf.setLineWidth(0.6);
      pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(15, 23, 42);
      pdf.text("SkillProof AI", 22, 25);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(71, 85, 105);
      pdf.text("Verified Digital Credential", 22, 32);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(5, 150, 105);
      pdf.text("VERIFIED CERTIFICATE", 230, 25);

      pdf.setFontSize(8);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`ID: ${certificate.certificateId}`, 230, 32);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(30, 64, 175);
      pdf.text("CERTIFICATE OF ACHIEVEMENT", pageWidth / 2, 52, {
        align: "center",
      });

      pdf.setFont("times", "bold");
      pdf.setFontSize(34);
      pdf.setTextColor(15, 23, 42);
      pdf.text(certificate.student?.name || "Student Name", pageWidth / 2, 75, {
        align: "center",
      });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(71, 85, 105);
      pdf.text(
        "This certificate is proudly presented for successfully demonstrating practical project skills",
        pageWidth / 2,
        92,
        { align: "center" }
      );
      pdf.text(
        "and completing the verification process for",
        pageWidth / 2,
        100,
        { align: "center" }
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.setTextColor(30, 64, 175);
      pdf.text(
        certificate.skill?.title || "Skill Certificate",
        pageWidth / 2,
        118,
        { align: "center" }
      );

      pdf.setDrawColor(203, 213, 225);
      pdf.setFillColor(255, 255, 255);

      const boxY = 132;
      const boxW = 58;
      const boxH = 24;
      const gap = 8;
      const startX = 24;

      const infoBoxes = [
        ["STUDENT EMAIL", certificate.student?.email || "N/A"],
        ["SKILL LEVEL", certificate.assessment?.skillLevel || "Verified"],
        ["SCORE", `${certificate.assessment?.score || 0}%`],
        [
          "ISSUED DATE",
          certificate.issuedAt
            ? new Date(certificate.issuedAt).toLocaleDateString()
            : "N/A",
        ],
      ];

      infoBoxes.forEach((box, index) => {
        const x = startX + index * (boxW + gap);
        pdf.roundedRect(x, boxY, boxW, boxH, 3, 3, "FD");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(7);
        pdf.setTextColor(100, 116, 139);
        pdf.text(box[0], x + 4, boxY + 8);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(15, 23, 42);

        const valueLines = pdf.splitTextToSize(box[1], boxW - 8);
        pdf.text(valueLines, x + 4, boxY + 16);
      });

      pdf.roundedRect(24, 168, 190, 18, 3, 3, "FD");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.setTextColor(100, 116, 139);
      pdf.text("PUBLIC VERIFICATION LINK", 30, 176);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(30, 64, 175);
      pdf.text(verifyUrl, 30, 182);

      pdf.addImage(qrDataUrl, "PNG", 232, 145, 38, 38);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.setTextColor(71, 85, 105);
      pdf.text("SCAN TO VERIFY", 251, 190, { align: "center" });

      pdf.setDrawColor(100, 116, 139);
      pdf.line(35, 198, 95, 198);
      pdf.line(120, 198, 190, 198);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(71, 85, 105);
      pdf.text("SkillProof AI Verifier", 35, 204);
      pdf.text("Digital Credential Authority", 120, 204);

      pdf.save(`${certificate.certificateId}.pdf`);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("PDF download failed. Check browser console.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <>
        <AnimatedBackground />
        <main className="relative z-10 grid min-h-screen place-items-center px-6 text-slate-100">
          <p className="text-slate-300">Loading certificate...</p>
        </main>
      </>
    );
  }

  if (error || !certificate) {
    return (
      <>
        <AnimatedBackground />
        <main className="relative z-10 grid min-h-screen place-items-center px-6 text-slate-100">
          <div className="glass-card rounded-[2rem] p-8 text-center">
            <h1 className="text-3xl font-black">Certificate not found</h1>
            <p className="mt-3 text-slate-400">
              {error || "This certificate could not be loaded."}
            </p>
            <Link to="/student/dashboard" className="primary-btn mt-6 inline-flex">
              Back to Dashboard
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (!isPaid) {
    return (
      <>
        <AnimatedBackground />
        <main className="relative z-10 grid min-h-screen place-items-center px-6 py-10 text-slate-100">
          <section className="glass-card pro-card max-w-2xl rounded-[2rem] p-8 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-amber-400/10 text-amber-200">
              <AlertTriangle size={42} />
            </div>

            <h1 className="mt-6 text-4xl font-black">Payment Required</h1>

            <p className="mt-4 leading-7 text-slate-400">
              This certificate has been approved, but certificate view and PDF
              download are locked until the certificate payment is completed.
            </p>

            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/60 p-5 text-left">
              <p className="text-sm text-slate-400">Certificate ID</p>
              <p className="mt-1 font-black">{certificate.certificateId}</p>

              <p className="mt-4 text-sm text-slate-400">Skill</p>
              <p className="mt-1 font-black">
                {certificate.skill?.title || "Skill Certificate"}
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {certificateObjectId ? (
                <Link
                  to={`/checkout/${certificateObjectId}`}
                  className="primary-btn inline-flex justify-center gap-2"
                >
                  <CreditCard size={18} />
                  Pay Certificate Fee
                </Link>
              ) : (
                <Link
                  to="/student/dashboard"
                  className="primary-btn inline-flex justify-center"
                >
                  Go to Dashboard
                </Link>
              )}

              <Link
                to="/student/dashboard"
                className="secondary-btn inline-flex justify-center gap-2"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  const issuedDate = certificate.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString()
    : "N/A";

  return (
    <>
      <AnimatedBackground />

      <main className="relative z-10 min-h-screen px-6 py-8 text-slate-100">
        <div className="mx-auto max-w-7xl">
          <div className="no-print mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              to="/student/dashboard"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white"
            >
              <ArrowLeft size={17} />
              Back to dashboard
            </Link>

            <div className="flex gap-3">
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="primary-btn inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={18} />
                {downloading ? "Preparing PDF..." : "Download PDF"}
              </button>
            </div>
          </div>

          <section
            ref={certificateRef}
            id="certificate-print-area"
            className="certificate-paper mx-auto bg-[#fffaf0] text-slate-950"
          >
            <div className="certificate-border">
              <div className="certificate-inner-border">
                <div className="relative z-10 flex items-start justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-700 text-white">
                      <ShieldCheck size={34} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-black tracking-tight">
                        SkillProof AI
                      </h2>
                      <p className="text-sm font-semibold text-slate-500">
                        Verified Digital Credential
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">
                      Verified Certificate
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-500">
                      ID: {certificate.certificateId}
                    </p>
                  </div>
                </div>

                <div className="mt-10 text-center">
                  <p className="text-sm font-black uppercase tracking-[0.55em] text-blue-800">
                    Certificate of Achievement
                  </p>

                  <h1 className="mt-7 font-serif text-6xl font-black tracking-tight text-slate-950">
                    {certificate.student?.name || "Student Name"}
                  </h1>

                  <div className="mx-auto mt-5 h-1 w-40 rounded-full bg-gradient-to-r from-blue-700 via-purple-600 to-cyan-500" />

                  <p className="mx-auto mt-7 max-w-4xl text-lg leading-8 text-slate-600">
                    This certificate is proudly presented for successfully
                    demonstrating practical project skills and completing the
                    verification process for
                  </p>

                  <h2 className="mt-6 text-4xl font-black text-blue-800">
                    {certificate.skill?.title || "Skill Certificate"}
                  </h2>
                </div>

                <div className="mt-10 grid gap-5 md:grid-cols-4">
                  <div className="certificate-info-box">
                    <User className="mb-3 text-blue-700" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                      Student Email
                    </p>
                    <p className="mt-2 break-all font-black">
                      {certificate.student?.email || "N/A"}
                    </p>
                  </div>

                  <div className="certificate-info-box">
                    <Award className="mb-3 text-purple-700" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                      Skill Level
                    </p>
                    <p className="mt-2 font-black">
                      {certificate.assessment?.skillLevel || "Verified"}
                    </p>
                  </div>

                  <div className="certificate-info-box">
                    <ShieldCheck className="mb-3 text-emerald-700" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                      Score
                    </p>
                    <p className="mt-2 text-2xl font-black text-blue-800">
                      {certificate.assessment?.score || 0}%
                    </p>
                  </div>

                  <div className="certificate-info-box">
                    <Calendar className="mb-3 text-cyan-700" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                      Issued Date
                    </p>
                    <p className="mt-2 font-black">{issuedDate}</p>
                  </div>
                </div>

                <div className="mt-10 grid gap-8 md:grid-cols-[1fr_220px] md:items-end">
                  <div>
                    <div className="rounded-3xl border border-slate-300 bg-white/70 p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        Public Verification Link
                      </p>
                      <p className="mt-3 break-all text-sm font-semibold text-blue-800">
                        {verifyUrl}
                      </p>
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-10">
                      <div>
                        <div className="h-px bg-slate-400" />
                        <p className="mt-3 text-sm font-bold text-slate-700">
                          SkillProof AI Verifier
                        </p>
                      </div>

                      <div>
                        <div className="h-px bg-slate-400" />
                        <p className="mt-3 text-sm font-bold text-slate-700">
                          Digital Credential Authority
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-300 bg-white p-5 text-center shadow-lg">
                    <QRCodeSVG
                      value={verifyUrl}
                      size={150}
                      level="H"
                      includeMargin
                    />

                    <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                      Scan to Verify
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-slate-300 pt-5 text-xs font-semibold text-slate-500">
                  <p>
                    This certificate can be verified online using the QR code or
                    certificate ID.
                  </p>
                  <p>{certificate.certificateId}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default CertificateView;