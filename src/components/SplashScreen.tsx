import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              transition: { duration: 1, ease: "easeOut" }
            }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 blur-3xl bg-accent/30 rounded-full"
              />
              <Zap className="text-accent fill-accent relative z-10 w-16 h-16" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white font-sans text-3xl font-black tracking-[0.3em] uppercase"
              >
                Quettrix Labs
              </motion.h1>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 1 }}
                className="h-px bg-accent/50"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest"
              >
                Systems Engineering Core // Protocol v1.0.4
              </motion.p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 2, duration: 0.5 }}
            className="absolute bottom-12 left-12"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent rounded-full" />
                <span className="text-[8px] font-mono text-neutral-600 uppercase">Indexing kernel... OK</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent rounded-full" />
                <span className="text-[8px] font-mono text-neutral-600 uppercase">Calibrating uplink... OK</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
