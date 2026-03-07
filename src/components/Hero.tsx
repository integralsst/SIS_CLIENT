import { Sparkles, CalendarCheck, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    // Reduje el padding top (pt) de 32 a 24 en móvil para quitar espacio muerto.
    <section className="relative pt-24 md:pt-32 pb-10 md:pb-16 px-6 text-center">
      
      {/* Glow ambiental más concentrado */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-cyan-500/10 blur-[100px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium mb-6"
      >
        <Sparkles size={12} /> Gestión SST Inteligente
      </motion.div>

      {/* Tipografía: text-4xl en móvil para evitar saltos raros. leading-tight (o un valor fijo) da ese look Apple */}
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1] max-w-4xl mx-auto drop-shadow-sm">
        Cumplimiento Legal. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Sin Complicaciones.
        </span>
      </h1>

      {/* Texto secundario un poco más pequeño en móvil para no saturar */}
      <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 md:mb-12 font-medium leading-relaxed">
        Automatiza tus inspecciones, gestiona riesgos en tiempo real y asegura el cumplimiento de la normativa vigente.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button className="w-full sm:w-auto px-8 py-3.5 md:py-4 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-base md:text-lg shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
          <CalendarCheck size={18} /> Agendar Auditoría
        </button>
        <div className="flex items-center gap-2 text-slate-500 text-xs md:text-sm font-medium mt-2 sm:mt-0">
           <ShieldCheck size={14} className="text-green-500" />
           Estándares 2026
        </div>
      </div>
    </section>
  );
};

export default Hero;