import React from "react";
import FAQItem from "../components/FAQItem";

const HelpCenter = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black mb-12 uppercase tracking-tight">Help Center</h1>
      <div className="space-y-2">
        <FAQItem 
          question="How is the Match Score calculated?" 
          answer="We use a weighted algorithm that prioritizes mandatory skills defined by the recruiter. Missing mandatory skills results in a scoring penalty to ensure high-quality matches." 
        />
        <FAQItem 
          question="Does the system support different file formats?" 
          answer="Currently, our AI extraction engine is optimized specifically for PDF resumes to ensure the highest accuracy in text parsing." 
        />
      </div>
    </div>
  );
};

export default HelpCenter;