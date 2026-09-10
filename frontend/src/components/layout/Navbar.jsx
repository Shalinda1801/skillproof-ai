import {
  Award,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/#about" },
  { label: "Services", path: "/#services" },
  { label: "Gallery", path: "/#gallery" },
  { label: "Contact", path: "/#contact" },
  { label: "Pricing", path: "/pricing" },
];

const Navbar = () => {
  const {
    isAuthenticated,
    user,
    logout,
    getDashboardPath,
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="relative overflow-hidden border-b border-indigo-400/20 bg-gradient-to-r from-[#2457F5] via-[#5145E5] to-[#7C3AED] shadow-[0_12px_40px_rgba(79,70,229,0.20)]">
        {/* subtle navbar decoration */}
        <div className="pointer-events-none absolute -left-16 -top-20 h-44 w-44 rounded-full bg-cyan-300/20 blur-[70px]" />

        <div className="pointer-events-none absolute right-[12%] top-[-80px] h-48 w-48 rounded-full bg-fuchsia-300/20 blur-[80px]" />

        <nav className="relative mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3.5 sm:px-6 lg:px-8">
          {/* BRAND */}
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex min-w-0 items-center gap-3"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-xl transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-white/20 sm:h-12 sm:w-12">
              <ShieldCheck
                size={24}
                strokeWidth={2.2}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-lg font-black tracking-[-0.035em] text-white">
                  SkillProof AI
                </p>

                <Sparkles
                  size={14}
                  className="hidden text-cyan-200 sm:block"
                />
              </div>

              <p className="hidden truncate text-[11px] font-medium tracking-wide text-indigo-100 sm:block">
                AI Skill Verification Platform
              </p>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) =>
              item.path.includes("#") ? (
                <a
                  key={item.label}
                  href={item.path}
                  className="rounded-xl px-3.5 py-2.5 text-sm font-bold text-indigo-100 transition duration-200 hover:bg-white/15 hover:text-white"
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      "rounded-xl px-3.5 py-2.5 text-sm font-bold transition duration-200",
                      isActive
                        ? "bg-white/18 text-white shadow-sm"
                        : "text-indigo-100 hover:bg-white/15 hover:text-white",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/verify"
              onClick={closeMenu}
              className="hidden items-center gap-2 rounded-2xl border border-emerald-200/40 bg-emerald-300/15 px-4 py-2.5 text-sm font-black text-emerald-50 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-emerald-300/25 md:inline-flex"
            >
              <Award size={17} />
              Verify
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath(
                    user?.role
                  )}
                  onClick={closeMenu}
                  className="hidden items-center gap-2 rounded-2xl border border-white/20 bg-white/15 px-4 py-2.5 text-sm font-black text-white backdrop-blur-xl transition hover:bg-white/22 md:inline-flex"
                >
                  <LayoutDashboard size={17} />

                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-black text-white transition hover:bg-white/20 xl:inline-flex"
                >
                  <LogOut size={17} />
                  Logout
                </button>

                <Link
                  to={getDashboardPath(
                    user?.role
                  )}
                  className="hidden h-10 min-w-10 items-center justify-center rounded-2xl bg-white px-3 text-sm font-black text-indigo-700 lg:flex"
                >
                  {user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="hidden rounded-2xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-black text-white backdrop-blur-xl transition hover:bg-white/20 sm:inline-flex"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="hidden rounded-2xl bg-white px-5 py-2.5 text-sm font-black text-indigo-700 shadow-[0_12px_28px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-indigo-50 sm:inline-flex"
                >
                  Get Started
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (current) => !current
                )
              }
              className="grid h-11 w-11 place-items-center rounded-2xl border border-white/25 bg-white/10 text-white backdrop-blur-xl lg:hidden"
            >
              {mobileMenuOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* MOBILE */}
      <div
        className={`overflow-hidden border-b border-slate-200 bg-white/98 shadow-xl backdrop-blur-2xl transition-all duration-300 lg:hidden ${
          mobileMenuOpen
            ? "max-h-[700px] opacity-100"
            : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6">
          <div className="grid gap-1.5">
            {navLinks.map((item) =>
              item.path.includes("#") ? (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-black text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {item.label}

                  <ChevronRight
                    size={16}
                    className="text-slate-400"
                  />
                </a>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-black text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {item.label}

                  <ChevronRight
                    size={16}
                    className="text-slate-400"
                  />
                </NavLink>
              )
            )}
          </div>

          <div className="my-4 h-px bg-slate-200" />

          <div className="grid gap-3">
            <Link
              to="/verify"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700"
            >
              <Award size={18} />

              Verify Certificate
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath(
                    user?.role
                  )}
                  onClick={closeMenu}
                  className="primary-btn flex justify-center gap-2"
                >
                  <LayoutDashboard
                    size={18}
                  />

                  Dashboard
                </Link>

                <button
                  onClick={
                    handleLogout
                  }
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-black text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="secondary-btn text-center"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="primary-btn text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;