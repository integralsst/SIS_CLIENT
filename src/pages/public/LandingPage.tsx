import { motion, type Variants } from 'framer-motion';
import Hero from '../../components/Hero';
import Comparison from '../../components/Comparison';
import { SGSSTDashboard } from '../../components/SGSSTDashboard';
import FeaturesBento from '../../components/ModulesBento';
import FAQSection from '../../components/FAQSection';
import CTASection from '../../components/CTASection';

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
    <div className="relative min-h-screen bg-slate-950 font-sans selection:bg-cyan-500/30">
      
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-0" />

      <main className="relative z-10 flex flex-col gap-12 md:gap-20 pt-8">
        
        <Hero />
        
        {/* El ID "comparativa" conecta con el enlace del Navbar */}
        <motion.div
          id="comparativa"
          className="scroll-mt-24" // Ajuste de margen para que el Navbar fijo no tape el título
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <Comparison />
        </motion.div>
        
        {/* El ID "dashboard" conecta con el enlace del Navbar */}
        <motion.div
          id="dashboard"
          className="scroll-mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <SGSSTDashboard />
        </motion.div>

        {/* El ID "modulos" conecta con el enlace del Navbar */}
        <motion.div
          id="modulos"
          className="scroll-mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <FeaturesBento />
        </motion.div>

        <div className="flex flex-col">
          
          {/* El ID "faq" conecta con el enlace del Navbar */}
          <motion.div
            id="faq"
            className="scroll-mt-24"
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