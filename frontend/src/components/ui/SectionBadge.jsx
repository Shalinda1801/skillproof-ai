import { Sparkles } from "lucide-react";

const SectionBadge = ({ children }) => {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-indigo-700 shadow-[0_8px_24px_rgba(79,70,229,0.06)]">
      <Sparkles size={14} className="text-violet-500" />
      {children}
    </div>
  );
};

export default SectionBadge;