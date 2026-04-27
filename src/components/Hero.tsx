import { motion } from "motion/react";

export const Hero = () => {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-16 border-b border-border min-h-[70vh] flex flex-col justify-center overflow-hidden">
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at 60% 30%, #00F0FF 0%, transparent 70%)' }}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl relative z-10"
      >
        <div className="inline-flex items-center gap-2 border border-border px-3 py-1.5 mb-6 md:mb-8 bg-surface/50">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-accent shadow-[0_0_8px_#00F0FF]"></span>
          <span className="font-mono text-[9px] md:text-xs font-medium tracking-[0.15em] text-neutral-300 uppercase">
            SYSTEMS ENGINEERING AGENCY
          </span>
        </div>
        
        <h1 className="font-sans text-4xl sm:text-5xl md:text-7xl font-semibold text-white mb-6 md:mb-8 leading-[1.1] tracking-tight">
          Building production-ready systems for serious founders
        </h1>
        
        <p className="font-sans text-base md:text-xl text-neutral-400 max-w-2xl mb-8 md:mb-12 leading-relaxed">
          We design and engineer scalable applications, backend systems, and automation tools — built for real-world use, not demos.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => document.getElementById('start-project')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto bg-white text-black font-mono text-[10px] md:text-xs font-medium px-8 py-4 uppercase tracking-wider hover:bg-accent transition-colors duration-200"
          >
            Start a Project
          </button>
          <button 
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto border border-border text-white font-mono text-[10px] md:text-xs font-medium px-8 py-4 uppercase tracking-wider hover:border-accent hover:text-accent transition-colors duration-200"
          >
            View Work
          </button>
        </div>
      </motion.div>
    </section>
  );
};
