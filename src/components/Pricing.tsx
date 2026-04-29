import { motion, useSpring, useTransform, animate } from "motion/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
  }, [value]);

  return <span>{Math.round(displayValue).toLocaleString()}</span>;
};

const rates = {
  USD: 1,
  EUR: 0.92,
  NGN: 1550,
};

const tiers = [
  {
    name: "System Blueprint",
    price: 1500,
    description: "Architectural consultation and technical design documentation.",
    features: ["System Architecture Design", "Tech Stack Selection", "Security Audit Plan", "Scalability Roadmap"],
    details: [
      "Discovery sessions with senior architects",
      "Full infrastructure diagram (High Level)",
      "Detailed technology selection report",
      "Database schema & API modeling",
      "Draft security protocols & compliance check"
    ]
  },
  {
    name: "Core MVP",
    price: 4500,
    description: "Complete engineering of a production-ready minimum viable product.",
    features: ["Custom Web/Mobile App", "Scalable Backend", "CI/CD Pipeline", "Basic Security Setup"],
    popular: true,
    details: [
      "Everything in Blueprint + Implementation",
      "Fully functional cross-platform application",
      "Express/Node.js or Go backend build",
      "PostgreSQL/Redis database orchestration",
      "Automated deployment workflows (CI/CD)",
      "Initial load testing and optimization"
    ]
  },
  {
    name: "Enterprise Engine",
    price: 12000,
    description: "Full-scale system engineering for complex organizational needs.",
    features: ["Complex Integrations", "High-Load Optimization", "Custom Automations", "Dedicated Support"],
    details: [
      "Everything in MVP + Enterprise Features",
      "Microservices architecture implementation",
      "Advanced Kubernetes orchestration",
      "Zero-trust security implementation",
      "Custom internal tooling & dashboards",
      "24/7 uptime monitoring & auto-scaling",
      "Dedicated senior engineering team"
    ]
  },
  {
    name: "Custom Prototype",
    price: 0,
    isCustom: true,
    description: "Tailored engineering for specific one-off research or pilot tools.",
    features: ["One-off Scripts", "Research Prototypes", "Manual Integrations", "Fixed Scope Build"],
    details: [
      "Highly specific experimental projects",
      "Rapid hardware-software integrations",
      "Legacy system data extraction scripts",
      "Proof of concept for niche technologies",
      "Short-term specialized engineering"
    ]
  }
];

interface PricingProps {
  onSelectTier: (tierName: string) => void;
}

export const Pricing = ({ onSelectTier }: PricingProps) => {
  const [currency, setCurrency] = useState<keyof typeof rates>("USD");

  const getPriceComponents = (price: number, isCustom?: boolean) => {
    if (isCustom) return { prefix: "", value: null, suffix: "Custom" };
    const converted = price * rates[currency];
    const symbol = currency === "NGN" ? "₦" : currency === "EUR" ? "€" : "$";
    return { prefix: symbol, value: converted, suffix: "" };
  };

  const scrollToContact = (tierName: string) => {
    onSelectTier(tierName);
    document.getElementById('start-project')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="py-20 md:py-32 px-6 md:px-16 border-b border-border bg-background overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-8">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-sans text-3xl md:text-5xl font-medium text-white tracking-tight uppercase"
        >
          Investment tiers
        </motion.h2>
        <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
          <span className="font-mono text-xs text-neutral-500 tracking-tighter">[ 05 ]</span>
          <div className="flex border border-border bg-surface p-1 w-full md:w-auto">
            {(["USD", "EUR", "NGN"] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`flex-1 md:flex-none px-4 py-2 md:px-3 md:py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  currency === curr ? "bg-white text-black" : "text-neutral-500 hover:text-white"
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`flex flex-col p-6 md:p-8 border ${tier.popular ? 'border-accent ring-1 ring-accent' : 'border-border'} bg-surface/30`}
          >
            <div className="mb-6 md:mb-8">
              <h3 className="font-sans text-lg md:text-xl font-medium text-white mb-2">{tier.name}</h3>
              <p className="font-sans text-xs md:text-sm text-neutral-400 h-12 line-clamp-3 md:line-clamp-2">{tier.description}</p>
            </div>
            
            <div className="mb-8">
              <div className="text-2xl md:text-3xl font-sans font-semibold text-white tracking-tight flex items-baseline gap-1">
                {(() => {
                  const { prefix, value, suffix } = getPriceComponents(tier.price, tier.isCustom);
                  if (value === null) return <span>{suffix}</span>;
                  return (
                    <>
                      <span className="text-xl md:text-2xl text-accent/50">{prefix}</span>
                      <AnimatedNumber value={value} />
                    </>
                  );
                })()}
              </div>
              <div className="font-mono text-[9px] md:text-[10px] text-neutral-500 uppercase mt-1">Starting deployment</div>
            </div>

            <div className="mb-4 font-mono text-[10px] text-accent uppercase tracking-widest">
              <AnimatedNumber value={tier.features.length} /> Modules Included
            </div>

            <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8 flex-grow">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-accent mt-1.5 shrink-0" />
                  <span className="font-sans text-xs md:text-sm text-neutral-300">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <Link 
                to="/pricing"
                className="w-full py-3 border border-border text-neutral-400 font-mono text-[9px] uppercase tracking-widest hover:text-white hover:border-neutral-500 transition-colors text-center"
              >
                View Full Breakdown
              </Link>
              <button 
                onClick={() => scrollToContact(tier.name)}
                className={`w-full py-4 font-mono text-[10px] font-medium uppercase tracking-widest transition-colors ${
                  tier.popular ? 'bg-accent text-black hover:bg-white' : 'bg-white text-black hover:bg-accent'
                }`}
              >
                Select Tier
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
