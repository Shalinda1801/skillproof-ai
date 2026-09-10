const AnimatedBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#f7f9fc]">
      {/* Main Aurora wash */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_5%_8%,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_92%_10%,rgba(139,92,246,0.12),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(34,184,207,0.09),transparent_34%)]" />

      {/* Animated grid */}
      <div className="hero-grid absolute inset-0 opacity-45" />

      {/* Soft moving aurora blobs */}
      <div className="float-3d absolute left-[-8%] top-[12%] h-[420px] w-[420px] rounded-full bg-blue-400/15 blur-[120px]" />

      <div className="float-3d absolute right-[-8%] top-[16%] h-[440px] w-[440px] rounded-full bg-violet-400/15 blur-[125px]" />

      <div className="float-3d absolute bottom-[2%] left-[34%] h-[420px] w-[420px] rounded-full bg-cyan-300/10 blur-[130px]" />

      {/* Tiny light particles */}
      <div className="absolute left-[15%] top-[27%] h-2 w-2 rounded-full bg-blue-400/70 shadow-[0_0_24px_rgba(59,130,246,0.55)]" />

      <div className="absolute right-[20%] top-[37%] h-2 w-2 rounded-full bg-violet-400/70 shadow-[0_0_24px_rgba(139,92,246,0.5)]" />

      <div className="absolute bottom-[22%] left-[48%] h-2 w-2 rounded-full bg-cyan-400/60 shadow-[0_0_24px_rgba(34,184,207,0.5)]" />

      {/* Light overlay keeps content readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/35" />
    </div>
  );
};

export default AnimatedBackground;