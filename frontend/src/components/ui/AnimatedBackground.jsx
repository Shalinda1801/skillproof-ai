const AnimatedBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.28),transparent_35%),radial-gradient(circle_at_top_right,rgba(124,58,237,0.25),transparent_35%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.12),transparent_35%)]" />

      <div className="hero-grid absolute inset-0 opacity-50" />

      <div className="float-3d absolute left-[6%] top-[18%] h-72 w-72 rounded-full bg-blue-500/30 blur-[100px]" />
      <div className="float-3d absolute right-[8%] top-[20%] h-80 w-80 rounded-full bg-purple-500/30 blur-[110px]" />
      <div className="float-3d absolute bottom-[8%] left-[38%] h-80 w-80 rounded-full bg-cyan-400/15 blur-[120px]" />

      <div className="absolute left-[15%] top-[30%] h-2 w-2 rounded-full bg-cyan-300/70 shadow-[0_0_25px_rgba(103,232,249,0.9)]" />
      <div className="absolute right-[22%] top-[38%] h-2 w-2 rounded-full bg-purple-300/70 shadow-[0_0_25px_rgba(216,180,254,0.9)]" />
      <div className="absolute bottom-[22%] left-[48%] h-2 w-2 rounded-full bg-blue-300/70 shadow-[0_0_25px_rgba(147,197,253,0.9)]" />
    </div>
  );
};

export default AnimatedBackground;