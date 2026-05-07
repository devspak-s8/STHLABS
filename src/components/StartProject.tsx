import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useRef } from "react";
import { Loader2, CheckCircle2, X, Sparkles, Calendar, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { BookingSchedule } from "./BookingSchedule";
import { format } from "date-fns";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface StartProjectProps {
  selectedTier: string | null;
}

type BookingStep = 'details' | 'scheduling' | 'transmitting' | 'success';

export const StartProject = ({ selectedTier }: StartProjectProps) => {
  const [step, setStep] = useState<BookingStep>("details");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [bookingDetails, setBookingDetails] = useState<{ date: Date; time: string; timezone: string } | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (formData.message.length > 20 && formData.message.length < 200) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      
      debounceRef.current = setTimeout(async () => {
        setIsGeneratingSuggestions(true);
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `The following is a partial project description for a software engineering lab. Based on this, provide 3 professional, high-level technical expansions (max 10 words each) that would help an engineer understand the requirements better. Return ONLY a JSON array of 3 strings.
            
            Current text: "${formData.message}"`,
            config: {
              responseMimeType: "application/json",
            }
          });
          
          if (response.text) {
            try {
              const data = JSON.parse(response.text.trim());
              setSuggestions(Array.isArray(data) ? data : []);
            } catch (e) {
              const match = response.text.match(/\[.*\]/s);
              if (match) setSuggestions(JSON.parse(match[0]));
            }
          }
        } catch (error) {
          console.error("AI Error:", error);
        } finally {
          setIsGeneratingSuggestions(false);
        }
      }, 1000);
    } else {
      setSuggestions([]);
    }
  }, [formData.message]);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict Validation
    if (formData.message.trim().split(/\s+/).length < 10) {
      setErrorMessage("The project brief is too sparse. Our engineers require a detailed explanation (min 10 words) to initialize the protocol.");
      return;
    }

    setErrorMessage(null);
    setStep("scheduling");
    // Scroll to section start for smooth flow
    document.getElementById('start-project')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScheduleComplete = async (schedule: { date: Date; time: string; timezone: string }) => {
    setBookingDetails(schedule);
    setStep("transmitting");
    setStatus("loading");

    try {
      // Simulate API transmission
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // In a real app, you'd POST to your backend here
      // const response = await fetch("/api/book", { ... });
      
      setStep("success");
      setStatus("idle");
    } catch (error) {
      setErrorMessage("Data transmission intercepted. Network failure.");
      setStep("details");
      setStatus("error");
    }
  };

  return (
    <section id="start-project" className="py-24 md:py-40 px-6 md:px-16 border-b border-border bg-[#0a0a0a] min-h-screen">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* Header Logic based on Step */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-8 h-px bg-accent" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                {step === 'details' ? 'Step 01 // Integration' : step === 'scheduling' ? 'Step 02 // Scheduling' : 'Protocol Success'}
              </span>
            </motion.div>
            <h2 className="font-sans text-4xl md:text-6xl font-medium text-white tracking-tight leading-[1.1]">
              {step === 'details' && <>Initialize <span className="text-neutral-500">Project.</span></>}
              {step === 'scheduling' && <>Lock In <span className="text-neutral-500">Kickoff.</span></>}
              {step === 'success' && <>Booking <span className="text-neutral-500">Confirmed.</span></>}
            </h2>
          </div>
          <span className="font-mono text-xs text-neutral-500 tracking-tighter hidden md:block">
            {step === 'details' ? '[ PHASE_01 ]' : step === 'scheduling' ? '[ PHASE_02 ]' : '[ COMPLETED ]'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-2xl"
            >
              <form onSubmit={handleInitialSubmit} className="space-y-12">
                {selectedTier && (
                  <div className="bg-accent/5 border border-accent/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-accent" size={18} />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Security Layer Armed</span>
                    </div>
                    <div className="font-sans text-sm font-medium text-white px-4 py-1.5 border border-white/10 bg-white/5">
                      Target: {selectedTier}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500">Client Identity</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Your Name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent border-b border-white/10 py-4 font-sans text-white focus:outline-none focus:border-accent transition-colors placeholder:text-neutral-800" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500">Comms Channel</label>
                    <input 
                      required
                      type="email" 
                      placeholder="email@address.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-transparent border-b border-white/10 py-4 font-sans text-white focus:outline-none focus:border-accent transition-colors placeholder:text-neutral-800" 
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500">Project Schematics</label>
                    {isGeneratingSuggestions && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                        <Loader2 size={10} className="animate-spin text-accent" />
                        <span className="font-mono text-[8px] uppercase text-accent/60 tracking-wider">AI Brainstorming...</span>
                      </motion.div>
                    )}
                  </div>
                  <textarea 
                    required
                    placeholder="Provide a detailed breakdown of your requirements, tech preferences, and timeline goals..." 
                    rows={6} 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-surface/20 border border-white/5 p-6 font-sans text-white text-lg focus:outline-none focus:border-accent/40 transition-colors resize-none placeholder:text-neutral-800 leading-relaxed" 
                  />
                  
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-wrap gap-2"
                      >
                        <div className="w-full flex items-center gap-2 mb-2">
                          <Sparkles size={12} className="text-accent" />
                          <span className="font-mono text-[9px] uppercase text-neutral-500 tracking-widest">Enhanced Requirements:</span>
                        </div>
                        {suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData({ ...formData, message: formData.message.trim() + " " + s })}
                            className="bg-white/5 hover:bg-accent hover:text-black border border-white/5 px-4 py-2 font-sans text-[11px] text-neutral-400 transition-all text-left"
                          >
                            + {s}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {errorMessage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-red-500 bg-red-500/5 border border-red-500/20 p-4">
                      <X size={16} />
                      <p className="font-mono text-[10px] uppercase tracking-widest">{errorMessage}</p>
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 pt-8 border-t border-white/5">
                  <button 
                    type="submit"
                    className="w-full sm:w-auto bg-white text-black font-mono text-[11px] font-black px-12 py-6 uppercase tracking-[0.3em] hover:bg-accent transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    Next Phase <ArrowRight size={14} />
                  </button>
                  <p className="font-sans text-[11px] text-neutral-600 leading-relaxed max-w-xs uppercase tracking-wider">
                    Strict verification required. Phase 02 will initialize the scheduling protocol.
                  </p>
                </div>
              </form>
            </motion.div>
          )}

          {step === "scheduling" && (
            <motion.div
              key="scheduling"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
            >
              <BookingSchedule onComplete={handleScheduleComplete} projectData={formData} />
            </motion.div>
          )}

          {step === "transmitting" && (
            <motion.div
              key="transmitting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-40 text-center"
            >
              <div className="relative mb-12">
                <Loader2 size={64} className="text-accent animate-spin" />
                <div className="absolute inset-0 blur-3xl bg-accent/20 animate-pulse" />
              </div>
              <h3 className="font-sans text-2xl text-white mb-4 uppercase tracking-tighter">Finalizing Uplink...</h3>
              <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.3em]">Encrypting mission data and synchronizing calendar nodes</p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto border border-accent/20 bg-accent/[0.02] p-12 md:p-24 text-center"
            >
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-12 shadow-[0_0_60px_rgba(var(--accent-rgb),0.3)]">
                <CheckCircle2 className="text-black w-14 h-14" />
              </div>
              <h3 className="font-sans text-4xl md:text-6xl font-medium text-white mb-8 tracking-tighter">Mission <span className="text-neutral-500">Acknowledged.</span></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mb-16">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-accent border-b border-accent/20 pb-4">
                    <Mail size={18} />
                    <span className="font-mono text-[11px] uppercase tracking-widest">Protocol Email Dispatched</span>
                  </div>
                  <p className="font-sans text-sm text-neutral-400 leading-relaxed">
                    Check your inbox at <span className="text-white font-medium">{formData.email}</span>. We've sent a digital verification and the calendar invite for the {bookingDetails?.time} window on {bookingDetails?.date && format(bookingDetails.date, "EEEE, MMMM do")}.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-accent border-b border-accent/20 pb-4">
                    <Calendar size={18} />
                    <span className="font-mono text-[11px] uppercase tracking-widest">Kickoff Synchronized</span>
                  </div>
                  <p className="font-sans text-sm text-neutral-400 leading-relaxed">
                    Our lead engineers have blocked this slot. Prepare your technical documentation. A Zoom link has been attached to the calendar invite.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setStep("details")}
                className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
              >
                Terminate Session // Return to Top
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

