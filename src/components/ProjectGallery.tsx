import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Code2, Cpu, Globe, Infinity as InfinityIcon } from "lucide-react";

type Category = 'All' | 'Web App Development' | 'Backend Systems' | 'Automation';

interface Project {
  id: number;
  client: string;
  logo: string;
  title: string;
  description: string;
  categories: Category[];
  tags: string[];
}

const projects: Project[] = [
  {
    id: 1,
    client: "VELOCITY",
    logo: "V",
    title: "Next-Gen Fintech Dashboard",
    description: "High-performance financial visualization tool with sub-second data propagation and modular widget architecture.",
    categories: ["Web App Development", "Backend Systems"],
    tags: ["React", "Rust", "WebSockets"]
  },
  {
    id: 2,
    client: "LUMINA",
    logo: "L",
    title: "Industrial IoT Mesh",
    description: "Distributed automation protocol for managing 50k+ edge devices with autonomous failover capabilities.",
    categories: ["Backend Systems", "Automation"],
    tags: ["Go", "MQTT", "K3s"]
  },
  {
    id: 3,
    client: "CRYPTOX",
    logo: "C",
    title: "Global Liquidity Aggregator",
    description: "Real-time order book synchronization across 15+ decentralized exchanges using low-latency execution paths.",
    categories: ["Backend Systems", "Web App Development"],
    tags: ["Node.js", "Redis", "Ethers.js"]
  },
  {
    id: 4,
    client: "AERO",
    logo: "A",
    title: "Auto-Scaling CI/CD Core",
    description: "Internal developer platform utility that reduced deployment lead times by 65% through intelligent caching.",
    categories: ["Automation"],
    tags: ["Python", "Terraform", "GitHub Actions"]
  },
  {
    id: 5,
    client: "SYNAPSE",
    logo: "S",
    title: "Collaborative Design Engine",
    description: "Real-time multiplayer canvas engine supporting complex SVG manipulation and versioned history.",
    categories: ["Web App Development"],
    tags: ["TypeScript", "Canvas API", "CRDT"]
  },
  {
    id: 6,
    client: "ODYSSEY",
    logo: "O",
    title: "Data Pipeline Orchestrator",
    description: "Automated ETL workflow manager for multi-terabyte data migration between legacy systems and modern clouds.",
    categories: ["Backend Systems", "Automation"],
    tags: ["Scala", "Kubernetes", "PostgreSQL"]
  }
];

const categories: Category[] = ['All', 'Web App Development', 'Backend Systems', 'Automation'];

export const ProjectGallery = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.categories.includes(activeCategory));

  return (
    <section id="gallery" className="py-24 md:py-40 px-6 md:px-16 border-b border-border bg-background">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-8 h-px bg-accent" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Full Portfolio</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-sans text-4xl md:text-6xl font-medium text-white tracking-tight leading-[1.1]"
            >
              The Science of <span className="text-neutral-500">Execution.</span>
            </motion.h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all duration-300 border ${
                  activeCategory === cat 
                    ? "bg-accent border-accent text-black" 
                    : "bg-surface/30 border-white/5 text-neutral-500 hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-px md:bg-border md:border md:border-border overflow-hidden"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-background p-8 md:p-12 flex flex-col h-full min-h-[400px] hover:bg-surface/30 transition-colors"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 border border-accent rotate-45 translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="flex justify-between items-start mb-12">
                  <div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-accent/50 transition-colors bg-white/5 font-sans font-black text-xl text-neutral-400 group-hover:text-accent">
                    {project.logo}
                  </div>
                  <div className="flex gap-1">
                    {project.categories.includes("Web App Development") && <Globe size={12} className="text-neutral-700" />}
                    {project.categories.includes("Backend Systems") && <Cpu size={12} className="text-neutral-700" />}
                    {project.categories.includes("Automation") && <InfinityIcon size={12} className="text-neutral-700" />}
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-accent/60">{project.client}</span>
                  </div>
                  <h3 className="font-sans text-xl md:text-2xl font-medium text-white mb-4 leading-tight group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-sans text-sm text-neutral-400 mb-8 leading-relaxed max-w-xs">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-10">
                    {project.tags.map(tag => (
                      <span key={tag} className="font-mono text-[8px] uppercase tracking-widest text-neutral-600 border border-white/5 px-2 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link 
                    to={`/case-study/${project.id}`}
                    className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors group/btn"
                  >
                    Case Study <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-24 pt-16 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
          <div>
            <h4 className="font-sans text-xl font-medium text-white mb-2">Have a similar project in mind?</h4>
            <p className="font-sans text-sm text-neutral-500">Our engineers are ready to build your next breakthrough.</p>
          </div>
          <button 
            onClick={() => document.getElementById('start-project')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-5 bg-white text-black font-mono text-[11px] uppercase tracking-[0.3em] font-black hover:bg-accent transition-all active:scale-95"
          >
            Reserve Your Project Slot
          </button>
        </motion.div>
      </div>
    </section>
  );
};
