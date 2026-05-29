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
    name: "Strategic Launchpad",
    price: 299,
    description: "Get a clear step-by-step game plan, visual maps, and exact costs before you start building.",
    perfectFor: "Validating software features, hosting choice consultation, and product pre-mapping.",
    delivered: "Detailed UI/UX flowchart blueprints, hosting budget cost setup, and a full hacking safety outline.",
    features: ["Custom App Blueprint", "Cheap Hosting Setup", "Pre-Launch Safety Check", "6 Months Free Maintenance Support"],
    details: [
      "Two 1-on-1 calls to talk about your idea and map it out",
      "Easy-to-understand visual outline showing how your app will work",
      "Choosing the safest, cheapest hosts and databases to save you money",
      "A detailed checklist to make sure your website is safe from hackers",
      "A step-by-step plan on how to release your app to the public",
      "6 Months Support: Guidance on deployment hosting updates and platform maintenance patches."
    ]
  },
  {
    name: "Product Accelerator",
    price: 899,
    description: "A complete, beautiful, and ready-to-use custom app or website built from the ground up.",
    perfectFor: "Premium Landing Pages, E-commerce Stores, Corporate Portals, and SaaS MVP frontends.",
    delivered: "Fully coded custom web build, user signup logins, operational database sync, and 6 Months Technical Support.",
    features: ["Fully Built Custom Website", "User Logins & Profiles", "Secure Data Storage", "6 Months Free Maintenance"],
    popular: true,
    details: [
      "Everything in the Strategic Launchpad plan, plus a complete build",
      "A fully coded, ready-to-launch web application built just for your brand",
      "User login screens, profile pages, and account settings setup",
      "A simple, secure database to store your users and app data",
      "Fully tested on mobiles, tablets, and computers to look amazing everywhere",
      "Fast page loading and search engine setup so Google can find your site easily",
      "🛡️ Includes 6 months of comprehensive free technical updates and maintenance."
    ]
  },
  {
    name: "Growth Engine",
    price: 1999,
    description: "Advanced systems for teams, custom staff dashboards, and automatic time-saving tools.",
    perfectFor: "Internal Team Control Boards, Complex Business SaaS, CRM Portal hubs, and Multi-role Apps.",
    delivered: "Custom role dashboards, Stripe or Sheets integration, automated backup mesh, and 6 Months High-Uptime tuning.",
    features: ["Team Admin Dashboards", "Connect with Other Software", "Auto Daily Backups", "6 Months Free Maintenance"],
    details: [
      "Everything in the Product Accelerator plan, built for larger projects",
      "Custom admin panels and tools for your employees to manage the app",
      "Connecting your website with external tools like Google Sheets or Stripe payments",
      "Automatic daily backups so you never lose your important business records",
      "A direct group chat on Slack or WhatsApp for quick advice anytime",
      "Emergency support to make sure your application never goes offline",
      "🛡️ Includes 6 months of premium priority server backups and database maintenance."
    ]
  },
  {
    name: "Software Solutions Consultation",
    price: 10,
    priceMax: 100,
    isConsultationFee: true,
    description: "Expert tactical consultation on software architecture, troubleshooting, and project planning.",
    perfectFor: "Architecture planning, troubleshooting system bugs, or tech stack advisory.",
    delivered: "Interactive whiteboards, custom roadmap diagram, and direct WhatsApp sync channels.",
    features: ["1-on-1 Architect Session", "Urgent Priority Option", "WhatsApp Direct Channel", "Actionable Solution Guide"],
    details: [
      "Custom software planning and tech stack recommendations",
      "Immediate system troubleshooting or bug containment advice",
      "Urgent response priority options available directly from $10 to $100",
      "Get a clear system map and next steps outline to execute yourself"
    ]
  },
  {
    name: "Custom Prototype",
    price: 0,
    isCustom: true,
    description: "Designed for highly specific problems, custom tools, or experimental pilot tests.",
    perfectFor: "Web Scraper bots, spreadsheet scripts, automated schedulers, and single-point diagnostic tools.",
    delivered: "Fully working lightweight microservice script, automated scheduler logs, and 6 Months security patches.",
    features: ["Specific Script Automation", "Experimental Tech Tests", "Data Extraction Tools", "6 Months Free Maintenance"],
    details: [
      "Rapid software fixes made for very specific everyday problems",
      "Custom scripts to safely extract and clean up data from old software",
      "Connecting special smart hardware or scanners to your system",
      "A quick trial build of a new feature to prove it works before investing",
      "Short-term expert support to help solve complex computer puzzles",
      "🛡️ 6 Months Maintenance: Free performance audit and compatibility updates for your custom script."
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

  const coreTiers = tiers.filter(t => !t.isConsultationFee && !t.isCustom);
  const specTiers = tiers.filter(t => t.isConsultationFee || t.isCustom);

  const renderCard = (tier: typeof tiers[0], i: number) => {
    return (
      <motion.div
        key={tier.name}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        className={`flex flex-col p-6 md:p-8 border ${tier.popular ? 'border-accent ring-1 ring-accent' : 'border-border'} bg-surface/30`}
      >
        <div className="mb-6 md:mb-8">
          <h3 className="font-sans text-lg md:text-xl font-medium text-white mb-2 leading-snug">{tier.name}</h3>
          <p className="font-sans text-xs md:text-sm text-neutral-400 h-12 line-clamp-3 md:line-clamp-2">{tier.description}</p>
        </div>

        <div className="mb-6 text-left border-y border-white/10 py-3 space-y-1.5">
          <div className="text-[11px] font-sans leading-relaxed text-neutral-300">
            <strong className="font-mono text-[9px] uppercase tracking-wider text-accent block mb-0.5">Target Scope:</strong>
            {tier.perfectFor}
          </div>
          <div className="text-[11px] font-sans leading-relaxed text-neutral-400">
            <strong className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 block mb-0.5 font-bold">Standard Deliverable:</strong>
            {tier.delivered}
          </div>
          {tier.name !== "Software Solutions Consultation" && (
            <div className="text-[10px] font-mono text-emerald-400/90 flex items-center gap-1 pt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse mr-1 shrink-0" />
              6 Mos Free Maintenance Included
            </div>
          )}
        </div>
        
        <div className="mb-8">
          <div className="text-xl md:text-2xl font-sans font-semibold text-white tracking-tight flex items-baseline gap-1">
            {(() => {
              if (tier.isConsultationFee && tier.priceMax) {
                const symbol = currency === "NGN" ? "₦" : currency === "EUR" ? "€" : "$";
                const minVal = tier.price * rates[currency];
                const maxVal = tier.priceMax * rates[currency];
                return (
                  <span className="text-lg md:text-xl font-bold font-sans text-white">
                    <span className="text-accent/50 text-sm">{symbol}</span>
                    {Math.round(minVal).toLocaleString()} - <span className="text-accent/50 text-sm">{symbol}</span>
                    {Math.round(maxVal).toLocaleString()}
                  </span>
                );
              }
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
          <div className="font-mono text-[9px] md:text-[10px] text-neutral-500 uppercase mt-1">
            {tier.isConsultationFee ? "consultation rate scale" : "Starting deployment"}
          </div>
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
            Book This Tier
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="pricing" className="py-20 md:py-32 px-6 md:px-16 border-b border-border bg-background overflow-hidden animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-sans text-3xl md:text-5xl font-medium text-white tracking-tight uppercase mb-4"
          >
            Investment Tiers
          </motion.h2>
          <p className="font-sans text-neutral-400 text-sm max-w-xl leading-relaxed">
            Straightforward pricing configured around core scope delivery. Uncompromising fidelity in all phases of code.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto shrink-0">
          <span className="font-mono text-xs text-neutral-500 tracking-tighter">[ CURRENCY PROTOCOL ]</span>
          <div className="flex border border-border bg-surface p-1 w-full md:w-auto">
            {(["USD", "EUR", "NGN"] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`flex-1 md:flex-none px-4 py-2 md:px-4 md:py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${currency === curr ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'}`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CORE BUILD PORTFOLIO */}
      <div className="space-y-12">
        <div className="border-b border-white/5 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent font-bold">Core Software Deployments</h4>
          </div>
          <p className="font-sans text-xs text-neutral-500 max-w-xl">
            Complete high-fidelity applications, launchpad guides, and scalable business tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {coreTiers.map((tier, i) => renderCard(tier, i))}
        </div>
      </div>

      {/* SPECIALIST OPERATIONS */}
      <div className="space-y-12 mt-12 md:mt-20">
        <div className="border-b border-white/5 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-bold">Special Operations & Advisories</h4>
          </div>
          <p className="font-sans text-xs text-neutral-500 max-w-xl">
            Tactical support sessions, custom automated scripts, and lightweight experimental prototypes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          {specTiers.map((tier, i) => renderCard(tier, i + 3))}
        </div>
      </div>
    </section>
  );
};
