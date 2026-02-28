import React, { useState, useEffect, useCallback } from "react";
import { uploadResume, getAllRoles } from "../services/api";
import { Upload, CheckCircle, AlertCircle, Loader2, TrendingUp, Cpu } from "lucide-react";

export default function UploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState(""); // Initialize as empty string
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  /* ================= LOAD ROLES ================= */
  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    try {
      const data = await getAllRoles();
      setRoles(data);
      // Removed automatic roleId setting to allow user manual selection
    } catch {
      setError("Failed to sync with job role database.");
    }
  }

  /* ================= FILE HANDLING ================= */
  const handleFile = useCallback((e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.type !== "application/pdf") {
      setError("Only PDF resumes are supported for AI analysis.");
      setFile(null);
      return;
    }

    setError(null);
    setFile(f);
  }, []);

  /* ================= SUBMIT ================= */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!file || !name || !email || !roleId) {
      setError("Missing required fields. Please select a role and upload a PDF.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Backend Alignment: roleId is passed as part of the multipart form
      const response = await uploadResume(file, name, email, phone, roleId);
      setResult(response);
      onUploadSuccess?.(response);
    } catch (err) {
      setError(err.message || "Upload failed. Please check file format.");
    } finally {
      setLoading(false);
    }
  }

  /* ================= HELPERS ================= */
  const getScoreStyles = (s) => {
    if (s >= 75) return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
    if (s >= 50) return "text-amber-500 border-amber-500/20 bg-amber-500/5";
    return "text-rose-500 border-rose-500/20 bg-rose-500/5";
  };

  const experienceStyles = {
    JUNIOR: "bg-emerald-500/10 text-emerald-600",
    MID_LEVEL: "bg-amber-500/10 text-amber-600",
    SENIOR: "bg-rose-500/10 text-rose-600"
  };

  const skills = result?.feedback
    ? parseSkills(result.feedback)
    : { strengths: [], weaknesses: [], recommendations: [] };

  /* ================= UI ================= */
  return (
    <div className="space-y-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Target Role</label>
              <select
                className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                required
                disabled={loading}
              >
                {/* Fixed: Added an explicit default disabled option to force change detection */}
                <option value="" disabled>Select a position...</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roleName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Resume PDF</label>
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFile}
                  disabled={loading}
                  className="hidden"
                  id="resume-file"
                />
                <label
                  htmlFor="resume-file"
                  className="flex items-center gap-3 w-full p-3 rounded-xl border border-dashed dark:border-white/10 dark:bg-slate-800 cursor-pointer hover:border-indigo-500 transition-colors"
                >
                  <Upload size={18} className="text-slate-400" />
                  <span className="text-sm text-slate-500 truncate">{file ? file.name : "Choose PDF..."}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Full Name" value={name} onChange={setName} loading={loading} />
            <Input label="Email" type="email" value={email} onChange={setEmail} loading={loading} />
            <Input label="Phone" value={phone} onChange={setPhone} loading={loading} required={false} />
          </div>

          <button
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 disabled:bg-slate-700 flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Cpu size={20} />}
            {loading ? "AI Analyzing..." : "Process Talent Profile"}
          </button>
        </form>
      ) : (
        /* Result View */
        <div className="animate-in fade-in zoom-in duration-500 space-y-8">
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <CheckCircle className="text-emerald-500" size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Analysis Complete</h3>
            <p className="text-slate-500 text-sm mt-1">Profile successfully indexed in talent pipeline</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-6 rounded-2xl border flex flex-col items-center ${getScoreStyles(result.score)}`}>
              <span className="text-4xl font-black">{result.score}%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-2">AI Match Score</span>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex flex-col items-center">
              <div className="flex items-center gap-2 text-indigo-600">
                <TrendingUp size={20} />
                <span className="text-4xl font-black">#{result.rank}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-slate-400">Current Rank</span>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex flex-col items-center">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${experienceStyles[result.experienceLevel]}`}>
                {result.experienceLevel}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest mt-3 text-slate-400">Seniority Level</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkillCard title="Core Strengths" items={skills.strengths} variant="success" />
            <SkillCard title="Gap Analysis" items={skills.weaknesses} variant="warning" />
            <SkillCard title="AI Strategy" items={skills.recommendations} variant="info" />
          </div>

          <button
            onClick={() => setResult(null)}
            className="w-full py-3 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
          >
            Analyze another candidate
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm flex items-center gap-3">
          <AlertCircle size={18} /> {error}
        </div>
      )}
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

const Input = ({ label, value, onChange, loading, type = "text", required = true }) => (
  <div className="space-y-2">
    <label className="text-xs font-black uppercase tracking-widest text-slate-400">{label} {required && "*"}</label>
    <input
      type={type}
      className="w-full p-3 rounded-xl border dark:bg-slate-800 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={loading}
      required={required}
    />
  </div>
);

const SkillCard = ({ title, items, variant }) => {
  const themes = {
    success: "text-emerald-600 bg-emerald-500/5",
    warning: "text-amber-600 bg-amber-500/5",
    info: "text-indigo-600 bg-indigo-500/5"
  };
  return (
    <div className={`p-5 rounded-2xl ${themes[variant]}`}>
      <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">{title}</h4>
      {items.length === 0 ? (
        <p className="text-xs italic opacity-50">Not detected</p>
      ) : (
        <ul className="space-y-2">
          {items.map((i, idx) => (
            <li key={idx} className="text-xs font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
              {i}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const parseSkills = (feedback) => {
  if (!feedback) return { strengths: [], weaknesses: [], recommendations: [] };
  const sections = feedback.split("\n\n");
  const extract = (key) => sections.find((s) => s.startsWith(key))?.replace(key, "").trim() || "";
  return {
    strengths: extract("STRENGTHS:").split(",").map((s) => s.trim()).filter(Boolean),
    weaknesses: extract("WEAKNESSES:").split(",").map((s) => s.trim()).filter(Boolean),
    recommendations: extract("RECOMMENDATIONS:").split("\n").map((s) => s.replace("-", "").trim()).filter(Boolean)
  };
};