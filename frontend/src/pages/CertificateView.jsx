import {
  ArrowLeft,
  Award,
  Calendar,
  Download,
  Printer,
  ShieldCheck,
  User,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Link, useParams } from "react-router-dom";
import { certificateApi } from "../api/certificateApi";
import AnimatedBackground from "../components/ui/AnimatedBackground";

const CertificateView = () => {
  const { certificateId } = useParams();
  const certificateRef = useRef(null);
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCertificate = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await certificateApi.verifyCertificate(certificateId);
        setCertificateData(response);
      } catch (err) {
        setError(err.message || "Failed to load certificate.");
      } finally {
        setLoading(false);
      }
    };

    loadCertificate();
  }, [certificateId]);

  const certificate = certificateData?.certificate;
  const clientUrl =
  import.meta.env.VITE_CLIENT_URL || window.location.origin;

const verifyUrl = `${clientUrl}/verify/${certificateId}`;

  const handlePrint = () => {
  window.print();
};

const handleDownloadPdf = async () => {
  const certificateElement = certificateRef.current;

  if (!certificateElement) return;

  const canvas = await html2canvas(certificateElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#fffaf0",
  });

  const imageData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imageWidth = pageWidth;
  const imageHeight = (canvas.height * imageWidth) / canvas.width;

  const yPosition = imageHeight < pageHeight ? (pageHeight - imageHeight) / 2 : 0;

  pdf.addImage(imageData, "PNG", 0, yPosition, imageWidth, imageHeight);
  pdf.save(`${certificate.certificateId}.pdf`);
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
            <Link to="/verify" className="primary-btn mt-6 inline-flex">
              Verify Another Certificate
            </Link>
          </div>
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
                onClick={handlePrint}
                className="secondary-btn inline-flex items-center gap-2"
              >
                <Printer size={18} />
                Print
              </button>

    <button
  onClick={handleDownloadPdf}
  className="primary-btn inline-flex items-center gap-2"
>
  <Download size={18} />
  Download PDF
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