import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
import { Loader2, CheckCircle2, X } from "lucide-react";

interface StartProjectProps {
  selectedTier: string | null;
}

export const StartProject = ({ selectedTier }: StartProjectProps) => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setStatus("sending");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tier: selectedTier
        }),
      });

      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.success) {
          setStatus("success");
        } else {
          setErrorMessage(data.error || "We encountered a protocol error during transmission.");
          setStatus("error");
        }
      } else if (response.ok) {
        // If response is OK but not JSON, it means Vercel routed to the frontend index.html fallback
        setErrorMessage("Transmission endpoint not found (HTML returned). Check server configuration in Vercel.");
        setStatus("error");
      } else {
        let errorMsg = "We encountered a protocol error during transmission.";
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } else {
          errorMsg = `Server error ${response.status}: Endpoint is incorrectly configured.`;
        }
        setErrorMessage(errorMsg);
        setStatus("error");
      }
    } catch (error) {
      setErrorMessage("Network error: Connection to the server could not be established.");
      setStatus("error");
    }
  };

  const closeModals = () => {
    if (status === "success") {
      setFormData({ name: "", email: "", message: "" });
    }
    setStatus("idle");
  };

  return (
    <section id="start-project" className="py-20 md:py-32 px-6 md:px-16 border-b border-border bg-[#0a0a0a] overflow-hidden">
      {/* Loading/Status Modals */}
      <AnimatePresence>
        {status !== "idle" && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={status !== "sending" ? closeModals : undefined}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface border border-border p-8 md:p-12 text-center"
            >
              {status === "sending" && (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <Loader2 className="text-accent animate-spin w-12 h-12" />
                    <div className="absolute inset-0 blur-xl bg-accent/20 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-white font-sans text-xl font-bold uppercase tracking-widest mb-2">Transmitting Data</h3>
                    <p className="text-neutral-500 font-mono text-[10px] uppercase">Securing uplink channel...</p>
                  </div>
                </div>
              )}

              {status === "success" && (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-black w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-white font-sans text-2xl font-bold uppercase tracking-tight mb-4">Message Sent</h3>
                    <p className="text-neutral-400 font-sans text-sm leading-relaxed mb-8">
                      We have received your project details. Our team will review them and get back to you within 24 hours.
                    </p>
                    <button 
                      onClick={closeModals}
                      className="w-full bg-white text-black py-4 font-mono text-xs uppercase font-bold tracking-widest hover:bg-accent transition-colors"
                    >
                      Back to Site
                    </button>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="text-white w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-white font-sans text-2xl font-bold uppercase tracking-tight mb-4">Send Failed</h3>
                    <p className="text-neutral-400 font-sans text-sm leading-relaxed mb-8">
                      {errorMessage || "There was an error sending your message. Please check your connection and try again."}
                    </p>
                    <button 
                      onClick={closeModals}
                      className="w-full bg-red-500 text-white py-4 font-mono text-xs uppercase font-bold tracking-widest hover:bg-red-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-4">
        <motion.h2 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-sans text-3xl md:text-5xl font-medium text-white tracking-tight uppercase"
        >
          Work With Us
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
        <form className="space-y-6 md:space-y-10" onSubmit={handleSubmit}>
            {selectedTier && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-accent/10 border border-accent/20 p-4 mb-4 flex items-center justify-between"
              >
                <div className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-accent">Selected Project Tier</div>
                <div className="font-sans text-xs md:text-sm font-medium text-white">{selectedTier}</div>
              </motion.div>
            )}
            
            <div className="space-y-3 md:space-y-4">
              <label className="block font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Full Name</label>
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
              <label className="block font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Email Address</label>
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
              <label className="block font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-500">Project Details</label>
              <textarea 
                required
                placeholder="Tell us about your project..." 
                rows={4} 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-surface/50 border-b border-border p-4 font-sans text-white focus:outline-none focus:border-accent transition-colors resize-none rounded-none" 
              />
            </div>
            
            {status === "error" && (
              <p className="text-red-500 font-mono text-[10px] uppercase tracking-widest">Error sending message. Please try again.</p>
            )}

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={status === "sending"}
              className={`w-full font-mono text-xs font-medium py-5 uppercase tracking-widest transition-all duration-300 ${
                status === "sending" ? "bg-accent/50 text-black cursor-not-allowed" : "bg-white text-black hover:bg-accent"
              }`}
            >
              {status === "sending" ? "Sending..." : "Submit Project"}
            </motion.button>
          </form>
      </motion.div>
    </section>
  );
};
