import React from "react";

const PolicyLayout = ({ title, lastUpdated, children }) => (
  <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <header className="mb-12 border-b border-slate-200 dark:border-white/10 pb-8">
      <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">
        {title}
      </h1>
      <p className="text-sm text-slate-500 font-medium">
        Last Updated: <span className="text-indigo-600">{lastUpdated}</span>
      </p>
    </header>
    
    <div className="prose prose-slate dark:prose-invert max-w-none 
      prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
      prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed">
      {children}
    </div>
  </div>
);

export default PolicyLayout;