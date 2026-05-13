import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Zap, ArrowUpRight, User, LogOut } from "lucide-react";
import { useAuth } from "../lib/authContext";
import { signInWithGoogle, signOut } from "../lib/firebase";

const links = [
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#work" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
  { name: "Tools", href: "#tech" },
  { name: "Site Watch", href: "/site-watch" },
];

export const Navbar = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.uid && user.uid === import.meta.env.VITE_ADMIN_UID;
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = React.useMemo(() => {
    const baseLinks = isAdmin ? links : links.filter(l => l.name !== "Site Watch");
    return baseLinks;
  }, [isAdmin]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
      setIsMobileMenuOpen(false);
      return;
    }

    e.preventDefault();
    const id = href.replace('#', '');
    
    if (location.pathname !== '/') {
      navigate('/' + href);
      setIsMobileMenuOpen(false);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToContact = () => {
    if (location.pathname !== '/') {
      navigate('/#start-project');
      setIsMobileMenuOpen(false);
      return;
    }
    document.getElementById('start-project')?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      id="navbar" 
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-16 py-4 md:py-6 flex justify-between items-center transition-all duration-300 ${
        isScrolled || isMobileMenuOpen 
          ? "bg-black border-b border-border shadow-2xl" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <Link to="/" id="logo" className="flex items-center gap-2 text-lg md:text-xl font-bold tracking-widest text-white uppercase shrink-0 hover:text-accent transition-colors">
        <Zap className="text-accent fill-accent" size={20} />
        QUETTRIX LABS
      </Link>
      
      {/* Desktop Links */}
      <div id="nav-links" className="hidden min-[1100px]:flex gap-6 lg:gap-8 absolute left-1/2 -translate-x-1/2">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            onMouseEnter={() => setHoveredLink(link.name)}
            onMouseLeave={() => setHoveredLink(null)}
            className="relative font-mono text-[10px] lg:text-[11px] tracking-widest uppercase text-neutral-400 hover:text-accent transition-colors duration-200"
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
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              {isAdmin && <span className="text-[7px] font-mono text-accent border border-accent/30 px-1 mb-0.5 rounded-sm animate-pulse">LAB ACCESS</span>}
              <span className="text-[9px] font-mono uppercase text-neutral-500 tracking-widest">Operator</span>
              <span className="text-[10px] font-bold text-white uppercase truncate max-w-[100px]">{user.displayName || 'Agent'}</span>
            </div>
            <button 
              onClick={() => signOut()}
              className="p-2 border border-white/10 rounded hover:border-red-500/50 hover:bg-red-500/5 transition-all group"
              title="Sign Out"
            >
              <LogOut size={16} className="text-neutral-500 group-hover:text-red-500" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => signInWithGoogle()}
            className="hidden sm:flex items-center gap-2 border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-accent transition-all"
          >
            <User size={14} />
            Sign In
          </button>
        )}

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
          className="min-[1100px]:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed left-0 right-0 top-[60px] md:top-[76px] bg-black border-t border-border z-[49] flex flex-col p-8 min-[1100px]:hidden shadow-2xl pb-12"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-sans text-2xl font-medium text-white hover:text-accent transition-colors"
                >
                  {link.name}
                </a>
              ))}
              
              {!user && (
                <button 
                  onClick={() => { signInWithGoogle(); setIsMobileMenuOpen(false); }}
                  className="w-full border border-white/20 text-white font-mono text-xs font-medium py-5 uppercase tracking-widest mt-4"
                >
                  Sign In
                </button>
              )}

              <button 
                onClick={scrollToContact}
                className="w-full bg-white text-black font-mono text-xs font-medium py-5 uppercase tracking-widest mt-4"
              >
                Start a Project
              </button>

              {user && (
                <button 
                  onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                  className="w-full border border-red-500/20 text-red-500 font-mono text-xs font-medium py-5 uppercase tracking-widest mt-4"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
