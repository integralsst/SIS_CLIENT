import { motion, type Variants } from 'framer-motion';
import Hero from '../components/Hero';
import Comparison from '../components/Comparison';
import { DiagnosticQuiz } from '../components/DiagnosticQuiz';
import { SGSSTDashboard } from '../components/SGSSTDashboard';
import FeaturesBento from '../components/ModulesBento';
import FAQSection from '../components/FAQSection';
import CTASection from '../components/CTASection';

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
    /* 1. Eliminamos el bg-slate-950 y el min-h-screen redundante.
      2. Dejamos que herede el bg-[#05080a] global de App.tsx.
    */
    <div className="relative w-full">
      
      {/* Malla de puntos optimizada */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* 3. Eliminamos el pt-8 que empujaba el contenido innecesariamente */}
      <main className="relative z-10 flex flex-col gap-12 md:gap-24">
        
        <Hero />
        
        <motion.div
          id="comparativa"
          className="scroll-mt-32" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <Comparison />
        </motion.div>

        {/* ... el resto de tus componentes con la misma estructura ... */}
        
        <motion.div
          id="diagnostico"
          className="scroll-mt-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <DiagnosticQuiz />
        </motion.div>
        
        <motion.div
          id="dashboard"
          className="scroll-mt-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <SGSSTDashboard />
        </motion.div>

        <motion.div
          id="modulos"
          className="scroll-mt-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <FeaturesBento />
        </motion.div>

        <div className="flex flex-col">
          <motion.div
            id="faq"
            className="scroll-mt-32"
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