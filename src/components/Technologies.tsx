import { motion } from "motion/react";

const techs = [
  "PostgreSQL", "Redis", "TypeScript", "Node.js", "Docker", "Kubernetes", 
  "AWS", "Terraform", "React", "GraphQL", "Python", "Go"
];

export const Technologies = () => {
  return (
    <section id="tech" className="py-24 px-8 md:px-16 border-b border-border bg-surface/30 overflow-hidden">
      <div className="flex justify-between items-end mb-16">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-sans text-3xl md:text-4xl font-medium text-white tracking-tight uppercase"
        >
          Tech Stack
        </motion.h2>
        <span className="font-mono text-xs text-neutral-500 tracking-tighter">[ 03 ]</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-border border border-border">
        {techs.map((tech, i) => (
          <motion.div
            key={tech}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="p-8 flex items-center justify-center bg-background group hover:bg-surface transition-colors"
          >
            <span className="font-mono text-xs tracking-widest text-neutral-500 group-hover:text-accent transition-colors">
              {tech}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
