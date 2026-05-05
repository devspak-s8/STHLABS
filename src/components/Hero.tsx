import { motion } from "motion/react";

export const Hero = () => {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-16 border-b border-border min-h-[70vh] flex flex-col justify-center overflow-hidden">
      {/* Dynamic Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-accent/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] bg-accent/10 blur-[120px] rounded-full"
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl relative z-10"
      >
        <div className="inline-flex items-center gap-2 border border-border px-3 py-1.5 mb-6 md:mb-8 bg-surface/50">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-accent shadow-[0_0_8px_#00F0FF]"></span>
          <span className="font-mono text-[9px] md:text-xs font-medium tracking-[0.15em] text-neutral-300 uppercase">
            Product Design & Development Agency
          </span>
        </div>
        
        <h1 className="font-sans text-4xl sm:text-5xl md:text-7xl font-semibold text-white mb-6 md:mb-8 leading-[1.1] tracking-tight">
          Building high-performance apps for ambitious founders
        </h1>
        
        <p className="font-sans text-base md:text-xl text-neutral-400 max-w-2xl mb-8 md:mb-12 leading-relaxed">
          We design and build reliable web applications, internal tools, and custom software that work at scale.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => document.getElementById('start-project')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto bg-white text-black font-mono text-[10px] md:text-xs font-medium px-8 py-4 uppercase tracking-wider hover:bg-accent transition-colors duration-200"
          >
            Book Your Project
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
