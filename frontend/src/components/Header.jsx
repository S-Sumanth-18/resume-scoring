import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Zap, LogOut } from "lucide-react";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Sync theme with localStorage for persistence
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setDark(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ===== Brand: AI-Powered Styling ===== */}
        <Link
          to="/"
          className="flex items-center gap-3 group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-500/20 group-hover:rotate-3 transition-transform">
            AI
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            ResuMetric
          </span>
        </Link>

        {/* ===== Navigation & Utils ===== */}
        <nav className="flex items-center gap-2 md:gap-8">
          <div className="hidden md:flex items-center gap-6 mr-4 border-r border-slate-200 dark:border-white/10 pr-8">
            <NavLinkItem
              to="/"
              active={location.pathname === "/"}
              label="Home"
            />
            {user && (
              <NavLinkItem
                to="/candidates"
                active={location.pathname.startsWith("/candidate")}
                label="DashBoard"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle: SaaS Polish */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 hover:bg-white dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-all"
              aria-label="Toggle theme"
            >
              {dark ? (
                <Sun size={18} className="animate-in spin-in-180 duration-500" />
              ) : (
                <Moon size={18} className="animate-in spin-in-180 duration-500" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-4 ml-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:block">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-5 py-2.5 text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                  <Zap size={14} fill="currentColor" />
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

/* ================= SUB COMPONENT ================= */

const NavLinkItem = ({ to, label, active }) => (
  <Link
    to={to}
    className={`group relative text-xs font-black uppercase tracking-widest transition-colors py-1
      ${active
        ? "text-indigo-600 dark:text-indigo-400"
        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
      }`}
  >
    {label}
    <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-300
      ${active ? "w-full" : "w-0 group-hover:w-full opacity-50"}`}
    />
  </Link>
);

export default Header;