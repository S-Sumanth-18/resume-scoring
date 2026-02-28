import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
  Mail,
  Briefcase,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
  Cpu,
  ArrowLeft,
  Copy,
  TrendingUp,
  Award
} from "lucide-react";
import {
  getCandidateById,
  deleteCandidate,
  updateCandidateStatus
} from "../services/api";

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    if (!loading && candidate && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading, candidate]);

  /* ================= LOAD ================= */
  const loadCandidate = useCallback(async () => {
    try {
      const data = await getCandidateById(id);
      setCandidate(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCandidate();
  }, [loadCandidate]);

  /* ================= ACTIONS ================= */
  async function handleStatus(status) {
    if (candidate.status === status) return;
    try {
      setUpdating(true);
      const updated = await updateCandidateStatus(id, status);
      setCandidate(updated);
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("This action is permanent. Delete candidate?")) return;
    await deleteCandidate(id);
    navigate("/candidates");
  }

  function copyEmail() {
    navigator.clipboard.writeText(candidate.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-sm text-slate-500 animate-pulse">
        <Cpu className="mb-4 animate-spin text-indigo-500" size={32} />
        Analyzing Candidate Data...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-sm text-slate-500">
        <XCircle className="mb-4 text-red-500" size={32} />
        Candidate not found.
      </div>
    );
  }

  const { strengths, weaknesses, recommendations } = parseSkills(candidate.feedback);
  const initials = candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const score = candidate.totalScore || 0;

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* ===== NAVIGATION & ACTION BAR ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={() => navigate("/candidates")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={16} /> Back to Pipeline
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-xl border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition"
            title="Delete Candidate"
          >
            <Trash2 size={18} />
          </button>

          <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-2" />

          <StatusButton
            active={candidate.status === "SHORTLISTED"}
            loading={updating}
            onClick={() => handleStatus("SHORTLISTED")}
            variant="success"
            icon={<CheckCircle size={16} />}
            label="Shortlist"
          />
          <StatusButton
            active={candidate.status === "REJECTED"}
            loading={updating}
            onClick={() => handleStatus("REJECTED")}
            variant="danger"
            icon={<XCircle size={16} />}
            label="Reject"
          />
        </div>
      </div>

      {/* ===== HEADER CARD ===== */}
      <header className="glass-panel rounded-3xl p-8 flex flex-col lg:flex-row gap-10 items-center">
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-4xl font-black shadow-xl shadow-indigo-500/20">
            {initials}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 p-1.5 rounded-lg border dark:border-white/10 shadow-lg">
            <Award className="text-amber-500" size={20} />
          </div>
        </div>

        <div className="flex-1 text-center lg:text-left space-y-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">{candidate.name}</h1>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Mail size={14} /> {candidate.email}</span>
            <span className="flex items-center gap-1.5"><Briefcase size={14} /> {candidate.jobRole?.roleName}</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 font-bold text-xs">
              {candidate.experienceLevel}
            </span>
          </div>
        </div>

        {/* Dynamic Scoring Ring */}
        <div className="flex items-center gap-8 lg:border-l lg:pl-10 border-slate-200 dark:border-white/10">
          <div className="text-center">
            <div className="relative w-24 h-24 mb-2">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-100 dark:text-white/5" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={`${score * 2.51} 999`} className={`${scoreRing(score)} transition-all duration-1000 ease-out`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{score}%</span>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Match Score</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 flex flex-col items-center justify-center bg-indigo-500/5">
              <TrendingUp size={20} className="text-indigo-600 mb-1" />
              <span className="text-xl font-black text-indigo-600">#{candidate.rankInRole}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mt-2">Current Rank</p>
          </div>
        </div>
      </header>

      {/* ===== AI INSIGHTS GRID ===== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InsightCard title="Candidate Strengths" items={strengths} variant="success" icon={<CheckCircle size={18} />} />
        <InsightCard title="Areas for Growth" items={weaknesses} variant="warning" icon={<XCircle size={18} />} />
        <InsightCard title="AI Recommendations" items={recommendations} variant="info" icon={<Cpu size={18} />} />
      </section>

      {/* ===== RESUME PREVIEW ===== */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-950 p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold flex items-center gap-2">
            <FileText size={20} className="text-indigo-500" />
            Extracted Resume Profile
          </h3>
          <button onClick={copyEmail} className="text-xs text-slate-500 hover:text-white transition flex items-center gap-1.5">
            <Copy size={14} /> {copied ? "Copied" : "Copy Email"}
          </button>
        </div>
        <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5 max-h-[600px] overflow-y-auto">
          <pre className="text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
            {candidate.resumeText}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

const InsightCard = ({ title, items, variant, icon }) => {
  const styles = {
    success: "border-green-500/20 bg-green-500/5 text-green-700 dark:text-green-400",
    warning: "border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400",
    info: "border-indigo-500/20 bg-indigo-500/5 text-indigo-700 dark:text-indigo-400"
  };

  return (
    <div className={`rounded-2xl border p-6 transition-all hover:scale-[1.02] ${styles[variant]}`}>
      <div className="flex items-center gap-2 font-bold mb-4 uppercase tracking-wider text-xs">
        {icon} {title}
      </div>
      <ul className="space-y-3">
        {items.length > 0 ? items.map((item, i) => (
          <li key={i} className="text-sm flex items-start gap-2 leading-snug">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 opacity-50" />
            {item}
          </li>
        )) : <li className="text-sm opacity-50 italic">Analysis incomplete</li>}
      </ul>
    </div>
  );
};

const StatusButton = ({ active, loading, onClick, variant, icon, label }) => {
  const colors = {
    success: active ? "bg-green-600 text-white" : "border-green-200 text-green-600 hover:bg-green-50",
    danger: active ? "bg-red-600 text-white" : "border-red-200 text-red-600 hover:bg-red-50"
  };
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${colors[variant]}`}
    >
      {icon} {label}
    </button>
  );
};

/* ================= UTILITIES ================= */

const scoreRing = (s) => s >= 75 ? "text-green-500" : s >= 50 ? "text-amber-500" : "text-red-500";

const parseSkills = (feedback) => {
  if (!feedback) return { strengths: [], weaknesses: [], recommendations: [] };
  const sections = feedback.split("\n\n");
  const extract = (key) => sections.find(s => s.startsWith(key))?.replace(key, "").trim() || "";
  return {
    strengths: extract("STRENGTHS:").split(",").map(s => s.trim()).filter(Boolean),
    weaknesses: extract("WEAKNESSES:").split(",").map(s => s.trim()).filter(Boolean),
    recommendations: extract("RECOMMENDATIONS:").split("\n").map(s => s.replace("-", "").trim()).filter(Boolean)
  };
};