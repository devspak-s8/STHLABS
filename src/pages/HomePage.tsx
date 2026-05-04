import { Hero } from "../components/Hero";
import { Capabilities } from "../components/Capabilities";
import { Process } from "../components/Process";
import { SelectedWork } from "../components/SelectedWork";
import { ProjectGallery } from "../components/ProjectGallery";
import { Technologies } from "../components/Technologies";
import { Pricing } from "../components/Pricing";
import { Testimonials } from "../components/Testimonials";
import { Philosophy } from "../components/Philosophy";
import { FAQ } from "../components/FAQ";
import { StartProject } from "../components/StartProject";
import { FinalCTA } from "../components/FinalCTA";
import { motion, useScroll, useSpring } from "motion/react";

interface HomePageProps {
  selectedTier: string | null;
  setSelectedTier: (tier: string | null) => void;
}

export const HomePage = ({ selectedTier, setSelectedTier }: HomePageProps) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-accent z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <main className="max-w-7xl mx-auto border-x border-border bg-background shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        <Hero />
        
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Capabilities />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Process />
        </motion.div>

        <SelectedWork />
        <ProjectGallery />

        <Technologies />

        <Pricing onSelectTier={(tier) => setSelectedTier(tier)} />

        <Testimonials />

        <Philosophy />

        <FAQ />

        <StartProject selectedTier={selectedTier} />
        <FinalCTA />
      </main>
    </>
  );
};
