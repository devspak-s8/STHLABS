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

function AppContent() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

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

