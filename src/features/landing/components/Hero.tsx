import { Sparkles, ClipboardCheck, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const target = document.getElementById('how');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 px-6 text-center overflow-hidden">
      
      {/* FONDO PREMIUM OPTIMIZADO: Micro-matriz de Puntos Blancos */}
      <div className="absolute inset-0 -z-10 bg-[#05080a] flex items-center justify-center overflow-hidden pointer-events-none">
        <svg 
          className="absolute w-[200%] h-[200%] opacity-40 animate-[spin_120s_linear_infinite]" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="dotPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#ffffff" />
            </pattern>
            <radialGradient id="fadeGradient" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#05080a" stopOpacity="0" />
              <stop offset="100%" stopColor="#05080a" stopOpacity="1" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
          <rect width="100%" height="100%" fill="url(#fadeGradient)" />
        </svg>

        {/* FIX EMPALME PERFECTO: Este gradiente borra los puntos justo antes de tocar el componente Comparison */}
        <div className="absolute bottom-0 inset-x-0 h-32 sm:h-48 bg-gradient-to-t from-[#05080a] to-transparent" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: "opacity, transform" }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-[#0c131a] text-slate-300 text-[11px] uppercase tracking-[0.25em] font-semibold mb-8 shadow-sm"
      >
        <Sparkles size={14} className="text-cyan-400" /> 
        Gestión SST Inteligente
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{ willChange: "opacity, transform" }}
        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tighter leading-[1.1] md:leading-[1.05] max-w-5xl mx-auto"
      >
        Cumplimiento Legal. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-cyan-400 to-blue-500">
          Sin Complicaciones.
        </span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{ willChange: "opacity, transform" }}
        className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400/90 max-w-2xl mx-auto mb-10 font-medium leading-relaxed tracking-tight"
      >
        Automatiza las inspecciones, gestiona riesgos en tiempo real y centraliza las evidencias de la normativa vigente.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        style={{ willChange: "opacity, transform" }}
        className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6"
      >
        <a 
          href="#how"
          onClick={handleScroll}
          className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-cyan-400 text-slate-950 rounded-full font-semibold text-[15px] sm:text-base transition-all duration-300 hover:bg-cyan-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <ClipboardCheck size={20} className="transition-transform group-hover:-translate-y-0.5" /> 
          Explorar el Modelo Digital
        </a>
        
        <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm font-medium px-2 mt-2 sm:mt-0">
           <ShieldCheck size={16} className="text-cyan-500" />
           Decreto 1072 & Res 0312
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;