import React from "react";
import StatusDashboard from "../components/StatusDashboard";

const StatusPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      {/* This page simply acts as a container for your StatusDashboard component */}
      <StatusDashboard />
      
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Last check performed at: <span className="font-mono">{new Date().toLocaleTimeString()}</span>
        </p>
      </div>
    </div>
  );
};

export default StatusPage;