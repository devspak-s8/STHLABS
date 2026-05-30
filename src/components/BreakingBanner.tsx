import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Terminal, ArrowRight, X } from "lucide-react";

export const BreakingBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const triggerModal = () => {
    window.dispatchEvent(new CustomEvent("open-sme-modal"));
  };

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-[#030303] border-b border-accent/20 text-white select-none z-[60] overflow-hidden">
      {/* Laser line effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Left Side: Glowing Badge & Ticker */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-accent/10 border border-accent/30 px-2 py-0.5 shrink-0">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping shadow-[0_0_8px_#00F0FF]" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-accent flex items-center gap-1">
              <Terminal size={10} />
              Protocol Alerts
            </span>
          </div>
          
          <div className="font-sans text-[11px] sm:text-xs text-neutral-300 leading-relaxed text-center sm:text-left">
            <span className="font-semibold text-white uppercase">[ 100 SMEs Initiative: Selection Phase ]</span> We are actively vetting selective business operations for premium custom software deployments. 
            <span className="hidden lg:inline text-neutral-500"> Successful partners will secure bespoke UX architecture and custom coded solutions. no templates, purely optimized code.</span>
          </div>
        </div>

        {/* Right Side: Actives CTA & Close */}
        <div className="flex items-center justify-center gap-4 shrink-0 w-full sm:w-auto">
          <button
            onClick={triggerModal}
            className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-accent border-b border-accent/40 pb-0.5 hover:text-white hover:border-white transition-all cursor-pointer group"
          >
            Apply for Evaluation
            <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="text-neutral-500 hover:text-white transition-colors p-1"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
