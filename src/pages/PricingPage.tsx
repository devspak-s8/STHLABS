import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Zap, Cpu, Shield, Activity, Database, GitBranch } from "lucide-react";

const tiers = [
  {
    name: "System Blueprint",
    price: 500,
    icon: <Cpu className="w-8 h-8 text-accent" />,
    description: "Deep-level architectural planning for complex systems.",
    longDescription: "Our Blueprint service is for founders who need a rock-solid foundation before a single line of code is written. We analyze your requirements through the lens of scalability, security, and maintainability.",
    modules: [
      {
        title: "Infrastructure Mapping",
        desc: "High-level visual representation of your system's components, data flow, and external integrations.",
      },
      {
        title: "Tech Stack Validation",
        desc: "Selecting the optimal database (PostgreSQL, Redis, Vector), language (Go, Node.js), and cloud provider (GCP, AWS).",
      },
      {
        title: "Security & Compliance",
        desc: "Drafting zero-trust architecture protocols and ensuring your roadmap meets industry standards (SOC2, GDPR ready).",
      },
      {
        title: "Execution Roadmap",
        desc: "A phase-by-phase development plan with estimated timelines and resource requirements.",
      }
    ]
  },
  {
    name: "Core MVP",
    price: 1500,
    icon: <Zap className="w-8 h-8 text-accent" />,
    popular: true,
    description: "Full-cycle engineering of a functional, production-ready product.",
    longDescription: "We don't build typical 'low-code' MVPs. We build hardened server-side engines and fluid client interfaces designed to survive their first 10,000 users without refactoring.",
    modules: [
      {
        title: "Full-Stack Development",
        desc: "End-to-end implementation using React/Vite and specialized backend frameworks.",
      },
      {
        title: "API Orchestration",
        desc: "REST or GraphQL API cores with automated documentation and type-safety.",
      },
      {
        title: "Database Engineering",
        desc: "Advanced schema design, indexing strategies, and automated migrations.",
      },
      {
        title: "CI/CD & DevOps",
        desc: "Automated testing and deployment pipelines for zero-downtime releases.",
      }
    ]
  },
  {
    name: "Enterprise Engine",
    price: 5000,
    icon: <Shield className="w-8 h-8 text-accent" />,
    description: "Multi-service infrastructure for large-scale organizational systems.",
    longDescription: "For scale-ups and enterprises, we provide orchestration for fragmented systems. We turn complexity into a unified, high-performance engine using microservices and custom internal tooling.",
    modules: [
      {
        title: "Microservices Architecture",
        desc: "Decoupled services communicating via gRPC or message queues for maximum fault tolerance.",
      },
      {
        title: "Global Scalability",
        desc: "Multi-region deployments and edge computing setup for global low-latency.",
      },
      {
        title: "Advanced Observability",
        desc: "Real-time monitoring, distributed tracing, and automated alerting systems.",
      },
      {
        title: "Custom Integrations",
        desc: "Deep-level connections with legacy systems, ERPs, and complex third-party platforms.",
      }
    ]
  }
];

export const PricingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background py-20 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-accent font-mono text-xs uppercase tracking-widest mb-12 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </Link>

        <header className="mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-sans font-bold text-white mb-6 uppercase tracking-tight"
          >
            Tier <span className="text-accent underline">Breakdown</span>
          </motion.h1>
          <p className="text-neutral-400 text-lg md:text-xl font-sans max-w-2xl leading-relaxed">
            Every project begins with a protocol assessment. Choose the tier that matches your system's current complexity requirements.
          </p>
        </header>

        <div className="space-y-12 md:space-y-24">
          {tiers.map((tier, idx) => (
            <motion.section 
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-8 md:p-16 border border-border bg-surface/30 flex flex-col lg:flex-row gap-12"
            >
              {tier.popular && (
                <div className="absolute top-0 right-12 -translate-y-1/2 bg-accent text-black px-4 py-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                  Highly Requested
                </div>
              )}

              <div className="lg:w-1/3">
                <div className="mb-8">{tier.icon}</div>
                <h2 className="text-3xl font-sans font-bold text-white mb-4 uppercase">{tier.name}</h2>
                <div className="text-4xl font-sans font-bold text-white mb-6">${tier.price.toLocaleString()}</div>
                <p className="text-neutral-400 font-sans leading-relaxed mb-8">
                  {tier.longDescription}
                </p>
                <button 
                  onClick={() => navigate(`/?tier=${encodeURIComponent(tier.name)}#start-project`)}
                  className="w-full bg-white text-black py-4 font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors"
                >
                  Initiate Project
                </button>
              </div>

              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                {tier.modules.map((module, i) => (
                  <div key={i} className="p-6 border border-border/50 bg-background/50 hover:border-accent/30 transition-colors">
                    <h3 className="text-white font-sans font-bold mb-3 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                      {module.title}
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      {module.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        <section className="mt-32 p-12 border border-accent/20 bg-accent/5">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-sans font-bold text-white mb-4 uppercase">Need a custom hardware-software protocol?</h3>
              <p className="text-neutral-400 font-sans">
                Our "Custom Prototype" tier handles one-off scripts, experimental research, and rapid pilot tools targeting specific edge-cases.
              </p>
            </div>
            <div className="md:w-1/3 text-right">
              <button 
                onClick={() => navigate("/?tier=Custom#start-project")}
                className="px-8 py-4 border border-white text-white font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
              >
                Request Custom Protocol
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
