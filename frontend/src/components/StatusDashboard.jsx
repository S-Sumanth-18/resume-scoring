import React from "react";
import { CheckCircle2, AlertTriangle, Activity } from "lucide-react";

const StatusDashboard = () => {
  const services = [
    { name: "Scoring Engine", status: "operational", uptime: "99.98%" },
    { name: "Candidate Database", status: "operational", uptime: "100%" },
    { name: "Public API", status: "degraded", uptime: "98.50%" },
    { name: "Authentication", status: "operational", uptime: "99.99%" },
  ];

  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-emerald-500/10 rounded-2xl">
          <Activity className="text-emerald-500" size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">System Status</h2>
          <p className="text-slate-500">Real-time health of ResuMetric AI services.</p>
        </div>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-4">
              {service.status === "operational" ? (
                <CheckCircle2 className="text-emerald-500" size={20} />
              ) : (
                <AlertTriangle className="text-amber-500" size={20} />
              )}
              <span className="font-bold text-slate-900 dark:text-white">{service.name}</span>
            </div>
            <div className="text-right">
              <p className={`text-xs font-black uppercase tracking-widest ${
                service.status === "operational" ? "text-emerald-500" : "text-amber-500"
              }`}>
                {service.status}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">UPTIME: {service.uptime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDashboard;