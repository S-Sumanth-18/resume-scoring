import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 dark:border-white/10 last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left group"
      >
        <span className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
          {question}
        </span>
        <div className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown className="text-slate-400" size={20} />
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
        }`}>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default FAQItem;