import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, Share2, MoreHorizontal } from "lucide-react";
import CandidateDetail from "../components/CandidateDetail";

const CandidateDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // SaaS Alignment: Extract ID for dynamic backend fetching

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ===== PAGE HEADER ===== */}
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-white/10 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

          {/* Left: Navigation and Context */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/candidates")}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
              aria-label="Back to candidates"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Candidate Profile
                </h1>
                {/* Visual indicator of the dynamic ID being viewed */}
                <span className="text-xs font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  ID: {id}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Detailed AI analysis and role-based ranking insights.
              </p>
            </div>
          </div>

          {/* Right: SaaS Action Area (Aligned with Backend CRUD) */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition shadow-sm">
              <Download size={16} />
              <span className="hidden lg:inline">Resume</span>
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition shadow-sm">
              <Share2 size={16} />
              <span className="hidden lg:inline">Share</span>
            </button>
            <button className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition shadow-sm">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== PROFILE CONTENT ===== */}
      {/* Passing the ID to the child component so it can handle 
          the axios.get(`http://localhost:8080/api/resume/candidates/${id}`)
      */}
      <CandidateDetail candidateId={id} />
    </div>
  );
};

export default CandidateDetailPage;