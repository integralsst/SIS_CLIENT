import { motion, type Variants } from 'framer-motion';
// Asumiendo que estos componentes existen en tu estructura
import Hero from '../../components/Hero';
import Comparison from '../../components/Comparison';

// --- ANIMACIONES TIPO APPLE (Tipadas para TypeScript) ---
const appleEase = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: appleEase } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

export default function LandingPage() {
  return (
    // Contenedor principal con fondo oscuro corporativo (Slate 950)
    <div className="relative min-h-screen bg-slate-950 font-sans selection:bg-blue-500/30">
      
      {/* Fondo: Patrón de puntos sutil para profundidad corporativa, sin brillos excesivos */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Gradiente superior sutil para integrar el nav/hero */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-0" />

      <main className="relative z-10 flex flex-col gap-12 md:gap-20 pt-8 pb-16">
        
        {/* HERO SECTION */}
        <Hero />
        
        {/* COMPARISON SECTION */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <Comparison />
        </motion.div>
        
        {/* CTA FINAL - ESTILO GLASSMORPHISM CORPORATIVO */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="px-4 md:px-8 max-w-5xl mx-auto w-full"
        >
          {/* Tarjeta Glassmorphism */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl px-6 py-16 md:py-20 text-center shadow-2xl">
            
            {/* Acento sutil en el borde superior */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <div className="relative z-10 flex flex-col items-center">
              <motion.div variants={fadeUp} className="mb-4">
                <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                  Gestión Integral de Riesgos
                </span>
              </motion.div>

              <motion.h2 
                variants={fadeUp}
                className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-[1.2]"
              >
                Eleva el estándar de seguridad. <br className="hidden md:block" />
                <span className="text-slate-400">Automatiza el cumplimiento normativo.</span>
              </motion.h2>

              <motion.p 
                variants={fadeUp}
                className="text-slate-400 max-w-xl mx-auto mb-10 text-base md:text-lg font-medium leading-relaxed"
              >
                Diseñado para optimizar la administración del SG-SST. Mantén las bitácoras, matrices de riesgo y auditorías de todas las empresas en un solo entorno centralizado y seguro.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-slate-950 font-semibold text-sm md:text-base hover:bg-slate-200 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  Agendar asesoría técnica
                </button>
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-transparent text-white font-semibold text-sm md:text-base border border-slate-700 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95">
                  Ver demo del sistema
                </button>
              </motion.div>
            </div>
          </div>
        </motion.section>

      </main>
    </div>
  );
}