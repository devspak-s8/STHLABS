import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowUpRight, BarChart3, ShieldCheck, Zap } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const works = [
  {
    client: "AURA HORIZON",
    category: "Web App Development",
    title: "Hyper-personalized travel itinerary coordinator with multi-checkpoint booking models and customized offline portfolios.",
    caseStudyId: 7,
    stats: [
      { label: "Checkpoints", value: "24+" },
      { label: "Render Cost", value: "-55%" },
      { label: "Guest Satisfaction", value: "99.7%" }
    ],
    challenges: "Seamlessly coordinating complex multi-checkpoint travel itineraries with zero network latency, alongside live on-the-ground validation of premium hospitality boutique assets, flight coordinates, and unpredictable air transit routes.",
    solutions: "Engineered a real-time reactive itinerary coordinator utilizing state-dynamic relational calculations and high-fidelity local cache components, optimized with native IndexedDB buffers to maintain smooth performance.",
    results: "Synchronized 24+ complex multi-destination flight vectors simultaneously under 100ms and reduced custom travel portfolio rendering times by 55% for premium agents.",
    chartData: [
      { time: 'Q1', value: 82 },
      { time: 'Q2', value: 91 },
      { time: 'Q3', value: 95 },
      { time: 'Q4', value: 99 },
    ],
    accent: "#00FF90"
  },
  {
    client: "AURELIA",
    category: "Web App Development",
    title: "Elite digital architectural showroom featuring real-time sliding-scale mortgage calculations and high-fidelity dropdowns.",
    caseStudyId: 8,
    stats: [
      { label: "Estimate Accur.", value: "99.8%" },
      { label: "Active Listings", value: "12+" },
      { label: "User Stay Rate", value: "+60%" }
    ],
    challenges: "Building highly granular, real-time client-side mortgage estimators loaded with taxation metrics, nested inside an elite aesthetic with fluid transitions and flawless hover dynamics.",
    solutions: "Developed modular mathematical components mapped directly to interactive slider actions, nested inside custom page transitions built using Hardware-Accelerated motion structures and custom coordinate maps.",
    results: "Achieved a audited 99.8% mortgage accuracy across 12 estate properties and created 100% responsive fluid layout navigation across all displays, lifting stay session lengths by 60%.",
    chartData: [
      { time: 'Jan', value: 120 },
      { time: 'Feb', value: 180 },
      { time: 'Mar', value: 240 },
      { time: 'Apr', value: 345 },
    ],
    accent: "#FF007F"
  },
  {
    client: "FLEETFLOW",
    category: "Backend Systems",
    title: "Robust Logistics & Fleet Management Coordinator with Google Gemini route calculations and physical maintenance registers.",
    caseStudyId: 9,
    stats: [
      { label: "Route Savings", value: "+22%" },
      { label: "Telemetry Lat.", value: "<1.2s" },
      { label: "Inspect. Checklists", value: "1,200+" }
    ],
    challenges: "Visualizing high-frequency real-time telemetry (driver coordinates, speed gauges, battery percentage drops) from active haulers while calling Google Gemini AI for fluid routing under heavy operational loads.",
    solutions: "Created a fully responsive interactive telemetry map widget backed by secure buffer states, incorporating custom driver dispatch panels and physical registers for scheduling and tracking brake or oil repairs.",
    results: "Boosted fleet routing efficiency by 22% using custom AI pathways and successfully cataloged 1,200+ detailed mechanic service inspections with zero missing inputs.",
    chartData: [
      { time: 'Wk-1', value: 72 },
      { time: 'Wk-2', value: 78 },
      { time: 'Wk-3', value: 85 },
      { time: 'Wk-4', value: 94 },
    ],
    accent: "#E2FE30"
  },
  {
    client: "NeuroSync",
    category: "distributed systems",
    title: "High-frequency biometric data processing engine handling 100k+ ops/sec.",
    caseStudyId: 1,
    stats: [
      { label: "Throughput", value: "120k/s" },
      { label: "Avg Latency", value: "0.8ms" },
      { label: "Uptime", value: "99.999%" }
    ],
    challenges: "Handling extreme data velocity from millions of medical-grade wearable devices while maintaining sub-millisecond consistency for critical health alerts.",
    solutions: "We implemented a custom distributed stream processing engine using Rust-based workers and highly optimized message queuing, bypass traditional overheads.",
    results: "Achieved a 40% reduction in end-to-end latency and sustained 99.999% reliability during a 500% surge in device connectivity.",
    chartData: [
      { time: 'T-6', value: 2.4 },
      { time: 'T-5', value: 2.1 },
      { time: 'T-4', value: 1.8 },
      { time: 'T-3', value: 1.2 },
      { time: 'T-2', value: 0.9 },
      { time: 'T-1', value: 0.8 },
      { time: 'Now', value: 0.75 },
    ],
    accent: "#00F0FF"
  },
  {
    client: "Arch-V",
    category: "fintech infrastructure",
    title: "Secure transaction validation layer for multi-chain asset management.",
    caseStudyId: 2,
    stats: [
      { label: "Asset Volume", value: "$500M+" },
      { label: "Chains", value: "12+" },
      { label: "Breaches", value: "0" }
    ],
    challenges: "Security bottlenecks in multi-chain environments where inconsistent protocol implementations led to delayed validations and potential attack vectors.",
    solutions: "Engineered a tiered validation architecture featuring HSM-backed signing and isolated RPC nodes to ensure cryptographic absolute-truth across all supported chains.",
    results: "Validated over $500 million in digital assets without a single security incident or failed reconciliation in over 18 months of operation.",
    chartData: [
      { time: 'Q1', value: 45 },
      { time: 'Q2', value: 120 },
      { time: 'Q3', value: 280 },
      { time: 'Q4', value: 500 },
    ],
    accent: "#7000FF"
  },
  {
    client: "SolarIQ",
    category: "industrial iot",
    title: "Real-time energy grid optimization and monitoring dashboard for smart cities.",
    caseStudyId: 3,
    stats: [
      { label: "Sensors", value: "450k" },
      { label: "Efficiency", value: "+15%" },
      { label: "Districts", value: "3" }
    ],
    challenges: "Consolidating data from nearly half a million disparate IoT sensors into a unified control interface that operators could use to make split-second decisions.",
    solutions: "Developed an edge-computing layer for local data filtering and a high-performance WebSocket-driven dashboard for real-time visualization of grid health.",
    results: "Recognized as the primary optimization engine for three major city districts, delivering a verified 15% increase in overall grid efficiency and response times.",
    chartData: [
      { time: 'Jan', value: 72 },
      { time: 'Feb', value: 75 },
      { time: 'Mar', value: 79 },
      { time: 'Apr', value: 84 },
      { time: 'May', value: 87 },
    ],
    accent: "#F0FF00"
  }
];

const logos = [
  "NEURO", "ARCH-V", "SOLARIQ", "AURA", "AURELIA", "FLEETFLOW", "VECTOR", "CRYPTOX", "LUMINA", "SYNAPSE", "ORBITAL"
];

export const SelectedWork = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section id="work" className="py-20 md:py-32 px-6 md:px-16 border-b border-border bg-background overflow-hidden">
      {/* Logos Marquee */}
      <div className="mb-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-16 md:gap-32 items-center text-neutral-800"
        >
          {[...logos, ...logos].map((logo, i) => (
            <span 
              key={i} 
              className="font-sans text-2xl md:text-3xl font-black tracking-tighter hover:text-neutral-700 transition-colors cursor-default"
            >
              {logo}
            </span>
          ))}
        </motion.div>
      </div>

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

      <div className="space-y-4">
        {works.map((work, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`group border border-border overflow-hidden transition-all duration-500 ${
              expandedIndex === i ? "bg-surface/30 border-white/20" : "bg-background hover:bg-surface/10"
            }`}
          >
            {/* Header Content */}
            <div 
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="flex flex-col lg:flex-row lg:items-center justify-between p-6 md:p-10 cursor-pointer gap-6"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1 min-w-0">
                {/* Deployment Picture Thumbnail */}
                <div className="w-full md:w-48 h-32 md:h-24 overflow-hidden border border-white/10 bg-neutral-900 flex-shrink-0 relative">
                  <img 
                    src={
                      work.caseStudyId === 7 ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" :
                      work.caseStudyId === 8 ? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" :
                      work.caseStudyId === 9 ? "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" :
                      work.caseStudyId === 1 ? "https://images.unsplash.com/photo-1611974714851-eb6077e69b05?q=80&w=2070&auto=format&fit=crop" :
                      work.caseStudyId === 2 ? "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" :
                      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2070&auto=format&fit=crop"
                    } 
                    alt={`${work.client} Deployment Preview`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4">
                    <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-accent">{work.client}</span>
                    <span className="hidden md:block w-1 h-1 bg-neutral-700 rounded-full" />
                    <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-neutral-500">{work.category}</span>
                  </div>
                  <h3 className={`font-sans text-base md:text-xl font-medium transition-colors leading-relaxed ${
                    expandedIndex === i ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"
                  }`}>
                    {work.title}
                  </h3>
                </div>
              </div>
              
              <div className="mt-4 lg:mt-0 flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto shrink-0 border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                <div className={`hidden md:flex gap-8 mr-8 transition-opacity duration-300 ${expandedIndex === i ? "opacity-0" : "opacity-100"}`}>
                  {work.stats.slice(0, 2).map((stat, idx) => (
                    <div key={idx} className="text-right">
                      <div className="font-mono text-[10px] text-neutral-600 uppercase mb-1">{stat.label}</div>
                      <div className="font-sans text-sm font-bold text-neutral-300">{stat.value}</div>
                    </div>
                  ))}
                </div>
                <div className={`p-3 rounded-full border transition-all duration-300 ${
                  expandedIndex === i ? "bg-accent border-accent text-black rotate-90" : "border-neutral-800 text-neutral-500 group-hover:border-neutral-700"
                }`}>
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <div className="px-6 md:px-10 pb-10 border-t border-white/5 pt-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Left Side: Details */}
                      <div className="space-y-10">
                        <div className="grid grid-cols-3 gap-4">
                          {work.stats.map((stat, idx) => (
                            <div key={idx} className="p-4 bg-background/50 border border-white/5">
                              <div className="font-mono text-[9px] text-neutral-500 uppercase mb-2 tracking-widest">{stat.label}</div>
                              <div className="font-sans text-lg md:text-xl font-bold text-white">{stat.value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-6">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-red-500/10 flex items-center justify-center border border-red-500/20">
                              <Zap className="text-red-500" size={18} />
                            </div>
                            <div>
                              <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">The Challenge</h4>
                              <p className="font-sans text-sm md:text-base text-neutral-300 leading-relaxed">{work.challenges}</p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-accent/10 flex items-center justify-center border border-accent/20">
                              <BarChart3 className="text-accent" size={18} />
                            </div>
                            <div>
                              <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Our Solution</h4>
                              <p className="font-sans text-sm md:text-base text-neutral-300 leading-relaxed">{work.solutions}</p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-500/10 flex items-center justify-center border border-green-500/20">
                              <ShieldCheck className="text-green-500" size={18} />
                            </div>
                            <div>
                              <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-2">The Result</h4>
                              <p className="font-sans text-sm md:text-base text-neutral-300 leading-relaxed">{work.results}</p>
                            </div>
                          </div>
                        </div>

                        <Link 
                          to={`/case-study/${work.caseStudyId}`}
                          className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-accent hover:text-white transition-colors group"
                        >
                          View Full Documentation <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                      </div>

                      {/* Right Side: Visualization */}
                      <div className="h-[300px] lg:h-full min-h-[350px] bg-black/40 border border-white/5 p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                          <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Performance Visualization</h4>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: work.accent }} />
                             <span className="font-mono text-[9px] uppercase text-neutral-400">Live Metric</span>
                          </div>
                        </div>
                        
                        <div className="flex-grow h-[240px] w-full relative min-h-0 min-w-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={work.chartData}>
                              <defs>
                                <linearGradient id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={work.accent} stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor={work.accent} stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                              <XAxis 
                                dataKey="time" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} 
                                dy={10}
                              />
                              <YAxis hide domain={['auto', 'auto']} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '10px', fontFamily: 'monospace' }} 
                                itemStyle={{ color: work.accent }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke={work.accent} 
                                fillOpacity={1} 
                                fill={`url(#gradient-${i})`} 
                                strokeWidth={2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                          <p className="font-mono text-[9px] text-neutral-600 leading-tight italic">
                            * Data aggregated from deployment period. Real-time metrics available upon request for verified clients.
                          </p>
                          <div className="flex justify-end gap-1">
                            {[1, 2, 3, 4, 5].map((dot) => (
                              <div key={dot} className="w-1 h-3 bg-neutral-800" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

