import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Zap, Cpu, Shield, Activity, Database, GitBranch } from "lucide-react";

const tiers = [
  {
    name: "Strategic Launchpad",
    price: 1200,
    icon: <Cpu className="w-8 h-8 text-accent" />,
    description: "A solid plan for your project's foundation and growth.",
    longDescription: "Our Launchpad service is for founders who want to get things right from day one. We analyze your requirements to ensure your product is built for scale, security, and long-term success.",
    modules: [
      {
        title: "Product Roadmap",
        desc: "A clear visual plan of your project's features, data flow, and third-party integrations.",
      },
      {
        title: "Technology Strategy",
        desc: "Selecting the best-fit database, language, and hosting providers for your specific needs.",
      },
      {
        title: "Security Planning",
        desc: "Designing secure data handling and user authentication protocols to keep your business safe.",
      },
      {
        title: "Growth Strategy",
        desc: "A phase-by-phase development plan with clear timelines and recommended resources.",
      }
    ]
  },
  {
    name: "Product Accelerator",
    price: 3500,
    icon: <Zap className="w-8 h-8 text-accent" />,
    popular: true,
    description: "A complete, high-performance product built to grow.",
    longDescription: "We build more than just MVPs. We build reliable, fast, and secure products that allow you to focus on growing your business without worrying about technical debt.",
    modules: [
      {
        title: "Custom Development",
        desc: "Full-scale building of your web application using modern, high-performance frameworks.",
      },
      {
        title: "Feature Development",
        desc: "Building out the core functionality your users need with clean, maintainable code.",
      },
      {
        title: "Database Setup",
        desc: "Designing and implementing a database that can handle your users and data reliably.",
      },
      {
        title: "Automated Launch",
        desc: "Setting up professional deployment pipelines for seamless, worry-free updates.",
      }
    ]
  },
  {
    name: "Growth Engine",
    price: 8500,
    icon: <Shield className="w-8 h-8 text-accent" />,
    description: "Enterprise software for complex business needs and high traffic.",
    longDescription: "For growing teams and established companies. We build custom internal tools, complex integrations, and large-scale systems that turn fragmented processes into high-performance engines.",
    modules: [
      {
        title: "Advanced Dashboards",
        desc: "Custom internal software and management tools designed specifically for your team's workflow.",
      },
      {
        title: "System Integration",
        desc: "Connecting your custom software with your current tools, ERPs, and external platforms.",
      },
      {
        title: "Monitoring & Uptime",
        desc: "Real-time alerts and professional oversight to ensure your systems never go dark.",
      },
      {
        title: "Priority Partnership",
        desc: "Direct access to our senior team for continuous improvement and high-priority requests.",
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
          Back to Home
        </Link>

        <header className="mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-sans font-bold text-white mb-6 uppercase tracking-tight"
          >
            Tier <span className="text-accent underline">Details</span>
          </motion.h1>
          <p className="text-neutral-400 text-lg md:text-xl font-sans max-w-2xl leading-relaxed">
            Every project begins with understanding your goals. Choose the tier that matches your current business needs.
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
                  Start Project
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
