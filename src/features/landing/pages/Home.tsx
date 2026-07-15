import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import Hero from '../components/Hero';
import Comparison from '../components/Comparison';
import { DiagnosticQuiz } from '../components/DiagnosticQuiz';
import { SGSSTDashboard } from '../components/SGSSTDashboard';
import FeaturesBento from '../components/ModulesBento';
import FAQSection from '../components/FAQSection';
import { Hero3D } from '../components/Hero3D';


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
  // Estado para controlar el ancho de la pantalla
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  useEffect(() => {
    // Función para evaluar el ancho
    const handleResize = () => {
      // 768px es el breakpoint 'md' en Tailwind
      setIsDesktop(window.innerWidth >= 768);
    };

    // Ejecución inicial al montar el componente
    handleResize();

    // Agregar el listener para cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    // Cleanup del listener al desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full">
      
      {/* Malla de puntos optimizada */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]" />

      <main className="relative z-10 flex flex-col gap-12 md:gap-24 ">
        
        {/* Renderizado Condicional Estricto */}
        {isDesktop ? <Hero3D /> : <Hero />}
        
        <motion.div
          id="comparativa"
          // Ajuste del margen superior negativo:
          // Como Hero3D mide 400vh y Hero mide 100vh, el margen negativo
          // depende de cuál componente esté montado.
          className={`relative z-20 ${isDesktop ? '-mt-[40vh]' : 'mt-0'} bg-[#05080a] shadow-[0_-50px_50px_rgba(5,8,10,1)] scroll-mt-32`} 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <Comparison />
        </motion.div>


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

       
        </div>

      </main>
    </div>
  );
}