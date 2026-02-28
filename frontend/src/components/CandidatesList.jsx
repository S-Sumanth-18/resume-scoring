import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import {
  Trash2,
  ExternalLink,
  Briefcase,
  AlertCircle
} from "lucide-react";
import {
  getAllCandidates,
  deleteCandidate,
  searchCandidates
} from "../services/api";

export default function CandidatesList({
  search = "",
  roleId = "",
  minScore = "",
  view = "table"
}) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page] = useState(0);

  const fetchTalentPool = useCallback(async () => {
    try {
      setLoading(true);
      let data;

      if (search.trim()) {
        data = await searchCandidates(search, page);
      } else {
        data = await getAllCandidates(page, roleId);
      }

      // Handle Spring Boot Page object structure
      setCandidates(data.content || data);
      setError(null);
    } catch (err) {
      setError("Unable to sync with talent database.");
    } finally {
      setLoading(false);
    }
  }, [search, roleId, page]);

  useEffect(() => {
    fetchTalentPool();
  }, [fetchTalentPool]);

  async function handleDelete(id, name) {
    if (!window.confirm(`Permanent Delete: ${name}?`)) return;
    try {
      await deleteCandidate(id);
      setCandidates((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("System error during deletion.");
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (candidates.length === 0) return <EmptyState />;

  return view === "table" ? (
    <TableView candidates={candidates} onDelete={handleDelete} />
  ) : (
    <GridView candidates={candidates} onDelete={handleDelete} />
  );
}

/* ================= VIEWS ================= */

function TableView({ candidates, onDelete }) {
  const tableRef = useRef(null);

  useEffect(() => {
    if (tableRef.current && candidates.length > 0) {
      gsap.fromTo(
        tableRef.current.children,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [candidates]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-white/10">
          <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            <th className="px-6 py-4 text-left">Rank & Candidate</th>
            <th className="px-6 py-4 text-left">Role Match</th>
            <th className="px-6 py-4 text-left">AI Score</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5" ref={tableRef}>
          {candidates.map((c) => (
            <tr key={c.id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 w-6 h-6 flex items-center justify-center rounded">
                    {c.rankInRole || "-"}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                    <span className="text-xs text-slate-500">{c.email}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{c.jobRole?.roleName}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{c.experienceLevel}</span>
                </div>
              </td>
              <td className="px-6 py-4 font-mono font-bold">
                <span className={scoreColor(c.totalScore)}>{c.totalScore}%</span>
              </td>
              <td className="px-6 py-4">
                <span className={statusBadge(c.status)}>{c.status}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/candidate/${c.id}`} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <ExternalLink size={16} />
                  </Link>
                  <button onClick={() => onDelete(c.id, c.name)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GridView({ candidates, onDelete }) {
  const gridRef = useRef(null);

  useEffect(() => {
    if (gridRef.current && candidates.length > 0) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [candidates]);

  return (
    <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {candidates.map((c) => (
        <div key={c.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-lg transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded">
              RANK #{c.rankInRole || "-"}
            </span>
            <div className="flex gap-2">
              <Link to={`/candidate/${c.id}`} className="text-slate-400 hover:text-indigo-600">
                <ExternalLink size={16} />
              </Link>
              <button onClick={() => onDelete(c.id, c.name)} className="text-slate-400 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white truncate">{c.name}</h3>
          <p className="text-xs text-slate-500 mb-4">{c.email}</p>
          <div className="flex justify-between items-end">
            <span className={statusBadge(c.status)}>{c.status}</span>
            <span className={`font-mono font-bold ${scoreColor(c.totalScore)}`}>{c.totalScore}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= UTILS ================= */

const scoreColor = (s) => s >= 80 ? "text-emerald-500" : s >= 50 ? "text-amber-500" : "text-rose-500";
const statusBadge = (s) => {
  const base = "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest";
  const map = {
    SELECTED: "bg-emerald-500/10 text-emerald-600",
    SHORTLISTED: "bg-indigo-500/10 text-indigo-600",
    REJECTED: "bg-rose-500/10 text-rose-600",
    NEW: "bg-slate-500/10 text-slate-600"
  };
  return `${base} ${map[s] || map.NEW}`;
};

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-32 space-y-4">
    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Syncing Talent Pool</p>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-32 text-slate-400">
    <Briefcase size={48} className="mb-4 opacity-20" />
    <h3 className="font-bold text-slate-900 dark:text-white">No matches found</h3>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-32 text-rose-500">
    <AlertCircle size={48} className="mb-4 opacity-20" />
    <p className="font-bold">{message}</p>
  </div>
);