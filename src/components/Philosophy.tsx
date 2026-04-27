import { motion } from "motion/react";
import { Shield, Zap, Maximize, Cpu } from "lucide-react";

const principles = [
  {
    icon: <Shield size={24} />,
    title: "Zero Trust Architecture",
    description: "Every component is verified. We build systems that assume nothing and secure everything by default."
  },
  {
    icon: <Zap size={24} />,
    title: "Latency Optimization",
    description: "Milliseconds cost millions. We optimize every path segment to ensure absolute peak performance."
  },
  {
    icon: <Maximize size={24} />,
    title: "Elastically Scalable",
    description: "Our systems don't just grow; they expand and contract based on real-time demand metrics."
  },
  {
    icon: <Cpu size={24} />,
    title: "Hardware-Aware Code",
    description: "We write software that understands the metal it runs on, extracted maximum efficiency from every cycle."
  }
];

export const Philosophy = () => {
  return (
    <section className="py-24 px-8 md:px-16 border-b border-border bg-background">
      <div className="flex justify-between items-end mb-16">
        <h2 className="font-sans text-3xl md:text-4xl font-medium text-white tracking-tight uppercase">Engineering Philosophy</h2>
        <span className="font-mono text-xs text-neutral-500 tracking-tighter">[ 09 ]</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {principles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <div className="mb-6 p-4 border border-border inline-block group-hover:border-accent group-hover:text-accent transition-colors">
              {p.icon}
            </div>
            <h3 className="font-sans text-xl font-medium text-white mb-4 uppercase tracking-tight">{p.title}</h3>
            <p className="font-sans text-sm text-neutral-500 leading-relaxed group-hover:text-neutral-300 transition-colors">
              {p.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
