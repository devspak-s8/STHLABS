import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How long does a typical system overhaul take?",
    answer: "Most MVP projects launch within 4-8 weeks. Deep architectural overhauls for enterprise systems typically range from 3-6 months depending on legacy complexity."
  },
  {
    question: "Do you provide ongoing maintenance after deployment?",
    answer: "Yes. We offer 'Engine Health' retainers that include 24/7 monitoring, security patching, and scaling assistance as your user base grows."
  },
  {
    question: "Can you work with our existing legacy tech stack?",
    answer: "Absolutely. We specialize in modernization—safely migrating legacy COBOL or PHP systems to modern, high-performance distributed architectures without downtime."
  },
  {
    question: "What is your security protocol for sensitive financial data?",
    answer: "We implement SOC2-compliant engineering patterns, including zero-trust networking, field-level encryption, and automated vulnerability scanning in our CI/CD pipelines."
  }
];

export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-32 px-6 md:px-16 border-b border-border bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-4">
        <h2 className="font-sans text-3xl md:text-5xl font-medium text-white tracking-tight uppercase">Knowledge Base</h2>
        <span className="font-mono text-xs text-neutral-500 tracking-tighter">[ 08 ]</span>
      </div>

      <div className="max-w-3xl mx-auto border-t border-border">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-border">
            <button
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              className="w-full py-6 md:py-8 flex items-center justify-between group"
            >
              <span className="font-sans text-base md:text-xl text-left text-neutral-300 group-hover:text-white transition-colors uppercase tracking-tight">
                {faq.question}
              </span>
              <div className="ml-4 text-accent shrink-0">
                {activeIndex === i ? <Minus size={18} /> : <Plus size={18} />}
              </div>
            </button>
            <AnimatePresence mode="wait">
              {activeIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 md:pb-8 font-sans text-xs md:text-base text-neutral-500 leading-relaxed max-w-2xl">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};
