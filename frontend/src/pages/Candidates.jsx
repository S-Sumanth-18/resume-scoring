import React, { useState, useEffect } from "react";
import axiosClient from "../services/axiosClient";
import {
  Users,
  Search,
  Filter,
  TrendingUp,
  Award,
  LayoutGrid,
  List,
  ChevronDown,
  Briefcase
} from "lucide-react";
import CandidatesList from "../components/CandidatesList";

const Candidates = () => {
  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [roles, setRoles] = useState([]);
  const [view, setView] = useState("table");
  const [stats] = useState({ total: 0, rolesCount: 0, shortlisted: 0 });

  // SaaS Feature: Sync UI with Backend State
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesRes = await axiosClient.get("/roles");
        setRoles(rolesRes.data);

        // Placeholder for a stats endpoint: GET /api/resume/candidates/stats
        // setStats({ 
        //   total: candidatesCount, 
        //   rolesCount: rolesRes.data.length,
        //   shortlisted: shortlistedCount 
        // });
      } catch (err) {
        console.error("Error fetching talent pool data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-500">

      {/* ===== PAGE HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Talent Pipeline
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Screening candidates across <strong>{roles.length} active roles</strong> using weighted AI scoring.
          </p>
        </div>

        <button className="inline-flex items-center rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition shadow-sm">
          Export Talent CSV
        </button>
      </div>

      {/* ===== REAL-TIME STATS (Aligned with DB) ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users size={18} />} title="Total Candidates" value={stats.total || "..."} meta="Database sync" />
        <StatCard icon={<Briefcase size={18} />} title="Active Roles" value={roles.length} meta="Open positions" />
        <StatCard icon={<Award size={18} />} title="Top Match" value="98%" meta="Rank #1" />
        <StatCard icon={<TrendingUp size={18} />} title="Shortlisted" value={stats.shortlisted || "0"} meta="Review required" />
      </section>

      {/* ===== FILTER BAR ===== */}
      <div className="sticky top-20 z-20 glass-panel rounded-xl p-4 flex flex-col lg:flex-row gap-4 shadow-sm">

        {/* Search - Connected to Backend Query Logic */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-10 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Job Roles</option>
            {roles.map(r => <option key={r.id} value={r.id}>{r.roleName}</option>)}
          </select>

          <FilterInput
            icon={<Filter size={14} />}
            placeholder="Min score"
            value={minScore}
            onChange={setMinScore}
            type="number"
          />

          <div className="flex items-center rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 p-1">
            <ToggleButton active={view === "table"} onClick={() => setView("table")}>
              <List size={16} />
            </ToggleButton>
            <ToggleButton active={view === "card"} onClick={() => setView("card")}>
              <LayoutGrid size={16} />
            </ToggleButton>
          </div>
        </div>
      </div>

      {/* ===== TALENT LIST ===== */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center text-sm font-semibold">
          <span className="text-slate-900 dark:text-white uppercase tracking-wider text-xs">Active Pool</span>
          <span className="flex items-center gap-1 text-slate-500">
            Sort by: <strong className="text-indigo-600">Total Score</strong>
            <ChevronDown size={14} />
          </span>
        </div>

        <CandidatesList
          search={search}
          roleId={roleFilter}
          minScore={minScore}
          view={view}
        />
      </div>
    </div>
  );
};

export default Candidates;

/* ================= REUSABLE COMPONENTS ================= */

const StatCard = ({ icon, title, value, meta }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 transition-all hover:border-indigo-500/50">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter text-emerald-600 px-2 py-0.5 bg-emerald-500/10 rounded-md">
        {meta}
      </span>
    </div>
    <div className="text-3xl font-black text-slate-900 dark:text-white">
      {value}
    </div>
    <p className="text-xs font-semibold uppercase text-slate-500 mt-1">{title}</p>
  </div>
);

const FilterInput = ({ icon, placeholder, value, onChange, type = "text" }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
      {icon}
    </span>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-32 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
    />
  </div>
);

const ToggleButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-md transition duration-200 ${active
      ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm"
      : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
      }`}
  >
    {children}
  </button>
);