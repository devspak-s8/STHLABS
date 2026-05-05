import { motion } from "motion/react";

export const FinalCTA = () => {
  return (
    <section className="py-32 px-8 md:px-16 text-center bg-background border-b border-border">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-sans text-4xl md:text-6xl font-semibold text-white mb-12 tracking-tight">
          Ready to launch your vision?
        </h2>
        <button 
          onClick={() => document.getElementById('start-project')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-white text-black font-mono text-xs font-medium px-10 py-5 uppercase tracking-widest hover:bg-accent transition-colors duration-200"
        >
          Book Your Project
        </button>
      </motion.div>
    </section>
  );
};
