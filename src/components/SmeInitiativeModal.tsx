import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Loader2, Sparkles, Building2, User, Mail, Phone, Globe, Instagram, Target } from "lucide-react";

interface SmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmeInitiativeModal = ({ isOpen, onClose }: SmeModalProps) => {
  const [formData, setFormData] = useState({
    businessName: "",
    fullName: "",
    email: "",
    phone: "",
    industry: "",
    bio: "",
    website: "",
    socials: "",
    goals: ""
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.fullName || !formData.email || !formData.phone || !formData.industry || !formData.bio || !formData.goals) {
      setStatus("error");
      setErrorMessage("Please fill out all required fields to register your business in our screening pool.");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/sme-apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "A processing conflict occurred during submission.");
      }

      setStatus("success");
      // Clear form on success
      setFormData({
        businessName: "",
        fullName: "",
        email: "",
        phone: "",
        industry: "",
        bio: "",
        website: "",
        socials: "",
        goals: ""
      });
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Unable to reach transmission link. Please check your network protocol.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#09090b] border border-border rounded-none shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            {/* Design header */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-indigo-500 to-accent animate-pulse" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors p-2 z-20"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {status === "success" ? (
              <div className="p-8 md:p-12 text-center my-auto flex flex-col items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 bg-accent/10 border border-accent flex items-center justify-center mb-6 rounded-none"
                >
                  <Check className="text-accent" size={32} />
                </motion.div>
                
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent mb-2 block">
                  Application Logged Successful // Protocol Active
                </span>
                
                <h3 className="font-sans text-2xl md:text-3xl font-semibold text-white uppercase tracking-tight mb-4">
                  Assessment Initiated
                </h3>
                
                <div className="max-w-md bg-surface/50 border border-white/5 p-6 mb-8 text-neutral-300 text-sm leading-relaxed text-center font-sans">
                  "Thank you for applying. Our team will review your application and contact you within 24-48 hours if your business is a good fit for the initiative."
                </div>

                <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest max-w-sm">
                  We seek absolute technical alignment. If matched, a direct invite sync block will reach your channels shortly.
                </p>

                <button 
                  onClick={onClose}
                  className="mt-8 bg-white text-black font-mono text-[10px] uppercase tracking-widest px-8 py-4 hover:bg-accent transition-colors duration-200"
                >
                  Close Terminal
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-border bg-surface/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-accent" size={14} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent font-bold">Cohorts Enrollment Phase // Actively Booking</span>
                  </div>
                  <h2 className="font-sans text-xl md:text-3xl font-bold text-white uppercase tracking-tight">
                    100 SMEs Initiative
                  </h2>
                  <p className="text-xs md:text-sm text-neutral-400 mt-2 font-sans max-w-xl">
                    Exclusive cohort selection for premium software deployment. Apply to put your business under our bespoke technical optimization pool. We select, we do not mass-produce.
                  </p>
                </div>

                {/* Content Frame (Scrollable) */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-left">
                  {status === "error" && (
                    <div className="border border-red-500/30 bg-red-500/5 p-4 flex items-center gap-3 text-red-400 font-mono text-xs uppercase leading-relaxed">
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Inputs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Business Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-bold">
                        <Building2 size={12} className="text-accent/70" />
                        Business Name <span className="text-accent">*</span>
                      </label>
                      <input 
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Apex Logistics Ltd"
                        className="w-full bg-[#121214] border border-border px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-600 focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-bold">
                        <User size={12} className="text-accent/70" />
                        Founder / Lead Representative <span className="text-accent">*</span>
                      </label>
                      <input 
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Jane Cooper"
                        className="w-full bg-[#121214] border border-border px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-600 focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-bold">
                        <Mail size={12} className="text-accent/70" />
                        Email Address <span className="text-accent">*</span>
                      </label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="e.g., contact@apexlogistics.com"
                        className="w-full bg-[#121214] border border-border px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-600 focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-bold">
                        <Phone size={12} className="text-accent/70" />
                        Phone Number <span className="text-accent">*</span>
                      </label>
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="e.g., +1 (555) 019-2834"
                        className="w-full bg-[#121214] border border-border px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-600 focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    {/* Industry */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                        Industry / Business Sector <span className="text-accent">*</span>
                      </label>
                      <input 
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Fintech Infrastructure, Supply Chain, Healthcare Systems, E-commerce, etc."
                        className="w-full bg-[#121214] border border-border px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-600 focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-bold">
                        <Globe size={12} className="text-accent/70" />
                        Current Website <span className="text-neutral-600">(Optional)</span>
                      </label>
                      <input 
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="e.g., https://apexlogistics.com"
                        className="w-full bg-[#121214] border border-border px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-600 focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    {/* Socials */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-bold">
                        <Instagram size={12} className="text-accent/70" />
                        Social Pages <span className="text-neutral-600">(Optional)</span>
                      </label>
                      <input 
                        type="text"
                        name="socials"
                        value={formData.socials}
                        onChange={handleChange}
                        placeholder="e.g., Instagram/Facebook brand links"
                        className="w-full bg-[#121214] border border-border px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-600 focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  {/* Tell us about business */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                      Describe your business & target operations <span className="text-accent">*</span>
                    </label>
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      required
                      placeholder="Briefly pitch what you provide, your target scale, systems constraints, or unique niche..."
                      rows={3}
                      className="w-full bg-[#121214] border border-border px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-600 focus:ring-1 focus:ring-accent resize-none"
                    />
                  </div>

                  {/* What are they hoping to achieve */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-bold">
                      <Target size={12} className="text-accent/70" />
                      What are you hoping to achieve? <span className="text-accent">*</span>
                    </label>
                    <textarea 
                      name="goals"
                      value={formData.goals}
                      onChange={handleChange}
                      required
                      placeholder="More sales, more high-scoring leads, absolute digital credibility, automated slot bookings, custom inventory workflows, etc."
                      rows={2}
                      className="w-full bg-[#121214] border border-border px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-accent transition-colors rounded-none placeholder:text-neutral-600 focus:ring-1 focus:ring-accent resize-none"
                    />
                  </div>

                  {/* Selective Footnote */}
                  <div className="bg-surface/30 border border-white/5 p-4 text-[10px] mt-2 font-sans leading-relaxed text-neutral-500">
                    <span className="font-mono text-[9px] text-accent uppercase tracking-wider block mb-1 font-bold">// Evaluation Statement:</span>
                    Registration does not guarantee selection. We filter and restrict project pools strictly to businesses where we can deploy deep technical excellence with direct ROI results. Selected businesses will obtain a dedicated custom-coded deployment under high-tier optimization guidelines.
                  </div>

                  {/* Submission Footer */}
                  <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest sm:text-left text-center">
                      QUETTRIX SPECIAL SCREENING PROTOCOL ACTIVATED
                    </span>
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full sm:w-auto bg-[#00F0FF] text-black font-semibold font-mono text-[10px] uppercase tracking-wider px-8 py-4 transition-all duration-200 hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50 shrink-0 flex items-center justify-center gap-2"
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="animate-spin" size={14} />
                          Logging Candidate Information...
                        </>
                      ) : (
                        "Submit Application for Selection"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
