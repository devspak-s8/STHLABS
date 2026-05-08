import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { 
  Search, Activity, ShieldCheck, Globe, Zap, ArrowRight, Terminal, 
  BarChart3, Info, AlertTriangle, CheckCircle2, Settings as SettingsIcon, 
  Bell, TrendingUp, MousePointer2, History, PieChart as PieIcon, 
  BarChart4, ChevronDown, ChevronUp, Share2, Server, Timer
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, ZAxis
} from "recharts";

// Mock data generators
const generateTimeSeries = (points: number) => 
  Array.from({ length: points }, (_, i) => ({
    time: `${i}:00`,
    latency: Math.floor(Math.random() * 200) + 100,
    errors: Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0,
    traffic: Math.floor(Math.random() * 1000) + 500,
    rank: 100 - (i * 2) + Math.floor(Math.random() * 5)
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

export const SiteWatch = () => {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [aiAudit, setAiAudit] = useState<AiAudit | null>(null);
  const [history, setHistory] = useState<AnalysisData[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [liveData, setLiveData] = useState(generateTimeSeries(20));
  
  const [thresholds, setThresholds] = useState<Thresholds>(() => {
    const saved = localStorage.getItem('quettrix_thresholds');
    return saved ? JSON.parse(saved) : { maxResponseTime: 500, minVisibilityScore: 70, maxErrorRate: 1 };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [alerts, setAlerts] = useState<{ type: "warning" | "error"; message: string }[]>([]);

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

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
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
        const next = [...prev.slice(1), {
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          latency: Math.floor(Math.random() * 150) + 80,
          errors: Math.random() > 0.9 ? 1 : 0,
          traffic: Math.floor(Math.random() * 200) + 800,
          rank: last.rank + (Math.random() > 0.5 ? 1 : -1)
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
            <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-4 border border-white/10 rounded-lg hover:border-accent transition-all group">
              <SettingsIcon size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>

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
            <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              
              {/* Telemetry Visuals */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <VisualBox icon={<TrendingUp size={14}/>} label="Neural Flux (Traffic)">
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
                <VisualBox icon={<Timer size={14}/>} label="Ping Latency">
                   <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={liveData}>
                      <Line type="monotone" dataKey="latency" stroke="#FFF" dot={false} strokeWidth={2} />
                      <XAxis dataKey="time" hide />
                    </LineChart>
                  </ResponsiveContainer>
                </VisualBox>
                <VisualBox icon={<Share2 size={14}/>} label="Index Rank">
                   <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={liveData}>
                      <Bar dataKey="rank" fill="#333" />
                    </BarChart>
                  </ResponsiveContainer>
                </VisualBox>
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
                        
                        <div className="pt-6 border-t border-white/5">
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
                   <div className="relative h-32 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-16 h-16 border border-accent/20 rounded-full animate-ping" />
                      </div>
                      <div className="grid grid-cols-3 gap-12 relative z-10">
                        {[1,2,3].map(i => (
                          <motion.div 
                            key={i}
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2 + i, repeat: Infinity, ease: "easeInOut" }}
                            className="w-8 h-8 border border-white/10 bg-black flex items-center justify-center rounded"
                          >
                            <Terminal size={10} className="text-neutral-500" />
                          </motion.div>
                        ))}
                      </div>
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                         <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="white" strokeWidth="0.5" />
                         <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="white" strokeWidth="0.5" />
                         <line x1="50%" y1="50%" x2="50%" y2="80%" stroke="white" strokeWidth="0.5" />
                      </svg>
                   </div>
                </div>
              </div>

            </motion.div>
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

const VisualBox = ({ icon, label, children }: { icon: any, label: string, children: any }) => (
  <div className="p-6 border border-white/10 bg-black/40 rounded-xl">
    <div className="flex items-center gap-2 mb-4 text-neutral-600 uppercase tracking-widest text-[9px] font-bold">
      {icon} {label}
    </div>
    {children}
  </div>
);

const ThresholdControl = ({ label, value, onChange, min, max }: { label: string, value: number, onChange: (v: number) => void, min: number, max: number }) => (
  <div className="space-y-3">
    <label className="text-[10px] uppercase text-neutral-500 tracking-widest block">{label}</label>
    <input type="range" min={min} max={max} value={value} onChange={e => onChange(parseInt(e.target.value))} className="w-full h-1 bg-white/10 appearance-none accent-accent cursor-pointer" />
    <div className="text-right text-[10px] font-mono opacity-50">{value}</div>
  </div>
);
