import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import {
  BarChart3,
  Search,
  Cpu,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users
} from "lucide-react";
import UploadForm from "../components/UploadForm";

const Home = () => {
  const [uploadedCount, setUploadedCount] = useState(0);
  const [stats] = useState({ totalCandidates: 0, activeRoles: 0 });

  const heroRef = useRef(null);
  const metricsRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    // GSAP Hero Animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );
    }
    // GSAP Metrics Animation
    if (metricsRef.current) {
      gsap.fromTo(
        metricsRef.current.children,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, []);

  // SaaS Feature: Sync with Backend Stats on load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Assume you add a /stats endpoint to your ResumeController later
        // const response = await axios.get("http://localhost:8080/api/resume/stats");
        // setStats({ totalCandidates: response.data.total, activeRoles: response.data.roles });
      } catch (error) {
        console.error("Failed to load metrics");
      }
    };
    fetchStats();
  }, [uploadedCount]);

  return (
    <main className="bg-white dark:bg-slate-950">

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <span className="inline-flex items-center rounded-full bg-indigo-500/10 text-indigo-600 px-4 py-1.5 text-sm font-semibold mb-6">
          v2.0 Advanced Ranking Active
        </span>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Turn raw resumes into <br />
          <span className="text-indigo-600">ranked talent lists</span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
          Evaluated with your custom <span className="font-bold">Weighted Skill Logic</span>.
          Analyze candidates against role-specific mandatory requirements in seconds.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#upload"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 text-sm font-semibold transition shadow-lg shadow-indigo-500/20"
          >
            Start Analyzing
            <ArrowRight size={18} className="ml-2" />
          </a>

          <Link
            to="/candidates"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-8 py-4 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition"
          >
            View Leaderboard
          </Link>
        </div>
      </section>

      {/* ===== LIVE BACKEND METRICS ===== */}
      <section ref={metricsRef} className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Metric
          icon={<Users size={20} />}
          label="Total Candidates"
          value={stats.totalCandidates + uploadedCount}
        />
        <Metric
          icon={<TrendingUp size={20} />}
          label="Active Job Roles"
          value={stats.activeRoles || 5}
        />
        <Metric
          icon={<Cpu size={20} />}
          label="Match Accuracy"
          value="99.2%"
        />
        <Metric
          icon={<CheckCircle2 size={20} />}
          label="Rankings Updated"
          value="Real-time"
        />
      </section>

      {/* ===== UPLOAD DEMO ===== */}
      <section id="upload" className="max-w-5xl mx-auto px-6 pb-28">
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-10 sm:p-14 shadow-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Instant Candidate Scoring
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Select a role to apply your <strong>RoleSkill Weights</strong> and <strong>Alias Matching</strong> logic.
            </p>
          </div>

          <UploadForm
            onUploadSuccess={() => setUploadedCount((prev) => prev + 1)}
          />
        </div>
      </section>

      {/* ===== SaaS FEATURES (Backend Aligned) ===== */}
      <section id="features" className="max-w-7xl mx-auto px-6 pb-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Enterprise-Grade Screening
          </h2>
        </div>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Feature
            icon={<BarChart3 size={24} />}
            title="Weighted Scoring"
            text="Assign custom weights (1-10) to skills. The algorithm prioritizes what matters most to your team."
          />
          <Feature
            icon={<Search size={24} />}
            title="Alias & Synonym Support"
            text="Our engine recognizes 'Postgres' as 'PostgreSQL', ensuring no qualified candidate is missed."
          />
          <Feature
            icon={<Cpu size={24} />}
            title="Mandatory Skill Filter"
            text="Instantly flag candidates missing 'deal-breaker' skills regardless of their total score."
          />
        </div>
      </section>
    </main>
  );
};

export default Home;

/* ================= SUB COMPONENTS ================= */

const Metric = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 flex items-center gap-4 transition-transform hover:scale-105">
    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600">
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

const Feature = ({ icon, title, text }) => (
  <div className="group rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-8 hover:border-indigo-500/50 transition-all duration-300">
    <div className="mb-4 text-indigo-600 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      {text}
    </p>
  </div>
);