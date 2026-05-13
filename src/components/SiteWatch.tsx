import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Activity, ShieldCheck, Globe, Zap, ArrowRight, Terminal, 
  BarChart3, Info, AlertTriangle, CheckCircle2, Settings as SettingsIcon, 
  Bell, TrendingUp, MousePointer2, History, PieChart as PieIcon, 
  BarChart4, ChevronDown, ChevronUp, Share2, Server, Timer, Download,
  Ticket, Bookmark, BookmarkPlus, Trash2, LayoutDashboard
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, ZAxis
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { NetworkGraph } from "./NetworkGraph";
import { useAuth } from "../lib/authContext";
import { db, signInWithGoogle, handleFirestoreError, OperationType } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp, 
  deleteDoc, 
  doc, 
  orderBy
} from "firebase/firestore";

// Mock data generators
const generateTimeSeries = (points: number) => 
  Array.from({ length: points }, (_, i) => ({
    time: `${i}:00`,
    latency: Math.floor(Math.random() * 200) + 100,
    errors: Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0,
    traffic: Math.floor(Math.random() * 1000) + 500,
    rank: 100 - (i * 2) + Math.floor(Math.random() * 5),
    cpu: Math.floor(Math.random() * 30) + 10,
    memory: Math.floor(Math.random() * 20) + 40,
    bandwidth: Math.floor(Math.random() * 500) + 200
  }));

const trafficSourceData = [
  { name: 'Organic Search', value: 45, color: '#FFFFFF' },
  { name: 'Direct Traffic', value: 25, color: '#999999' },
  { name: 'Social Media', value: 20, color: '#444444' },
  { name: 'Referral Link', value: 10, color: '#111111' },
];

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface AiAudit {
  visibilityScore: number;
  keywordSuggestions: string[];
  contentGaps: { issue: string; impact: string }[];
  linkingStrategy: string;
  technicalPerformance: string;
}

interface AnalysisData {
  url: string;
  timestamp: number;
  metadata: {
    title: string;
    description: string;
    ogTitle: string | null;
    h1Count: number;
    links: number;
    internalLinks: number;
    externalLinks: number;
    imageCount: number;
    scripts: number;
    styles: number;
    linkSamples?: string[];
  };
  metrics: {
    status: number;
    server: string;
  };
}

interface Thresholds {
  maxResponseTime: number;
  minVisibilityScore: number;
  maxErrorRate: number;
}

interface MonitoredSite {
  id: string;
  url: string;
  ownerId: string;
  createdAt: any;
  status: string;
}

export const SiteWatch = () => {
  const { user, loading } = useAuth();
  const isAdmin = React.useMemo(() => {
    const adminUid = import.meta.env.VITE_ADMIN_UID;
    const isMatched = user?.uid && user.uid === adminUid;
    
    if (user && !isMatched) {
      console.warn('Operator Identification Failed:', {
        currentUserUid: user.uid,
        expectedAdminUid: adminUid,
        status: adminUid ? 'Mismatch' : 'Missing VITE_ADMIN_UID in environment'
      });
    }
    return isMatched;
  }, [user]);
  
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [aiAudit, setAiAudit] = useState<AiAudit | null>(null);
  const [history, setHistory] = useState<AnalysisData[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [liveData, setLiveData] = useState(generateTimeSeries(20));
  const [anomalies, setAnomalies] = useState<{ id: string; type: string; timestamp: string; severity: "low" | "high" }[]>([]);
  const [automations, setAutomations] = useState<{ id: string; action: string; status: "complete" | "running"; timestamp: string }[]>([]);
  const [monitoredSites, setMonitoredSites] = useState<MonitoredSite[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [view, setView] = useState<"scan" | "monitored">("scan");
  
  const [thresholds, setThresholds] = useState<Thresholds>(() => {
    const saved = localStorage.getItem('quettrix_thresholds');
    return saved ? JSON.parse(saved) : { maxResponseTime: 500, minVisibilityScore: 70, maxErrorRate: 1 };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [alerts, setAlerts] = useState<{ type: "warning" | "error"; message: string }[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#000000",
        scale: 2,
        logging: false,
        useCORS: true
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`SiteWatch_Report_${data?.url || "Analysis"}.pdf`);
    } catch (err) {
      console.error("PDF Export failed", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleApplyDiscount = () => {
    if (discountCode === "QUETTRIXLABS") {
      setDiscountApplied(true);
      setDiscountError(false);
    } else {
      setDiscountApplied(false);
      setDiscountError(true);
      setTimeout(() => setDiscountError(false), 3000);
    }
  };

  const handleSubmitReview = async () => {
    if (!data || !aiAudit) return;
    setIsSubmitting(true);
    try {
      const message = `
        AUDIT REPORT SUBMISSION
        URL: ${data.url}
        Visibility Score: ${aiAudit.visibilityScore}%
        Keywords: ${aiAudit.keywordSuggestions.join(", ")}
        Linking Strategy: ${aiAudit.linkingStrategy}
        Technical: ${aiAudit.technicalPerformance}
      `;
      
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "SiteWatch Analysis",
          email: "apatirasulayman@gmail.com", 
          message,
          tier: "SiteWatch Audit Audit"
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Transmission failed";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Protocol Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Telemetry Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => {
        const last = prev[prev.length - 1];
        const newLatency = Math.floor(Math.random() * 150) + 80;
        const newTraffic = Math.floor(Math.random() * 200) + 800;
        
        // Trigger automated response if latency is high
        if (newLatency > 200) {
          const actionId = Math.random().toString(36).substr(2, 5).toUpperCase();
          setAutomations(prev => [{
            id: actionId,
            action: "Scaling API Nodes (Horizontal Forge)",
            status: "running",
            timestamp: new Date().toLocaleTimeString()
          }, ...prev].slice(0, 5));
          
          setAnomalies(prev => [{
            id: Math.random().toString(36).substr(2, 5).toUpperCase(),
            type: "LATENCY_SPIKE",
            timestamp: new Date().toLocaleTimeString(),
            severity: "high"
          }, ...prev].slice(0, 5));

          setTimeout(() => {
            setAutomations(prev => prev.map(a => a.id === actionId ? {...a, status: "complete" as const} : a));
          }, 2000);
        }

        // Random Traffic Anomaly
        if (newTraffic > 950) {
           setAnomalies(prev => [{
            id: Math.random().toString(36).substr(2, 5).toUpperCase(),
            type: "TRAFFIC_BURST",
            timestamp: new Date().toLocaleTimeString(),
            severity: "low"
          }, ...prev].slice(0, 5));
        }

        // Random Anomaly detection
        if (Math.random() > 0.98) {
          setAnomalies(prev => [{
            id: Math.random().toString(36).substr(2, 5).toUpperCase(),
            type: "SPECTRAL_VARIANCE",
            timestamp: new Date().toLocaleTimeString(),
            severity: Math.random() > 0.5 ? "high" : "low"
          }, ...prev].slice(0, 5));
        }

        const next = [...prev.slice(1), {
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          latency: newLatency,
          errors: Math.random() > 0.9 ? 1 : 0,
          traffic: newTraffic,
          rank: last.rank + (Math.random() > 0.5 ? 1 : -1),
          cpu: Math.floor(Math.random() * 40) + 20,
          memory: Math.floor(Math.random() * 30) + 50,
          bandwidth: Math.floor(Math.random() * 800) + 400
        }];
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Threshold Persistence
  useEffect(() => {
    localStorage.setItem('quettrix_thresholds', JSON.stringify(thresholds));
  }, [thresholds]);

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('quettrix_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Monitor sites from Firestore
  useEffect(() => {
    if (!user) {
      setMonitoredSites([]);
      return;
    }

    const q = query(
      collection(db, "monitored_sites"), 
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sites = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MonitoredSite[];
      setMonitoredSites(sites);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "monitored_sites");
    });

    return unsubscribe;
  }, [user]);

  const handleSaveSite = async () => {
    if (!user || !data) return;
    setIsSaving(true);
    const path = "monitored_sites";
    try {
      await addDoc(collection(db, path), {
        ownerId: user.uid,
        url: data.url,
        createdAt: serverTimestamp(),
        status: "active",
        lastAudit: {
          visibilityScore: aiAudit?.visibilityScore || 0,
          timestamp: Date.now()
        }
      });
      alert(`Success: ${data.url} has been pinned for persistent monitoring.`);
      setIsSettingsOpen(false); 
      setView('monitored');
    } catch (err) {
      console.error('Save Site failed:', err);
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSite = async (siteId: string) => {
    const path = `monitored_sites/${siteId}`;
    try {
      await deleteDoc(doc(db, "monitored_sites", siteId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const validateUrl = (value: string) => {
    if (!value) {
      setUrlError(null);
      return false;
    }
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!pattern.test(value)) {
      setUrlError("Format: domain.com (Protocol Missing)");
      return false;
    }
    setUrlError(null);
    return true;
  };

  const saveToHistory = (newData: AnalysisData) => {
    const updated = [newData, ...history.filter(h => h.url !== newData.url)].slice(0, 5);
    setHistory(updated);
    localStorage.setItem('quettrix_history', JSON.stringify(updated));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl(url)) return;
    
    setStatus("loading");
    setError(null);
    setAiAudit(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Protocol Failure: ${response.statusText}`);
      }

      const result = await response.json();
      const enrichedData = { ...result, url, timestamp: Date.now() };
      setData(enrichedData);
      saveToHistory(enrichedData);
      setStatus("success");
      
      checkThresholds(enrichedData);
      generateAiAudit(enrichedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Spectral connection failed.");
      setStatus("error");
    }
  };

  const checkThresholds = (analysisData: AnalysisData) => {
    const newAlerts: { type: "warning" | "error"; message: string }[] = [];
    if (analysisData.metrics.status >= 400) {
      newAlerts.push({ type: "error", message: `Protocol critical: Status ${analysisData.metrics.status}` });
    }
    setAlerts(newAlerts);
  };

  const generateAiAudit = async (analysisData: AnalysisData) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze site: ${JSON.stringify(analysisData)}. 
        Required Response Format: Valid JSON string without markdown: { "visibilityScore": number, "keywordSuggestions": string[], "contentGaps": [{issue:string, impact:string}], "linkingStrategy": string, "technicalPerformance": string }`,
      });
      const text = response.text || "{}";
      const cleaned = text.replace(/```json|```/g, "").trim();
      setAiAudit(JSON.parse(cleaned));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-16 min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-16 min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="max-w-md w-full p-12 border border-red-500/20 bg-red-500/5 text-center space-y-6">
          <AlertTriangle size={48} className="text-red-500 mx-auto animate-pulse" />
          <h2 className="font-mono text-xs uppercase tracking-[0.4em] text-red-500">Access Denied</h2>
          <p className="font-sans text-sm text-neutral-400">
            Protocol Error: The SiteWatch observatory is restricted to authorized personnel. 
            Sign in as the primary administrator to gain access.
          </p>
          {!user ? (
            <button 
              onClick={() => signInWithGoogle()}
              className="px-8 py-3 bg-white text-black font-mono text-[10px] uppercase font-bold hover:bg-accent transition-all"
            >
              Establish Link
            </button>
          ) : (
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-[10px] uppercase hover:bg-red-500 hover:text-white transition-all"
            >
              Return to Surface
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-16 min-h-screen bg-black text-white font-sans selection:bg-accent selection:text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-accent" size={16} />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Protocol: Observability</span>
            </div>
            <p className="mt-4 text-neutral-400 font-mono text-sm max-w-xl">
              Verify your uplink using <span className="text-white">SiteWatch</span>, our deep-packet observability engine. Deep-packet inspection for digital presence. Monitor, analyze, and optimize your site's visibility latency.
            </p>
          </motion.div>
          <div className="flex gap-4">
            <button 
              onClick={() => setView(view === 'scan' ? 'monitored' : 'scan')}
              className={`flex items-center gap-2 px-6 py-4 border rounded-lg transition-all group ${
                view === 'monitored' ? 'border-accent bg-accent/5 font-bold' : 'border-white/10 hover:border-accent'
              }`}
            >
              {view === 'monitored' ? <LayoutDashboard size={18} /> : <Bookmark size={18} />}
              <span className="font-mono text-[10px] uppercase tracking-widest">
                {view === 'monitored' ? 'Main Grid' : 'Pinned sites'}
              </span>
              {monitoredSites.length > 0 && view === 'scan' && (
                <span className="bg-accent text-black text-[9px] px-1.5 rounded-full font-black animate-pulse">
                  {monitoredSites.length}
                </span>
              )}
            </button>
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-4 border border-white/10 rounded-lg hover:border-accent transition-all group">
              <SettingsIcon size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'scan' ? (
            <motion.div 
              key="scan-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8 border border-white/10 p-6 bg-white/[0.02] rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <ThresholdControl label="Latency Limit (ms)" value={thresholds.maxResponseTime} onChange={v => setThresholds({...thresholds, maxResponseTime: v})} min={100} max={2000} />
                      <ThresholdControl label="Visibility Floor (%)" value={thresholds.minVisibilityScore} onChange={v => setThresholds({...thresholds, minVisibilityScore: v})} min={1} max={100} />
                      <ThresholdControl label="Failure Tolerance (%)" value={thresholds.maxErrorRate} onChange={v => setThresholds({...thresholds, maxErrorRate: v})} min={0} max={5} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleAnalyze} className="mb-12">
                <div className="flex flex-col md:flex-row gap-4 relative">
                  <div className="flex-1 relative">
                      <input 
                        value={url} 
                        onChange={e => {
                          setUrl(e.target.value);
                          if (urlError) validateUrl(e.target.value);
                        }} 
                        onBlur={() => validateUrl(url)}
                        placeholder="TARGET UPLINK (e.g. google.com)" 
                        className={`w-full bg-white/5 border ${urlError ? 'border-red-500' : 'border-white/10'} p-5 font-mono uppercase text-sm outline-none focus:border-accent transition-colors`} 
                      />
                      <AnimatePresence>
                        {urlError && (
                          <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 5, opacity: 0 }} className="absolute -bottom-6 left-0 text-[10px] text-red-500 font-mono uppercase">
                            {urlError}
                          </motion.div>
                        )}
                      </AnimatePresence>
                  </div>
                  <button type="submit" className="bg-white text-black px-12 font-bold uppercase hover:bg-accent transition-all active:scale-95">Invoke Scan</button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="monitored-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 mb-12"
            >
              {!user ? (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                  <Globe size={48} className="text-neutral-800 mx-auto mb-6 opacity-30" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-neutral-600 mb-6">Authentication Required for Persistent Monitoring</p>
                  <button 
                    onClick={() => signInWithGoogle()}
                    className="px-8 py-3 bg-white text-black font-mono text-[10px] uppercase font-bold hover:bg-accent transition-all"
                  >
                    Establish Link
                  </button>
                </div>
              ) : monitoredSites.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                  <Bookmark size={48} className="text-neutral-800 mx-auto mb-6 opacity-30" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-neutral-600 mb-6">No Pinned Observatories Found</p>
                  <button 
                    onClick={() => setView('scan')}
                    className="px-8 py-3 border border-white/10 text-white font-mono text-[10px] uppercase hover:border-accent transition-all"
                  >
                    Initialize New Scan
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {monitoredSites.map(site => (
                    <div 
                      key={site.id} 
                      className="p-6 border border-white/10 bg-white/[0.02] rounded-xl hover:border-accent group transition-all"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-white/5 rounded-lg">
                          <Globe size={20} className="text-accent" />
                        </div>
                        <button 
                          onClick={() => handleDeleteSite(site.id)}
                          className="p-2 text-neutral-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h3 className="font-bold tracking-tighter truncate mb-1">{site.url}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] font-mono uppercase text-neutral-500">Live Status: Active</span>
                      </div>
                      
                      {/* @ts-ignore */}
                      {site.lastAudit && (
                        <div className="mb-6 p-3 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[8px] uppercase text-neutral-600 font-mono">Last Score</span>
                            {/* @ts-ignore */}
                            <span className="text-xs font-black text-accent">{site.lastAudit.visibilityScore}%</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[8px] uppercase text-neutral-600 font-mono">Telemetry</span>
                            <span className="text-[9px] font-mono text-neutral-400">STABLE</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setUrl(site.url); handleAnalyze({ preventDefault: () => {} } as any); setView('scan'); }}
                          className="flex-1 bg-white text-black py-3 font-mono text-[10px] uppercase font-bold hover:bg-accent transition-all"
                        >
                          Full Audit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {alerts.length > 0 && (
          <div className="mb-8 space-y-2">
            {alerts.map((a, i) => (
              <div key={i} className="p-4 border border-red-500/20 bg-red-500/5 text-red-500 font-mono text-[10px] uppercase flex items-center gap-3">
                 <Bell size={14} className="animate-pulse" /> {a.message}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {status === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
              <div className="w-12 h-12 border-4 border-white/10 border-t-accent rounded-full animate-spin mx-auto mb-6" />
              <p className="font-mono text-xs uppercase text-neutral-500 tracking-[0.4em] animate-pulse">Establishing Signal...</p>
            </motion.div>
          )}

          {status === "success" && data && (
            <motion.div key="success" ref={reportRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 bg-black">
              
              {/* Telemetry Visuals */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <VisualBox 
                  icon={<TrendingUp size={14}/>} 
                  label="Neural Flux (Traffic)" 
                  isAnomalous={liveData[liveData.length-1].traffic > 950}
                >
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={liveData}>
                      <Area type="stepBefore" dataKey="traffic" stroke="#FFF" fill="#111" strokeWidth={1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </VisualBox>
                <VisualBox icon={<PieIcon size={14}/>} label="Source Weight">
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie data={trafficSourceData} innerRadius={35} outerRadius={50} dataKey="value">
                        {trafficSourceData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </VisualBox>
                <VisualBox 
                  icon={<Timer size={14}/>} 
                  label="Ping Latency"
                  isAnomalous={liveData[liveData.length-1].latency > 200}
                >
                   <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={liveData}>
                      <Line type="monotone" dataKey="latency" stroke="#FFF" dot={false} strokeWidth={2} />
                      <XAxis dataKey="time" hide />
                    </LineChart>
                  </ResponsiveContainer>
                </VisualBox>
                <VisualBox 
                  icon={<Share2 size={14}/>} 
                  label="Index Rank"
                  isAnomalous={anomalies.some(a => a.type === 'SPECTRAL_VARIANCE')}
                >
                   <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={liveData}>
                      <Bar dataKey="rank" fill="#333" />
                    </BarChart>
                  </ResponsiveContainer>
                </VisualBox>
              </div>

              {/* Infrastructure & Automation Layer */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Infrastructure Monitoring */}
                <div className="p-8 border border-white/10 bg-black/40 rounded-xl lg:col-span-1">
                   <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-8 flex items-center gap-2">
                     <Server size={14} className="text-accent" /> Live Infrastructure
                   </h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <div className="flex justify-between font-mono text-[9px] uppercase text-neutral-500">
                            <span>CPU Matrix</span>
                            <span className="text-white">{liveData[liveData.length-1].cpu}%</span>
                         </div>
                         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${liveData[liveData.length-1].cpu}%` }}
                              className="h-full bg-accent"
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between font-mono text-[9px] uppercase text-neutral-500">
                            <span>Memory Load</span>
                            <span className="text-white">{liveData[liveData.length-1].memory}%</span>
                         </div>
                         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${liveData[liveData.length-1].memory}%` }}
                              className="h-full bg-white"
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between font-mono text-[9px] uppercase text-neutral-500">
                            <span>Spectral Bandwidth</span>
                            <span className="text-white">{liveData[liveData.length-1].bandwidth} Mbps</span>
                         </div>
                         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(liveData[liveData.length-1].bandwidth / 1500) * 100}%` }}
                              className="h-full bg-neutral-600"
                            />
                         </div>
                      </div>
                      <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                         <div>
                            <div className="text-[8px] uppercase text-neutral-600 font-mono">Uptime Status</div>
                            <div className="text-xs font-bold text-green-500">99.9997%</div>
                         </div>
                         <div>
                            <div className="text-[8px] uppercase text-neutral-600 font-mono">API Health</div>
                            <div className="text-xs font-bold text-accent">STABLE</div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Operational Intelligence */}
                <div className="p-8 border border-white/10 bg-black/40 rounded-xl lg:col-span-1">
                   <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-8 flex items-center gap-2">
                     <AlertTriangle size={14} className="text-accent" /> Operational Intelligence
                   </h3>
                   <div className="space-y-4 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                      {anomalies.length > 0 ? anomalies.map(a => (
                        <div key={a.id} className="p-3 border border-white/5 bg-white/[0.02] rounded flex items-center justify-between group">
                           <div className="flex flex-col">
                              <span className={`text-[8px] uppercase font-bold ${a.severity === 'high' ? 'text-red-500' : 'text-orange-500'}`}>
                                 {a.severity === 'high' ? 'High Severity' : 'Deviation'}
                              </span>
                              <span className="text-[10px] font-mono text-neutral-400 group-hover:text-white transition-colors">{a.type}</span>
                           </div>
                           <span className="text-[8px] font-mono text-neutral-600">{a.timestamp}</span>
                        </div>
                      )) : (
                        <div className="text-center py-12 text-[10px] font-mono text-neutral-600 uppercase tracking-widest opacity-30">
                           Awaiting Deviations...
                        </div>
                      )}
                   </div>
                   <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[9px] font-mono uppercase text-neutral-500 tracking-widest">Normal Activity Detected</span>
                   </div>
                </div>

                {/* Automation Layer */}
                <div className="p-8 border border-white/10 bg-black/40 rounded-xl lg:col-span-1">
                   <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-8 flex items-center gap-2">
                     <Zap size={14} className="text-accent" /> Neural Automation
                   </h3>
                   <div className="space-y-4">
                      {automations.map(act => (
                        <div key={act.id} className="flex gap-4 items-start">
                           <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${act.status === 'running' ? 'bg-accent animate-ping' : 'bg-green-500'}`} />
                           <div className="flex-1">
                              <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-bold uppercase tracking-tighter">{act.action}</span>
                                 <span className="text-[8px] font-mono text-neutral-500">{act.timestamp}</span>
                              </div>
                              <p className="text-[9px] font-mono text-neutral-600 uppercase mt-1">Status: {act.status === 'running' ? 'Active Protocol' : 'Protocol Resolved'}</p>
                           </div>
                        </div>
                      ))}
                      {automations.length === 0 && (
                        <div className="text-center py-12 text-[10px] font-mono text-neutral-600 uppercase tracking-widest opacity-30">
                           Automation Passive...
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                <div className="lg:col-span-8 space-y-6">
                  {/* Table with Sparklines */}
                  <div className="p-8 border border-white/10 bg-black/40 rounded-xl">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-8">Resource Performance Matrix</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 text-[10px] uppercase font-bold text-neutral-600 border-b border-white/5 pb-4 px-4">
                        <div className="col-span-2">Internal Node</div>
                        <div>Weight</div>
                        <div className="text-right">Spectral Flux</div>
                      </div>
                      {(data.metadata.linkSamples || ['/index', '/about', '/contact', '/pricing']).slice(0, 5).map((link, i) => (
                        <div key={i} className="grid grid-cols-4 items-center p-4 hover:bg-white/[0.03] transition-colors rounded-lg group">
                          <div className="col-span-2 font-mono text-[10px] truncate flex items-center gap-3">
                             <div className="w-1 h-1 rounded-full bg-accent" />
                             {link}
                          </div>
                          <div className="text-[10px] font-bold tracking-tighter text-neutral-400">
                            {Math.floor(Math.random() * 500) + 100} KB
                          </div>
                          <div className="h-4 w-full">
                             <ResponsiveContainer width="100%" height="100%">
                               <AreaChart data={Array.from({length: 6}, () => ({v: Math.random()}))}>
                                 <Area type="basis" dataKey="v" stroke="#333" fill="#111" strokeWidth={1} />
                               </AreaChart>
                             </ResponsiveContainer>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scatter Correlation */}
                  <div className="p-8 border border-white/10 bg-black/40 rounded-xl h-[350px]">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-8">Correlation: Density vs. Latency</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <ScatterChart>
                        <XAxis type="number" dataKey="scripts" name="Scripts" hide />
                        <YAxis type="number" dataKey="styles" name="Styles" hide />
                        <ZAxis type="number" dataKey="images" range={[50, 400]} />
                        <Scatter 
                          name="Node Matrix" 
                          data={Array.from({ length: 15 }, () => ({
                            scripts: Math.floor(Math.random() * (data.metadata.scripts + 5)),
                            styles: Math.floor(Math.random() * (data.metadata.styles + 5)),
                            images: Math.random() * (data.metadata.imageCount * 10)
                          }))} 
                          fill="#FFF" 
                          opacity={0.3} 
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Audit Sidebar */}
                <div className="lg:col-span-4 h-full">
                  <div className="p-8 border border-white/10 bg-neutral-900 rounded-xl h-full flex flex-col">
                    <h3 className="font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                       <ShieldCheck size={14} className="text-accent" /> Spectral Logic
                    </h3>
                    {aiAudit ? (
                      <div className="space-y-8">
                        <div className="text-center p-6 bg-white/5 border border-white/5 rounded-lg">
                          <span className="text-[10px] text-neutral-500 uppercase block mb-1">Impact Score</span>
                          <div className="text-5xl font-black text-accent">{aiAudit.visibilityScore}%</div>
                        </div>
                        <div className="space-y-4">
                           <span className="text-[10px] text-neutral-500 uppercase block tracking-widest">Growth Terms</span>
                           <div className="flex flex-wrap gap-2">
                              {aiAudit.keywordSuggestions.map(k => (
                                <span key={k} className="px-2 py-1 bg-white/10 text-[9px] uppercase font-mono">{k}</span>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-4 pt-6 border-t border-white/5">
                           <span className="text-[10px] text-neutral-500 uppercase block tracking-widest">Logic Gaps</span>
                           {aiAudit.contentGaps.map((g, i) => (
                             <div key={i} className="text-[10px] border-l-2 border-accent pl-3">
                               <div className="text-white font-bold">{g.issue}</div>
                               <div className="text-neutral-500">{g.impact}</div>
                             </div>
                           ))}
                        </div>
                        
                        <div className="pt-6 border-t border-white/5 space-y-4">
                          {user && !monitoredSites.some(s => s.url === data.url) && (
                            <button 
                              onClick={handleSaveSite}
                              disabled={isSaving}
                              className="w-full py-4 font-mono text-[10px] uppercase tracking-widest bg-white/5 border border-white/10 text-white hover:border-accent transition-all flex items-center justify-center gap-2"
                            >
                               <BookmarkPlus size={14} className={isSaving ? 'animate-pulse' : ''} />
                               {isSaving ? 'Establishing Persistence...' : 'Pin for Persistent Monitoring'}
                            </button>
                          )}

                          {monitoredSites.some(s => s.url === data.url) && (
                            <div className="w-full py-4 font-mono text-[10px] uppercase tracking-widest bg-accent/10 border border-accent/20 text-accent flex items-center justify-center gap-2">
                               <ShieldCheck size={14} />
                               Active Persistence Protocol
                            </div>
                          )}

                          <button 
                            onClick={handleSubmitReview}
                            disabled={isSubmitting || submitSuccess}
                            className={`w-full py-4 font-mono text-[10px] uppercase tracking-widest transition-all ${
                              submitSuccess 
                                ? 'bg-green-500 text-white' 
                                : 'bg-accent text-black hover:bg-white hover:text-black'
                            }`}
                          >
                            {isSubmitting ? 'Transmitting...' : submitSuccess ? 'Report Submitted' : 'Submit for Review'}
                          </button>

                          <button 
                            onClick={handleDownloadReport}
                            disabled={isDownloading}
                            className="w-full py-4 font-mono text-[10px] uppercase tracking-widest border border-white/10 hover:border-accent transition-all flex items-center justify-center gap-2"
                          >
                            <Download size={14} />
                            {isDownloading ? 'Encoding PDF...' : 'Download Report'}
                          </button>
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/5 text-[9px] text-neutral-600 font-mono leading-relaxed">
                           ANALYSIS_UUID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 flex-1 flex flex-col justify-center items-center opacity-20">
                         <Terminal size={40} className="mb-4" />
                         <span className="font-mono text-[10px] uppercase tracking-widest">Processing Audits...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div className="pt-8 border-t border-white/10">
                <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="flex items-center gap-3 w-full p-4 border border-dashed border-white/10 rounded hover:bg-white/[0.02] transition-colors">
                  <History size={16} />
                  <span className="font-mono text-xs uppercase tracking-widest">Archived Signals</span>
                  {isHistoryOpen ? <ChevronUp size={14} className="ml-auto"/> : <ChevronDown size={14} className="ml-auto"/>}
                </button>
                <AnimatePresence>
                  {isHistoryOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                        {history.map((h, i) => (
                          <div key={i} onClick={() => { setData(h); setUrl(h.url); }} className="p-4 border border-white/10 bg-white/[0.02] cursor-pointer hover:border-accent group">
                            <div className="text-[8px] text-neutral-600 mb-2 font-mono">{new Date(h.timestamp).toLocaleString()}</div>
                            <div className="text-xs font-bold truncate tracking-widest group-hover:text-accent">GET:{h.url}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Heatmap & Network Mesh */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                {/* Simulated Heatmap */}
                <div className="p-8 border border-white/10 bg-black/40 rounded-xl relative overflow-hidden">
                   <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-8 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Focus Heatmap (Activity Density)
                   </h3>
                   <div className="grid grid-cols-12 gap-1 h-32">
                      {Array.from({ length: 48 }).map((_, i) => {
                        const opacity = [0.05, 0.1, 0.2, 0.5, 0.8, 1][Math.floor(Math.random() * 6)];
                        return (
                          <motion.div 
                            key={i} 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.01 }}
                            className="bg-white rounded-sm" 
                            style={{ opacity }}
                          />
                        );
                      })}
                   </div>
                   <div className="mt-4 flex justify-between font-mono text-[8px] text-neutral-600 uppercase">
                      <span>Low Density</span>
                      <span>Critical Sync Zone</span>
                   </div>
                </div>

                {/* Network Mesh representation */}
                <div className="p-8 border border-white/10 bg-black/40 rounded-xl relative overflow-hidden group">
                   <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-8 flex items-center gap-2">
                     <Share2 size={12} className="text-accent" /> Spectral Mesh Topology
                   </h3>
                   <div className="relative h-[300px] flex items-center justify-center">
                      <NetworkGraph links={data.metadata.linkSamples || []} mainUrl={data.url} />
                   </div>
                   <div className="mt-4 flex justify-between font-mono text-[8px] text-neutral-600 uppercase">
                      <span>Root Uplink</span>
                      <span>Discovered Nodes</span>
                   </div>
                </div>
              </div>

            </motion.div>
          )}

          {status === "success" && (
            <div className="pt-12 border-t border-white/10">
              <div className="max-w-md mx-auto p-8 border border-white/10 bg-white/[0.02] rounded-xl text-center space-y-6">
                <div className="flex justify-center">
                  <Ticket size={24} className="text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Protocol Voucher</h3>
                  <p className="text-[10px] text-neutral-500 font-mono uppercase">Enter your project code for spectral discounts.</p>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={discountCode}
                    onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    className={`flex-1 bg-black border ${discountError ? 'border-red-500' : 'border-white/10'} p-3 font-mono text-[10px] outline-none focus:border-accent transition-colors`}
                  />
                  <button 
                    onClick={handleApplyDiscount}
                    className="px-6 bg-white text-black font-mono text-[10px] uppercase hover:bg-accent transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <AnimatePresence>
                  {discountApplied && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-3 border border-green-500/20 bg-green-500/5 text-green-500 font-mono text-[9px] uppercase">
                      30% Logic Discount Applied: QUETTRIXLABS
                    </motion.div>
                  )}
                  {discountError && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-3 border border-red-500/20 bg-red-500/5 text-red-500 font-mono text-[9px] uppercase">
                      Invalid Protocol Code
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {status === "idle" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 py-24"
            >
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                <Globe size={48} className="text-neutral-800 mb-6" />
                <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-neutral-600">Awaiting Target Logic Scan</p>
              </div>
              <div className="space-y-8 flex flex-col justify-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-accent transform -translate-x-2">
                    <Zap size={14} />
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest">Step 01</span>
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-tighter">Invoke Analysis</h3>
                  <p className="text-xs text-neutral-500 font-mono uppercase leading-relaxed">Run a real-time audit of your domain via our spectral uplink.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-accent transform -translate-x-2">
                    <Terminal size={14} />
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest">Step 02</span>
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-tighter">Review Spectral Blueprint</h3>
                  <p className="text-xs text-neutral-500 font-mono uppercase leading-relaxed">Analyze content gaps, technical latency, and keyword density mapping.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-accent transform -translate-x-2">
                    <CheckCircle2 size={14} />
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest">Step 03</span>
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-tighter">Submit for Review</h3>
                  <p className="text-xs text-neutral-500 font-mono uppercase leading-relaxed">Send your audit report directly to our lab for professional verification.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const VisualBox = ({ icon, label, children, isAnomalous }: { icon: any, label: string, children: any, isAnomalous?: boolean }) => (
  <div className={`p-6 border rounded-xl transition-all duration-500 ${
    isAnomalous 
      ? 'border-red-500/50 bg-red-950/10 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
      : 'border-white/10 bg-black/40'
  }`}>
    <div className={`flex items-center gap-2 mb-4 uppercase tracking-widest text-[9px] font-bold transition-colors ${
      isAnomalous ? 'text-red-500' : 'text-neutral-600'
    }`}>
      {isAnomalous && <AlertTriangle size={10} className="animate-pulse" />}
      {icon} {label}
    </div>
    <div className={isAnomalous ? 'animate-pulse opacity-80' : ''}>
      {children}
    </div>
  </div>
);

const ThresholdControl = ({ label, value, onChange, min, max }: { label: string, value: number, onChange: (v: number) => void, min: number, max: number }) => (
  <div className="space-y-3">
    <label className="text-[10px] uppercase text-neutral-500 tracking-widest block">{label}</label>
    <input type="range" min={min} max={max} value={value} onChange={e => onChange(parseInt(e.target.value))} className="w-full h-1 bg-white/10 appearance-none accent-accent cursor-pointer" />
    <div className="text-right text-[10px] font-mono opacity-50">{value}</div>
  </div>
);
