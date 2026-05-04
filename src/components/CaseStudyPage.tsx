import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronRight, Cpu, Globe, Infinity as InfinityIcon } from "lucide-react";
import { useEffect } from "react";

// In a real app, this would be a shared constant or from an API
const projects = [
  {
    id: 1,
    client: "VELOCITY",
    title: "Next-Gen Fintech Dashboard",
    description: "High-performance financial visualization tool with sub-second data propagation and modular widget architecture.",
    longDescription: "Velocity required a platform capable of handling millions of concurrent data streams with zero perceptible latency. Our solution focused on a Rust-based backend for raw computation speed and a highly optimized React frontend using specialized canvas rendering for complex charts.",
    challenge: "The primary obstacle was the 'browser bottleneck'—rendering tens of thousands of data points every 100ms without dropping frames or freezing the UI.",
    solution: "We implemented a custom worker-threaded processing layer that offloads data crunching from the main thread, combined with a bespoke WebGL-based visualization engine.",
    results: ["99.9th percentile latency under 50ms", "Supported 100k+ concurrent ticker updates", "Redesigned institutional user retention increased by 42%"],
    categories: ["Web App Development", "Backend Systems"],
    tags: ["React", "Rust", "WebSockets"],
    heroImage: "https://images.unsplash.com/photo-1611974714851-eb6077e69b05?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    client: "LUMINA",
    title: "Industrial IoT Mesh",
    description: "Distributed automation protocol for managing 50k+ edge devices with autonomous failover capabilities.",
    longDescription: "Lumina's manufacturing plants required a decentralized communication protocol that could survive localized network failures. We built a mesh-based system where every node acts as both a sensor and a relay.",
    challenge: "Scaling to 50,000 devices in a noisy industrial environment where Wi-Fi and standard radio are often unreliable.",
    solution: "A custom MQTT-based protocol with automatic peer discovery and dynamic routing tables that optimize for signal strength and hop count.",
    results: ["0% downtime during 3-day network partition test", "System recovery time reduced to <1s", "Energy efficiency improved by 15% across all nodes"],
    categories: ["Backend Systems", "Automation"],
    tags: ["Go", "MQTT", "K3s"],
    heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
  },
  // Add other projects as needed
];

export const CaseStudyPage = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-sans text-4xl text-white mb-6">Execution Path Not Found</h1>
        <Link to="/" className="font-mono text-accent uppercase tracking-widest flex items-center gap-2">
          <ArrowLeft size={16} /> Decrypt to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white selection:bg-accent selection:text-black">
      {/* Dynamic Navigation */}
      <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 mix-blend-difference">
        <Link to="/" className="font-mono text-[11px] uppercase tracking-[0.4em] font-black text-white hover:text-accent transition-colors flex items-center gap-3">
          <ArrowLeft size={14} /> Back to Lab
        </Link>
        <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 hidden md:block">
          Case Study // PR-0{project.id}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden border-b border-border">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={project.heroImage} 
          alt={project.title}
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16">
          <div className="max-w-screen-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4 block">{project.client}</span>
              <h1 className="font-sans text-4xl md:text-8xl font-medium tracking-tight leading-[0.9] max-w-4xl">
                {project.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 md:py-40 px-6 md:px-16">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          
          {/* Metadata Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-4">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500">Core Tech</label>
              <div className="flex flex-wrap gap-2 text-white">
                {project.tags.map(tag => (
                   <span key={tag} className="border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest bg-white/5">
                     {tag}
                   </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500">Execution Stack</label>
              <div className="flex flex-col gap-4">
                {project.categories.includes("Web App Development") && (
                  <div className="flex items-center gap-3 text-neutral-400">
                    <Globe size={16} className="text-accent" />
                    <span className="font-sans text-sm">Frontend Engineering Architecture</span>
                  </div>
                )}
                {project.categories.includes("Backend Systems") && (
                  <div className="flex items-center gap-3 text-neutral-400">
                    <Cpu size={16} className="text-accent" />
                    <span className="font-sans text-sm">Large Scale System Orchestration</span>
                  </div>
                )}
                {project.categories.includes("Automation") && (
                  <div className="flex items-center gap-3 text-neutral-400">
                    <InfinityIcon size={16} className="text-accent" />
                    <span className="font-sans text-sm">DevOps & Protocol Automation</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 border border-white/5 bg-surface/30">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-white mb-6">Key Statistics</h4>
              <div className="space-y-8">
                {project.results.map((res, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 size={18} className="text-accent shrink-0" />
                    <p className="font-sans text-sm text-neutral-400">{res}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-24 md:space-y-32">
            <div className="space-y-8">
              <h3 className="font-sans text-2xl md:text-3xl font-medium text-white italic">"The project wasn't just about building a tool; it was about defining a new standard for performance."</h3>
              <p className="font-sans text-lg md:text-xl text-neutral-400 leading-relaxed max-w-3xl">
                {project.longDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">01 // The Challenge</span>
                <p className="font-sans text-base text-neutral-400 leading-relaxed">
                  {project.challenge}
                </p>
              </div>
              <div className="space-y-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">02 // The Solution</span>
                <p className="font-sans text-base text-neutral-400 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            <div className="relative h-96 w-full overflow-hidden border border-white/5 group">
               <img src={project.heroImage} alt="Detail" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 bg-accent/20 mix-blend-overlay pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 md:py-40 border-t border-border bg-surface/10">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-16 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-8 block">Project Completed</span>
          <h2 className="font-sans text-4xl md:text-7xl font-medium text-white mb-16 tracking-tight">Need similar outcomes?</h2>
          <Link 
            to="/#start-project"
            className="inline-block px-12 py-6 bg-white text-black font-mono text-[11px] uppercase tracking-[0.4em] font-black hover:bg-accent transition-all active:scale-95"
          >
            Initiate Contact
          </Link>
        </div>
      </section>
    </div>
  );
};
