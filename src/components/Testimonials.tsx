import { motion } from "motion/react";

const quotes = [
  {
    author: "Elena Vance",
    role: "Proprietor, Vance & Co.",
    content: "The team at QUETTRIX didn't just build our website; they made the whole process simple and stress-free. Our new platform works perfectly even when we're busy."
  },
  {
    author: "Marcus Thorne",
    role: "Founder, Thorne Creative",
    content: "Professional, straightforward, and highly skilled. They built exactly what we needed without any tech jargon. Truly great to work with."
  },
  {
    author: "Sarah Jenkins",
    role: "Director, Peak Performance",
    content: "The new internal tools they built have saved our team hours of work every week. It was a great investment for our business."
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 md:py-32 px-6 md:px-16 border-b border-border bg-surface/10 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-4">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-sans text-3xl md:text-5xl font-medium text-white tracking-tight uppercase"
        >
          What People Say
        </motion.h2>
        <span className="font-mono text-xs text-neutral-500 tracking-tighter">[ 07 ]</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border border border-border">
        {quotes.map((quote, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 md:p-12 bg-background flex flex-col justify-between"
          >
            <div className="mb-8 md:mb-10">
              <span className="text-3xl md:text-4xl font-serif text-accent opacity-50">"</span>
              <p className="font-sans text-base md:text-lg text-neutral-300 leading-relaxed italic -mt-4">
                {quote.content}
              </p>
            </div>
            <div>
              <div className="font-sans font-medium text-white text-sm md:text-base">{quote.author}</div>
              <div className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500 mt-1">{quote.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
