import { Terminal, Server, Code, Layout } from "lucide-react";
import { motion } from "motion/react";

const capabilities = [
  {
    icon: <Terminal size={32} />,
    title: "Web App Development",
    description: "We build fast, reliable web applications designed to handle growth and provide a seamless experience for your users."
  },
  {
    icon: <Server size={32} />,
    title: "Backend & Internal Tools",
    description: "Robust server systems and custom dashboards built to automate your business processes and manage complex data."
  },
  {
    icon: <Code size={32} />,
    title: "Workflow Automation",
    description: "Custom scripts and automated workflows that eliminate manual work and keep your team focused on what matters."
  },
  {
    icon: <Layout size={32} />,
    title: "Digital Product Strategy",
    description: "Strategic planning and technical design to ensure your product is scalable, secure, and ready for the future."
  }
];

export const Capabilities = () => {
  return (
    <section id="services" className="py-20 md:py-32 px-6 md:px-16 border-b border-border">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-4">
        <h2 className="font-sans text-3xl md:text-5xl font-medium text-white tracking-tight uppercase">Core Capabilities</h2>
        <span className="font-mono text-xs text-neutral-500 tracking-tighter">[ 01 ]</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
        {capabilities.map((cap, index) => (
          <motion.div 
            key={index}
            whileHover={{ backgroundColor: '#131313' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-background p-8 md:p-12 group transition-all duration-300 border border-transparent hover:border-accent"
          >
            <div className="mb-6 md:mb-8 text-accent group-hover:scale-110 transition-transform duration-300">
              {/* @ts-ignore */}
              {cap.icon}
            </div>
            <h3 className="font-sans text-xl md:text-2xl font-medium text-white mb-4 tracking-tight uppercase">
              {cap.title}
            </h3>
            <p className="font-sans text-sm md:text-base text-neutral-400 leading-relaxed max-w-sm">
              {cap.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
