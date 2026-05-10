/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useSearchParams } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { BackToTop } from "./components/BackToTop";
import { SplashScreen } from "./components/SplashScreen";
import { HomePage } from "./pages/HomePage";
import { PricingPage } from "./pages/PricingPage";
import { SiteWatch } from "./components/SiteWatch";
import { CaseStudyPage } from "./components/CaseStudyPage";
import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { WifiOff, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function AppContent() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const tier = searchParams.get('tier');
    if (tier) {
      setSelectedTier(tier);
      // Wait for navigation and then scroll
      setTimeout(() => {
        document.getElementById('start-project')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background text-white selection:bg-accent selection:text-black grid-bg">
      <AnimatePresence>
        {isOffline && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white py-2 px-4 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] shadow-xl"
          >
            <WifiOff size={14} />
            <span>Protocol Error: System Link Severed // You are currently offline</span>
            <AlertTriangle size={14} className="animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
      <SplashScreen />
      <Navbar />
      <BackToTop />
      
      <Routes>
        <Route path="/" element={<HomePage selectedTier={selectedTier} setSelectedTier={setSelectedTier} />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/site-watch" element={<SiteWatch />} />
        <Route path="/case-study/:id" element={<CaseStudyPage />} />
      </Routes>
      
      <Footer />
      <Analytics />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

