import { motion } from "motion/react";

const works = [
  {
    client: "NeuroSync",
    category: "distributed systems",
    title: "High-frequency biometric data processing engine handling 100k+ ops/sec.",
  },
  {
    client: "Arch-V",
    category: "fintech infrastructure",
    title: "Secure transaction validation layer for multi-chain asset management.",
  },
  {
    client: "SolarIQ",
    category: "industrial iot",
    title: "Real-time energy grid optimization and monitoring dashboard for smart cities.",
  }
];

export const SelectedWork = () => {
  return (
    <section id="work" className="py-20 md:py-32 px-6 md:px-16 border-b border-border bg-background overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-4">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-sans text-3xl md:text-5xl font-medium text-white tracking-tight uppercase"
        >
          Selected Deployments
        </motion.h2>
        <span className="font-mono text-xs text-neutral-500 tracking-tighter">[ 06 ]</span>
      </div>

      <div className="space-y-px bg-border border border-border">
        {works.map((work, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-12 bg-background hover:bg-surface/50 transition-colors"
          >
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4">
                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-accent">{work.client}</span>
                <span className="hidden md:block w-1 h-1 bg-neutral-700 rounded-full" />
                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-neutral-500">{work.category}</span>
              </div>
              <h3 className="font-sans text-lg md:text-2xl font-medium text-neutral-300 group-hover:text-white transition-colors leading-relaxed">
                {work.title}
              </h3>
            </div>
            <div className="mt-8 md:mt-0 flex items-center justify-end gap-4 group/btn cursor-pointer">
              <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500 group-hover/btn:text-accent transition-colors">Case Study</span>
              <div className="w-10 md:w-12 h-px bg-neutral-800 group-hover/btn:w-16 group-hover/btn:bg-accent transition-all duration-300" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
