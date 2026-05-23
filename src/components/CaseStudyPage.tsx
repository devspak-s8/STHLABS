import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronRight, Cpu, Globe, Infinity as InfinityIcon } from "lucide-react";
import { useEffect } from "react";

// In a real app, this would be a shared constant or from an API
const projects = [
  {
    id: 7,
    client: "AURA HORIZON",
    title: "Aura Horizon — Premium Travel & Adventures",
    description: "Hyper-personalized travel itinerary coordinator integrating multi-checkpoint coordination and bespoke digital portfolios.",
    longDescription: "Aura Horizon is an ultra-premium, client-centric travel planning and adventure scheduling platform. It was engineered to solve the intricate logistical challenges faced by luxury tour coordinators and boutique travel agencies. The platform facilitates coordinate-accurate private charters, real-time ground transportation routing, and direct link ups with elite boutique suites and hotel chains. Backed by a high-fidelity local cache engine, agents and travelers can curate, review, and adjust extensive multi-checkpoint vacation lists securely without connectivity latency.",
    challenge: "The primary challenge was managing fluid itineraries with frequent, sudden schedule adjustments (e.g. charter adjustments, weather diversions, check-in changes) across 15+ disparate global coordinates simultaneously. Traditional travel tooling was slow, heavily database-dependent, and lacked rich, offline-capable state synchronization.",
    solution: "We engineered a real-time reactive itinerary synchronization engine containing persistent offline database schemas. By combining optimized multi-vector coordinate routing with an automated, stateful change dispatcher, clients get instant progress notifications while local travel planners maintain 100% operational autonomy.",
    results: [
      "Synchronized up to 24 multi-checkpoint flights and charters simultaneously under 100ms",
      "Reduced customizable private travel portfolio rendering times by 55% globally",
      "Over 99.7% customer satisfaction rate trackable across 200+ elite tours",
      "Embedded direct on-the-ground validation triggers for boutique hotel managers",
      "Automatic dynamic routes backup options instantly calculated during weather alerts"
    ],
    categories: ["Web App Development"],
    tags: ["React", "Motion", "TailwindCSS", "IndexedDB"],
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
  },
  {
    id: 8,
    client: "AURELIA",
    title: "Aurelia Real Estate Platform",
    description: "Elite digital architectural showroom for custom properties and concierge estate planning, styled with a sliding-scale financial engine.",
    longDescription: "The Aurelia Real Estate Platform is an elite, fully interactive showcase for world-class architecture, high-end private islands, and luxury countryside estates. Recognizing that high-net-worth buyers require immediate, granular financial clarity, the platform embeds a real-time sliding-scale mortgage and amortization calculator. Buyers can smoothly adjust their down payment, interest rates, check tax percentages, and toggle loan durations (15 vs 30 years) with instant mathematical feedback. All dropdown menus have been custom-styled with dashed high-contrast frames and subtle ambient glow indicators, reflecting the premium visual identity of Aurelia.",
    challenge: "Traditional layout libraries introduced jarring shifts, lags, and visual glitches when executing high-frequency mathematical calculations across responsive designs, which detracted from the ultra-luxury website mood.",
    solution: "We built isolated state math calculators that feed directly into hardware-accelerated paint pipelines. The user experience is tied to subtle blur filters, horizontal slide transitions, and micro-animations that recalculate figures smoothly at 60 FPS without dropping frames on any mobile or desktop screen.",
    results: [
      "Achieved 99.8% accurate mortgage and fee estimates across 12 custom global listings",
      "Increased user stay duration on architectural interactive galleries by 60%",
      "Seamless layout transitions supporting crisp desktop and mobile responsiveness",
      "Upgraded all standard select inputs to custom-styled deluxe dropdown interfaces",
      "Automated PDF breakdown reports generated on demand with direct broker routes"
    ],
    categories: ["Web App Development"],
    tags: ["React", "Motion", "Calculations", "Financial APIs"],
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 9,
    client: "FLEETFLOW",
    title: "Unified Logistics & Fleet Management Hub",
    description: "Full-scale logistics dispatch and dynamic transit routing hub with telemetry maps and automated service maintenance registries.",
    longDescription: "FleetFlow is a state-of-the-art logistics and freight management center that brings live dispatching, real-time vehicle telemetry, maintenance logging, and automated fuel optimization under a single dashboard. Backed by Google Gemini AI, FleetFlow automatically analyzes route hazards, current payload weights, and driver hours of service to compute optimal, energy-efficient delivery routes. The app integrates high-capacity client registers for tracking exact brake alignments, oil checks, mechanic signatures, and repair costs, ensuring fleet managers never miss critical repairs.",
    challenge: "Handling high-frequency incoming telemetry data streams (such as driver coordinates, battery level drops, live speeds) while requesting external AI routing optimization without exceeding rate limits or causing interface lags.",
    solution: "We designed a lightweight web dispatcher that batch-evaluates telemetry points and buffers API requests, feeding spatial maps with precise local buffers so routing paths render instantly without delay.",
    results: [
      "Boosted fleet routing efficiency by 22% using custom Gemini optimization paths",
      "Tracked 1,200+ physical fleet vehicle service logs with zero missing registers",
      "Synchronized real-time device coordinate telemetry under 1.2 seconds globally",
      "Decreased average administrative dispatch latency by over 14 minutes per driver",
      "Seamless integration with third-party barcode mechanics and dispatch systems"
    ],
    categories: ["Backend Systems", "Automation"],
    tags: ["Node.js", "Gemini AI", "WebSockets", "D3.js"],
    heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
  },
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
  {
    id: 3,
    client: "CRYPTOX",
    title: "Global Liquidity Aggregator",
    description: "Real-time order book synchronization across 15+ decentralized exchanges using low-latency execution paths.",
    longDescription: "CryptoX required an aggregator that gathers liquidity from multi-chain pools instantly. We engineered an ultra-fast backend indexer with persistent parallel socket links to fetch and sort orders within microseconds.",
    challenge: "Managing race conditions and fluctuating decentralized gas fees while sorting order depths across isolated blockchain networks.",
    solution: "Constructed local high-capacity in-memory order trees with parallel processing, dynamically routing transaction flows based on current liquidity weights.",
    results: ["Consolidated $1.2B in volume within first month", "Reduced asset slippage rates by 34% globally", "Decreased trade execution times to 12ms"],
    categories: ["Backend Systems", "Web App Development"],
    tags: ["Node.js", "Redis", "Ethers.js"],
    heroImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    client: "AERO",
    title: "Auto-Scaling CI/CD Core",
    description: "Internal developer platform utility that reduced deployment lead times by 65% through intelligent caching.",
    longDescription: "Aero needed to eliminate bottlenecks in their shipping pipelines. Our team replaced traditional centralized pipelines with an auto-scaling, state-aware compiler mesh that isolates cache nodes geographically.",
    challenge: "Resolving dynamic caching invalidation issues and handling compute-heavy binary compilation spikes.",
    solution: "Built container-level caching overlays backed by global key stores, spawning lightweight ephemeral runners instantly on resource demand.",
    results: ["Saved 4,500 developer hours in the first quarter", "91% cache hit rate for repeatable dependency builds", "Infinitely scalable runner overhead capped to active utilization only"],
    categories: ["Automation"],
    tags: ["Python", "Terraform", "GitHub Actions"],
    heroImage: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    client: "SYNAPSE",
    title: "Collaborative Design Engine",
    description: "Real-time multiplayer canvas engine supporting complex SVG manipulation and versioned history.",
    longDescription: "Synapse's interactive workspace demanded fluid, real-time cooperative drawing capabilities for worldwide engineering teams. We delivered an optimized client-side state machine using CRDT algorithms to avoid conflicts.",
    challenge: "Synchronizing intensive SVG and line adjustments among dozens of high-frequency remote contributors while keeping local states responsive.",
    solution: "Coded a high-speed layered canvas rendering pipeline, executing document changes through customized compressed operational actions across active WebSockets.",
    results: ["Flawless collaborative design spaces hosting 50+ concurrent users", "Sub-millisecond latency for domestic and transatlantic cursor syncing", "Uncompromised Undo/Redo tracking across parallel layout lifecycles"],
    categories: ["Web App Development"],
    tags: ["TypeScript", "Canvas API", "CRDT"],
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 6,
    client: "ODYSSEY",
    title: "Data Pipeline Orchestrator",
    description: "Automated ETL workflow manager for multi-terabyte data migration between legacy systems and modern clouds.",
    longDescription: "Odyssey sought absolute data parity when shifting massive records databases into secure cloud environments. Our engineers crafted an intelligent extraction and processing grid that scales automatically.",
    challenge: "Verifying multi-million records sets for relational and schema integrity without shutting down real-time business endpoints.",
    solution: "Designed concurrent server-less parsing structures that read from old systems sequentially, performing background stream-enrichment checks during the transit flow.",
    results: ["Migrated 12TB of customer records with zero data losses", "Completed migration weeks ahead of schedule with zero operational disruptions", "Automatically standardized database structural discrepancies during execution"],
    categories: ["Backend Systems", "Automation"],
    tags: ["Scala", "Kubernetes", "PostgreSQL"],
    heroImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2070&auto=format&fit=crop"
  }
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
      {/* Hero Section with Safely Placed Navigation Elements */}
      <section className="relative h-[80vh] w-full overflow-hidden border-b border-border">
        {/* Safe Back Link element placed cleanly below the fixed header */}
        <div id="case-study-back-btn" className="absolute top-24 md:top-28 left-6 md:left-16 z-30">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-black/70 hover:bg-black rounded-full font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-300 hover:text-accent transition-all duration-300 backdrop-blur-md shadow-lg shadow-black/40 group"
          >
            <ArrowLeft size={12} className="text-accent group-hover:-translate-x-1 transition-transform" /> 
            Back to Homepage
          </Link>
        </div>

        {/* Dynamic Project ID Indicator badge */}
        <div className="absolute top-24 md:top-28 right-6 md:right-16 z-30 hidden md:block select-none font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-500 border border-neutral-800/60 px-3.5 py-1.5 rounded-md bg-neutral-900/40 backdrop-blur-sm">
          Case Study // PR-0{project.id}
        </div>

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
            Book a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
};
