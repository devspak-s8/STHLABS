import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Zap, Cpu, Shield, Activity, Database, GitBranch } from "lucide-react";

const tiers = [
  {
    name: "Strategic Launchpad",
    price: 299,
    icon: <Cpu className="w-8 h-8 text-accent" />,
    description: "Get a clear step-by-step game plan, visual maps, and exact costs before you start building.",
    longDescription: "Our Launchpad service helps you map out your entire app before writing any code. We outline everything simply and clearly so you know exactly how it will work, what it will cost, and the easiest way to launch it without costly mistakes.",
    modules: [
      {
        title: "Step-by-Step Game Plan",
        desc: "A clear visual path showing exactly what features your app will have and how users will navigate through it.",
      },
      {
        title: "Hosting & Tools Selector",
        desc: "We help you pick the cheapest, fastest, and most reliable website hosts and database tools for your budget.",
      },
      {
        title: "Safety & Security Outline",
        desc: "A custom checklist to make sure your users' data stays safe and protected from unwanted access from day one.",
      },
      {
        title: "Future Launch Guide",
        desc: "A stage-by-stage guide showing clear construction timelines and simple setup steps to go live.",
      }
    ]
  },
  {
    name: "Product Accelerator",
    price: 899,
    icon: <Zap className="w-8 h-8 text-accent" />,
    popular: true,
    description: "A complete, beautiful, and ready-to-use custom app or website built from the ground up.",
    longDescription: "We build beautiful, fast, and secure web applications ready for your first customers. Instead of a messy draft, you get a premium, fully-coded product built to look stunning on computers and phones alike.",
    modules: [
      {
        title: "Custom Coding & Design",
        desc: "Building and designing your entire website or web app from scratch, tailored perfectly to match your business look.",
      },
      {
        title: "User Accounts & Logins",
        desc: "Setting up secure registration pages, profile layouts, and seamless member areas for your visitors.",
      },
      {
        title: "Safe Storage Database",
        desc: "A clean, efficient database that securely saves your customer records, text, images, and other app information.",
      },
      {
        title: "Automatic Update Pipeline",
        desc: "Setting up professional launch systems that let you apply edits and update your site effortlessly with a single click.",
      }
    ]
  },
  {
    name: "Growth Engine",
    price: 1999,
    icon: <Shield className="w-8 h-8 text-accent" />,
    description: "Advanced systems for teams, custom staff dashboards, and automatic time-saving tools.",
    longDescription: "For growing teams and businesses with specific operations. We build custom staff control panels, link your systems together, and automate repetitive tasks to save your business hours of tedious admin work.",
    modules: [
      {
        title: "Custom Staff Control Panels",
        desc: "A private, beautiful admin board for you and your staff to easily review user activity, view reports, and run the app.",
      },
      {
        title: "Connecting Your Apps",
        desc: "We hook your custom website directly into your current daily tools like Google Sheets, payment setups like Stripe, or CRMs.",
      },
      {
        title: "Safety Audits & Backups",
        desc: "Automatic daily backups and premium health checks to make sure your valuable files and business info are always safe.",
      },
      {
        title: "Direct Creator Access",
        desc: "Dedicated project help including a private Slack or WhatsApp chat directly with our creators for priority assistance.",
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
                  Book This Project
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
                Book Custom Protocol
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
