// src/features/landing/components/Hero.tsx
import React from 'react';
import { Sparkles, ClipboardCheck, ShieldCheck, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  // FIX TIPADO: Ahora sí, especificamos correctamente el genérico <HTMLElement>
  const handleScroll = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const target = document.getElementById('how');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full px-6 overflow-hidden flex flex-col justify-end md:justify-center items-start md:items-center text-left md:text-center min-h-[100dvh] pt-24 pb-12 md:pb-16">
      
      {/* FONDO PREMIUM OPTIMIZADO */}
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

        {/* Gradiente más alto en móvil para que el texto anclado abajo se lea perfecto */}
        <div className="absolute bottom-0 inset-x-0 h-[50vh] md:h-40 bg-gradient-to-t from-[#05080a] md:from-[#05080a] via-[#05080a]/80 to-transparent" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: "opacity, transform" }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-[#0c131a] text-slate-300 text-[11px] uppercase tracking-[0.25em] font-semibold mb-6 shadow-sm relative z-10 self-start md:self-auto"
      >
        <Sparkles size={14} className="text-cyan-400" /> 
        Gestión SST Inteligente
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{ willChange: "opacity, transform" }}
        className="relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 md:mb-6 tracking-tighter leading-[1.05] md:leading-[1.1] max-w-5xl md:mx-auto w-full"
      >
        Cumplimiento Legal. <br className="hidden md:block" />
        <span className="md:hidden"> </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-cyan-400 to-blue-500 block md:inline mt-1 md:mt-0">
          Sin Complicaciones.
        </span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{ willChange: "opacity, transform" }}
        className="relative z-10 text-[17px] sm:text-lg md:text-xl lg:text-2xl text-slate-400/90 md:max-w-2xl md:mx-auto mb-8 md:mb-10 font-medium leading-relaxed tracking-tight w-full pr-4 md:pr-0"
      >
        Automatiza las inspecciones, gestiona riesgos en tiempo real y centraliza las evidencias de la normativa vigente.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        style={{ willChange: "opacity, transform" }}
        className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center gap-4 md:gap-6 w-full mb-4 md:mb-0"
      >
        <a 
          href="#how"
          onClick={handleScroll}
          className="group relative w-full md:w-auto flex items-center justify-center gap-2 h-14 md:h-auto md:px-8 md:py-4 bg-cyan-400 text-slate-950 rounded-2xl md:rounded-full font-bold md:font-semibold text-[17px] md:text-[15px] transition-transform active:scale-[0.98] md:hover:scale-[1.02]"
        >
          <ClipboardCheck size={20} className="md:transition-transform md:group-hover:-translate-y-0.5" /> 
          Explorar el Modelo Digital
        </a>
        
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium px-2 w-full md:w-auto mt-2 md:mt-0">
           <ShieldCheck size={16} className="text-cyan-500" />
           Decreto 1072 & Res 0312
        </div>
      </motion.div>

      {/* INDICADOR DE SCROLL: Visible solo en Desktop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-10 cursor-pointer"
        onClick={handleScroll}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold hover:text-cyan-400 transition-colors">
          Descubre el sistema
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-cyan-500/70" />
        </motion.div>
      </motion.div>

      {/* HOME INDICATOR iOS: Barra sutil visible solo en Móvil para anclar el diseño */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 md:hidden flex justify-center w-full z-10"
      >
        <div className="w-1/3 h-1 bg-white/20 rounded-full" />
      </motion.div>

    </section>
  );
};

export default Hero;