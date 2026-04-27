import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Understand your product",
    description: "Deep dive into requirements, constraints, and business objectives."
  },
  {
    number: "02",
    title: "Design system architecture",
    description: "Mapping data flows, infrastructure choices, and technical blueprints."
  },
  {
    number: "03",
    title: "Build & deploy",
    description: "Rigorous engineering, testing, and managed deployment cycles."
  },
  {
    number: "04",
    title: "Iterate & scale",
    description: "Continuous optimization and scaling based on real-world usage data."
  }
];

export const Process = () => {
  return (
    <section id="process" className="py-20 md:py-32 px-6 md:px-16 border-b border-border">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-4">
        <h2 className="font-sans text-3xl md:text-5xl font-medium text-white tracking-tight uppercase">Execution Process</h2>
        <span className="font-mono text-xs text-neutral-500 tracking-tighter">[ 02 ]</span>
      </div>
      
      <div className="flex flex-col border border-border">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            whileHover={{ backgroundColor: '#131313' }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-stretch group transition-colors duration-300 ${index !== steps.length - 1 ? 'border-b border-border' : ''}`}
          >
            <div className="w-16 md:w-32 p-4 md:p-8 font-mono text-[10px] md:text-xs text-accent border-r border-border flex items-center justify-center shrink-0">
              {step.number}
            </div>
            <div className="p-6 md:p-8 flex-grow">
              <h3 className="font-sans text-lg md:text-2xl font-medium text-white mb-2 tracking-tight uppercase">
                {step.title}
              </h3>
              <p className="font-sans text-xs md:text-base text-neutral-400">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
