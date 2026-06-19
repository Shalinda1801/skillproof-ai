import { Award, LogOut, ShieldCheck } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/#about" },
  { label: "Services", path: "/#services" },
  { label: "Gallery", path: "/#gallery" },
  { label: "Contact", path: "/#contact" },
  { label: "Pricing", path: "/pricing" },
];

const Navbar = () => {
  const { isAuthenticated, user, logout, getDashboardPath } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/70 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-600/25">
            <ShieldCheck size={25} />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight">SkillProof AI</p>
            <p className="text-xs text-slate-400">
              AI Skill Verification Platform
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((item) =>
            item.path.includes("#") ? (
              <a
                key={item.label}
                href={item.path}
                className="text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.label}
                to={item.path}
                className="text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                {item.label}
              </NavLink>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/verify"
            className="hidden rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-200 transition hover:bg-emerald-400/15 md:inline-flex"
          >
            <Award size={17} className="mr-2" />
            Verify
          </Link>

          {isAuthenticated ? (
            <>
              <Link to={getDashboardPath(user?.role)} className="secondary-btn">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="hidden rounded-2xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800 md:inline-flex"
              >
                <LogOut size={17} className="mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="secondary-btn">
                Login
              </Link>
              <Link to="/register" className="primary-btn">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;