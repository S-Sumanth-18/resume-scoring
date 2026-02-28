import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, HelpCircle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-md w-full text-center">
        
        {/* Subtle Decorative Element */}
        <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
          <HelpCircle size={48} className="text-indigo-600 dark:text-indigo-400" />
        </div>

        {/* Error Code with Gradient to match SaaS Hero */}
        <h1 className="text-9xl font-black leading-none tracking-tighter mb-4 bg-gradient-to-br from-indigo-600 to-purple-500 bg-clip-text text-transparent">
          404
        </h1>
        
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
          Page not found
        </h2>
        
        <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. 
          Please check the URL or return to the talent dashboard.
        </p>

        {/* Button Group aligned with Home.jsx styling */}
        <div className="flex flex-col gap-3">
          <Link 
            to="/" 
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 px-6 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
          >
            <Home size={18} className="mr-2" />
            Back to Dashboard
          </Link>
          
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center justify-center bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 py-3.5 px-6 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all active:scale-[0.98]"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </button>
        </div>

        {/* Footer Support Link */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-white/5">
          <p className="text-sm text-slate-400">
            Need help? <a href="mailto:support@resumetric.ai" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;