export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border px-8 md:px-16 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="text-neutral-500 font-mono text-[10px] tracking-[0.2em] uppercase text-center md:text-left">
        © {new Date().getFullYear()} STH LABS. ENGINEERED FOR PRECISION. ALL RIGHTS RESERVED.
      </div>
      <div className="flex gap-8">
        <a href="#" className="font-mono text-[10px] tracking-widest uppercase text-neutral-500 hover:text-accent transition-colors">
          Github
        </a>
        <a href="#" className="font-mono text-[10px] tracking-widest uppercase text-neutral-500 hover:text-accent transition-colors">
          LinkedIn
        </a>
        <a href="#" className="font-mono text-[10px] tracking-widest uppercase text-neutral-500 hover:text-accent transition-colors">
          Privacy
        </a>
        <a href="#" className="font-mono text-[10px] tracking-widest uppercase text-neutral-500 hover:text-accent transition-colors">
          Terms
        </a>
      </div>
    </footer>
  );
};
