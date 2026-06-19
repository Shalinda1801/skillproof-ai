const SectionBadge = ({ children }) => {
  return (
    <div className="mb-5 inline-flex items-center rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.25em] text-blue-200">
      {children}
    </div>
  );
};

export default SectionBadge;