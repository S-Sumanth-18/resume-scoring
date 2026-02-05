import React, { useEffect } from "react";
import { Check } from "lucide-react";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-10 duration-300">
      <div className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-2xl">
        <div className="bg-emerald-500 p-1 rounded-full">
          <Check size={14} className="text-white" />
        </div>
        <p className="text-sm font-bold tracking-tight">{message}</p>
      </div>
    </div>
  );
};

export default Toast;