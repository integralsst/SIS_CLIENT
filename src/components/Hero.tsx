import { Sparkles, CalendarCheck, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 text-center">
      {/* Glow ambiental */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/10 blur-[120px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[10px] uppercase tracking-widest font-bold mb-8"
      >
        <Sparkles size={12} /> Gestión SST Inteligente
      </motion.div>

      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter leading-tight max-w-4xl mx-auto">
        Cumplimiento Legal <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Sin Complicaciones Manuales
        </span>
      </h1>

      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        Automatiza tus inspecciones, gestiona riesgos en tiempo real y asegura el cumplimiento de la normativa vigente mientras tu equipo se enfoca en lo que importa.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform flex items-center gap-2">
          <CalendarCheck size={20} /> Agendar Auditoría Gratis
        </button>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
           <ShieldCheck size={16} className="text-green-500" />
           Certificado bajo estándares 2026
        </div>
      </div>
    </section>
  );
};

export default Hero;