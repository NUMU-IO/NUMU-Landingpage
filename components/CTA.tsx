import React from 'react';

const CTA: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto w-full px-4">
      <div className="bg-background-light dark:bg-background-dark rounded-[2rem] md:rounded-[2.5rem] shadow-neu-floating p-8 md:p-16 text-center relative overflow-hidden group">
        <div className="absolute -top-20 -left-20 size-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
        <div className="absolute -bottom-20 -right-20 size-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-5xl font-black text-text-main dark:text-white tracking-tight">Ready to scale your empire?</h2>
          <p className="text-text-muted text-base md:text-lg max-w-xl">Join 10,000+ merchants growing with NUMU today. No setup fees, cancel anytime.</p>
          <button className="mt-4 bg-brand-gradient text-white text-base md:text-lg font-bold h-14 md:h-16 px-8 md:px-10 rounded-2xl shadow-[6px_6px_12px_rgba(15,23,42,0.3),-6px_-6px_12px_rgba(255,255,255,0.9)] active:shadow-neu-pressed hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
            <span>Start Your Free Trial</span>
            <span className="material-symbols-outlined">rocket_launch</span>
          </button>
          <p className="text-xs text-text-muted font-medium mt-4">No credit card required for trial.</p>
        </div>
      </div>
    </div>
  );
};

export default CTA;