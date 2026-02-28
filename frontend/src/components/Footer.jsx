import React, { useEffect, useState } from "react";


const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [dbStats, setDbStats] = useState({ totalResumes: "...", apiStatus: "operational" });

  // SaaS Feature: Fetch real-time DB stats to replace static mock data
  useEffect(() => {
    const fetchFooterStats = async () => {
      try {
        // Alignment: This would hit a custom stats endpoint in your ResumeController
        // const res = await axios.get("http://localhost:8080/api/resume/stats/summary");
        // setDbStats({ totalResumes: res.data.totalAnalyzed, apiStatus: "operational" });
      } catch (err) {
        setDbStats((prev) => ({ ...prev, apiStatus: "degraded" }));
      }
    };
    fetchFooterStats();
  }, []);

  const navigation = {
    product: [
      { name: "Weighted Scoring", href: "#features" },
      { name: "Skill Match Engine", href: "#scoring" },
      { name: "Bulk PDF Upload", href: "#upload" },
      { name: "Developer API", href: "/docs" }
    ],
    company: [
      { name: "Hiring Ethics", href: "/ethics" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Security Audit", href: "/security" }
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Scoring FAQ", href: "/faq" },
      { name: "System Status", href: "https://status.resumetric.ai" }
    ]
  };

  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">

        {/* ===== TOP: Brand + Newsletter ===== */}
        <div className="grid lg:grid-cols-2 gap-14">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-500/20">
                AI
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                ResuMetric
              </span>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
              Empowering recruiting teams with <strong>Weighted AI Scoring</strong> and automated
              candidate ranking based on custom skill-fit logic.
            </p>

            <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
              {["Twitter", "LinkedIn", "GitHub"].map((platform) => (
                <a
                  key={platform}
                  href={`#${platform.toLowerCase()}`}
                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-6 shadow-inner">
              <h4 className="text-slate-900 dark:text-white font-bold mb-2">
                Join the AI Hiring Revolution
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-snug">
                Get product updates and hiring engineering insights delivered monthly.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="recruiter@company.com"
                  className="flex-1 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <button className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-sm font-bold transition shadow-lg shadow-indigo-500/20 active:scale-95">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== MIDDLE: Column Links ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-slate-200 dark:border-white/10">
          <FooterColumn title="The Platform" items={navigation.product} />
          <FooterColumn title="Legal & Trust" items={navigation.company} />
          <FooterColumn title="Resources" items={navigation.support} />

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
              Real-Time Metrics
            </h4>
            <div className="space-y-6">
              <Metric value={dbStats.totalResumes} label="Candidates Screened" />
              <Metric value="99.9%" label="Service Uptime" />
            </div>
          </div>
        </div>

        {/* ===== BOTTOM: Status & Copyright ===== */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            © {currentYear} ResuMetric AI. Engineered for better hiring.
          </p>

          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${dbStats.apiStatus === "operational"
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-amber-500/10 border-amber-500/20"
            }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${dbStats.apiStatus === "operational" ? "bg-emerald-500" : "bg-amber-500"
              }`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${dbStats.apiStatus === "operational" ? "text-emerald-600" : "text-amber-600"
              }`}>
              {dbStats.apiStatus === "operational" ? "All Systems Operational" : "Service Interruption"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

/* ================= SUB COMPONENTS ================= */

const FooterColumn = ({ title, items }) => (
  <div>
    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
      {title}
    </h4>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.name}>
          <a
            href={item.href}
            className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Metric = ({ value, label }) => (
  <div className="group cursor-default">
    <div className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
      {value}
    </div>
    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
      {label}
    </div>
  </div>
);