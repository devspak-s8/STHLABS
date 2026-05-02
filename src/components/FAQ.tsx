import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How long does a typical project take?",
    answer: "Most small projects are ready in 4-8 weeks. Larger, more complex custom software can take between 3-6 months depending on what you need built."
  },
  {
    question: "Do you offer support after the site is finished?",
    answer: "Yes, we provide ongoing support and maintenance packages to keep your software running smoothly, handle updates, and fix any issues that pop up."
  },
  {
    question: "Can you help me update my old website or software?",
    answer: "Definitely. We specialize in taking older systems and giving them a fresh, modern update that works better and faster."
  },
  {
    question: "Is my data and project secure?",
    answer: "Security is our top priority. We use modern industry standards to protect your data and ensure your application is safe from unauthorized access."
  }
];

export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-32 px-6 md:px-16 border-b border-border bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-4">
        <h2 className="font-sans text-3xl md:text-5xl font-medium text-white tracking-tight uppercase">Common Questions</h2>
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
