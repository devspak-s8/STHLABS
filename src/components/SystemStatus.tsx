import { motion } from "motion/react";
import { CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export const SystemStatus = () => {
  const [latency, setLatency] = useState(24);
  const [emailStatus, setEmailStatus] = useState<"checking" | "active" | "inactive">("checking");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/status?t=${Date.now()}`);
        const data = await response.json();
        setEmailStatus(data.emailConfigured ? "active" : "inactive");
      } catch (error) {
        setEmailStatus("inactive");
      }
    };
    fetchStatus();

    const interval = setInterval(() => {
      setLatency(prev => Math.max(12, Math.min(48, prev + (Math.random() * 4 - 2))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-[60] hidden lg:flex items-center gap-6 bg-background border border-border p-2 px-4 font-mono text-[9px] uppercase tracking-widest text-neutral-500 shadow-xl">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
        </span>
        <span className="text-white">Node: AMS-01</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2">
        <Zap size={10} className="text-accent" />
        <span>Latency: {latency.toFixed(0)}ms</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2">
        <div className={`h-1.5 w-1.5 rounded-full ${emailStatus === "active" ? "bg-accent" : "bg-red-500"}`} />
        <span>Email: {emailStatus === "active" ? "Active" : "Keys Missing"}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2 text-white">
        <CheckCircle2 size={10} className="text-accent" />
        <span>Systems: Optimal</span>
      </div>
    </div>
  );
};
