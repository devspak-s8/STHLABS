import { motion } from "motion/react";
import React, { useState } from "react";

interface StartProjectProps {
  selectedTier: string | null;
}

export const StartProject = ({ selectedTier }: StartProjectProps) => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tier: selectedTier
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <section id="start-project" className="py-20 md:py-32 px-6 md:px-16 border-b border-border bg-[#0a0a0a] overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-4">
        <motion.h2 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-sans text-3xl md:text-5xl font-medium text-white tracking-tight uppercase"
        >
          Initiate Protocol
        </motion.h2>
        <span className="font-mono text-xs text-neutral-500 tracking-tighter">[ 04 ]</span>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto w-full"
      >
        {status === "success" ? (
          <div className="bg-accent/10 border border-accent/20 p-8 text-center">
            <h3 className="text-accent font-sans text-2xl font-medium mb-4 uppercase tracking-tight">Transmission Received</h3>
            <p className="text-neutral-400 font-sans">We've received your requirements. A senior engineer will be in contact shortly.</p>
            <button 
              onClick={() => setStatus("idle")} 
              className="mt-8 text-white font-mono text-xs underline uppercase tracking-widest"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className="space-y-6 md:space-y-10" onSubmit={handleSubmit}>
            {selectedTier && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-accent/10 border border-accent/20 p-4 mb-4 flex items-center justify-between"
              >
                <div className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-accent">Selected Configuration</div>
                <div className="font-sans text-xs md:text-sm font-medium text-white">{selectedTier}</div>
              </motion.div>
            )}
            
            <div className="space-y-3 md:space-y-4">
              <label className="block font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Contact Identity</label>
              <input 
                required
                type="text" 
                placeholder="Your Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-surface/50 border-b border-border p-4 font-sans text-white focus:outline-none focus:border-accent transition-colors rounded-none" 
              />
            </div>
            <div className="space-y-3 md:space-y-4">
              <label className="block font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Secure Channel (Email)</label>
              <input 
                required
                type="email" 
                placeholder="email@address.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-surface/50 border-b border-border p-4 font-sans text-white focus:outline-none focus:border-accent transition-colors rounded-none" 
              />
            </div>
            <div className="space-y-3 md:space-y-4">
              <label className="block font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Project Brief</label>
              <textarea 
                required
                placeholder="Describe the systems design requirements..." 
                rows={4} 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-surface/50 border-b border-border p-4 font-sans text-white focus:outline-none focus:border-accent transition-colors resize-none rounded-none" 
              />
            </div>
            
            {status === "error" && (
              <p className="text-red-500 font-mono text-[10px] uppercase tracking-widest">Error: Transmission interrupted. Please retry.</p>
            )}

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={status === "sending"}
              className={`w-full font-mono text-xs font-medium py-5 uppercase tracking-widest transition-all duration-300 ${
                status === "sending" ? "bg-accent/50 text-black cursor-not-allowed" : "bg-white text-black hover:bg-accent"
              }`}
            >
              {status === "sending" ? "Transmitting..." : "Transmit Requirements"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </section>
  );
};
