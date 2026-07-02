import { motion, type Variants } from 'framer-motion';
// Asegúrate de que las rutas a tus componentes sean las correctas
import Hero from '../../components/Hero';
import Comparison from '../../components/Comparison';
import { SGSSTDashboard } from '../../components/SGSSTDashboard';
import FeaturesBento from '../../components/ModulesBento';
import FAQSection from '../../components/FAQSection';
import CTASection from '../../components/CTASection';

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

export default function LandingPage() {
  return (
    // Contenedor principal con fondo oscuro corporativo (Slate 950)
    <div className="relative min-h-screen bg-slate-950 font-sans selection:bg-cyan-500/30">
      
      {/* Fondo: Patrón de puntos sutil para profundidad corporativa, sin brillos excesivos */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Gradiente superior sutil para integrar el nav/hero */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-0" />

      {/* El main mantiene su gap para separar de forma uniforme las secciones superiores */}
      <main className="relative z-10 flex flex-col gap-12 md:gap-20 pt-8">
        
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
        
        {/* DASHBOARD SG-SST (SIMULADOR DE AUDITORÍA) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <SGSSTDashboard />
        </motion.div>

        {/* BENTO GRID DE CARACTERÍSTICAS TÉCNICAS */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <FeaturesBento />
        </motion.div>

        {/* ENVOLTORIO CLAVE: Agrupamos FAQ y CTA en un div sin 'gap'.
            Esto elimina la franja azul oscuro entre ambas secciones y permite que el fondo blanco del FAQ se fusione con la parte superior del CTA. */}
        <div className="flex flex-col">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <FAQSection />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <CTASection />
          </motion.div>

        </div>

      </main>
    </div>
  );
}