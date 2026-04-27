import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Menu, X, Zap, ArrowUpRight } from "lucide-react";

const links = [
  { name: "Services", href: "#services" },
  { name: "Work", href: "#work" },
  { name: "Process", href: "#process" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
  { name: "Tech", href: "#tech" },
];

export const Navbar = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToContact = () => {
    document.getElementById('start-project')?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      id="navbar" 
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-16 py-4 md:py-6 flex justify-between items-center transition-all duration-300 ${
        isScrolled || isMobileMenuOpen 
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-2xl" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div id="logo" className="flex items-center gap-2 text-lg md:text-xl font-bold tracking-widest text-white uppercase shrink-0">
        <Zap className="text-accent fill-accent" size={20} />
        STH LABS
      </div>
      
      {/* Desktop Links */}
      <div id="nav-links" className="hidden md:flex gap-6 lg:gap-8">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            onMouseEnter={() => setHoveredLink(link.name)}
            onMouseLeave={() => setHoveredLink(null)}
            className="relative font-mono text-[10px] lg:text-xs tracking-tighter uppercase text-neutral-400 hover:text-accent transition-colors duration-200"
          >
            {link.name}
            {hoveredLink === link.name && (
              <motion.div
                layoutId="nav-underline"
                className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={scrollToContact}
          id="cta-nav" 
          className="hidden sm:flex items-center gap-2 bg-white text-black font-mono text-[10px] md:text-xs font-medium px-4 md:px-6 py-2 md:py-3 uppercase tracking-wider hover:bg-accent transition-colors duration-200 group"
        >
          Start a Project
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 top-[60px] md:top-[76px] bg-background border-t border-border z-[49] flex flex-col p-8 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-sans text-2xl font-medium text-white hover:text-accent transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={scrollToContact}
                className="w-full bg-white text-black font-mono text-xs font-medium py-5 uppercase tracking-widest mt-4"
              >
                Start a Project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
