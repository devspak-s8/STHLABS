import { motion } from "motion/react";

const quotes = [
  {
    author: "Elena Vance",
    role: "CTO, Vector Dynamics",
    content: "QUETTRIX LABS didn't just build our infrastructure; they re-architected our entire deployment strategy. Their systems handle peak loads with zero degradation."
  },
  {
    author: "Marcus Thorne",
    role: "Founder, BlackBox AI",
    content: "The level of technical rigor is refreshing. No fluff, just production-grade systems that actually scale. They are true engineers' engineers."
  },
  {
    author: "Sarah Jenkins",
    role: "Head of Engineering, CloudScale",
    content: "Moving our legacy architecture to their kubernetes-native stack reduced our operational costs by 40%. The ROI was immediate."
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 md:py-32 px-6 md:px-16 border-b border-border bg-surface/10 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-4">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-sans text-3xl md:text-5xl font-medium text-white tracking-tight uppercase"
        >
          Industry Praise
        </motion.h2>
        <span className="font-mono text-xs text-neutral-500 tracking-tighter">[ 07 ]</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border border border-border">
        {quotes.map((quote, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 md:p-12 bg-background flex flex-col justify-between"
          >
            <div className="mb-8 md:mb-10">
              <span className="text-3xl md:text-4xl font-serif text-accent opacity-50">"</span>
              <p className="font-sans text-base md:text-lg text-neutral-300 leading-relaxed italic -mt-4">
                {quote.content}
              </p>
            </div>
            <div>
              <div className="font-sans font-medium text-white text-sm md:text-base">{quote.author}</div>
              <div className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500 mt-1">{quote.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
