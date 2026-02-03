import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // ✅ FIX: wrap in useCallback
  const loadCandidate = useCallback(async () => {
    try {
      const data = await getCandidateById(id);
      setCandidate(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ✅ FIX: dependency is loadCandidate
  useEffect(() => {
    loadCandidate();
  }, [loadCandidate]);

  async function handleDelete() {
    if (!window.confirm(`Are you sure you want to delete ${candidate.name}?`)) {
      return;
    }

    try {
      await deleteCandidate(id);
      alert("Candidate deleted successfully");
      navigate("/candidates");
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  }

  async function handleStatusChange(newStatus) {
    setUpdatingStatus(true);
    try {
      const updated = await updateCandidateStatus(id, newStatus);
      setCandidate(updated);
      alert("Status updated successfully");
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return "#10b981";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getExperienceBadge = (level) => {
    const badges = {
      JUNIOR: { label: "🟢 Junior", color: "#10b981" },
      MID_LEVEL: { label: "🟡 Mid-Level", color: "#f59e0b" },
      SENIOR: { label: "🔴 Senior", color: "#ef4444" }
    };
    return badges[level] || { label: level, color: "#6b7280" };
  };

  const parseSkills = (feedback) => {
    if (!feedback)
      return { strengths: [], weaknesses: [], recommendations: [] };

    const sections = feedback.split("\n\n");
    const strengthsSection = sections.find((s) =>
      s.startsWith("STRENGTHS:")
    );
    const weaknessesSection = sections.find((s) =>
      s.startsWith("WEAKNESSES:")
    );
    const recommendationsSection = sections.find((s) =>
      s.startsWith("RECOMMENDATIONS:")
    );

    return {
      strengths: strengthsSection
        ? strengthsSection
            .replace("STRENGTHS:", "")
            .split(",")
            .map((s) => s.trim())
        : [],
      weaknesses: weaknessesSection
        ? weaknessesSection
            .replace("WEAKNESSES:", "")
            .split(",")
            .map((s) => s.trim())
        : [],
      recommendations: recommendationsSection
        ? recommendationsSection
            .replace("RECOMMENDATIONS:", "")
            .split("\n")
            .map((s) => s.replace("-", "").trim())
        : []
    };
  };

  if (loading) {
    return (
      <div className="card">
        <div className="spinner"></div>
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Loading candidate details...
        </p>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="card">
        <div className="alert alert-error">
          ⚠️ {error || "Candidate not found"}
        </div>
        <button
          onClick={() => navigate("/candidates")}
          className="btn btn-primary"
        >
          ← Back to Candidates
        </button>
      </div>
    );
  }

  const { strengths, weaknesses, recommendations } = parseSkills(
    candidate.feedback
  );

  return (
    <div>
      <h2>👤 {candidate.name}</h2>
      <p>Email: {candidate.email}</p>
      <p>Status: {candidate.status}</p>

      <button onClick={handleDelete} className="btn btn-primary">
        🗑 Delete Candidate
      </button>

      <h3>⭐ Score: {candidate.totalScore}</h3>

      <h3>📊 Strengths</h3>
      {strengths.map((s, i) => (
        <span key={i}>{s}, </span>
      ))}

      <h3>❌ Weaknesses</h3>
      {weaknesses.map((s, i) => (
        <span key={i}>{s}, </span>
      ))}

      <h3>💡 Recommendations</h3>
      <ul>
        {recommendations.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
