import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Core Pages
import Home from "./pages/Home";
import Candidates from "./pages/Candidates";
import CandidateDetailPage from "./pages/CandidateDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

// New SaaS Support & Legal Pages
import HiringEthics from "./pages/HiringEthics";
import HelpCenter from "./pages/HelpCenter";
import StatusPage from "./pages/StatusPage"; // Dashboard for system health

import { AuthProvider } from "./context/AuthContext";

// Global Components
import Header from "./components/Header";
import Footer from "./components/Footer";

/* ================= SCROLL TO TOP ================= */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

/* ================= APP ENTRY ================= */
function App() {
  useEffect(() => {
    // Persistent Theme Logic
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />

        {/* Main Layout Container:
          - flex flex-col + min-h-screen: Keeps footer at bottom.
          - bg-white dark:bg-slate-950: Root theme colors.
      */}
        <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

          <Header />

          {/* Content Area:
            - max-w-7xl + mx-auto: Standard SaaS content width.
            - pt-20: Provides breathing room below fixed/sticky header.
        */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-12">
            <Routes>
              {/* Core Application Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/candidate/:id" element={<CandidateDetailPage />} />

              {/* SaaS Support & Information Routes (Linked from Footer) */}
              <Route path="/ethics" element={<HiringEthics />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/status" element={<StatusPage />} />

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;