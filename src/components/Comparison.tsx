import { motion, type Variants } from 'framer-motion';
import { X, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

// --- ANIMACIONES ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
  }
};

const Comparison = () => {
  return (
    <section id="how" className="py-8 md:py-12 px-4 md:px-6 max-w-5xl mx-auto overflow-hidden">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        
        {/* LADO TRADICIONAL */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="p-8 md:p-10 rounded-[2rem] border border-slate-800/50 bg-slate-900/40 flex flex-col justify-center transition-colors"
        >
          <div className="flex items-center gap-3 mb-6 text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
            <AlertTriangle size={18} className="text-slate-500" /> 
            Gestión Manual
          </div>
          
          <motion.ul 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-5 text-slate-400 text-sm md:text-base font-medium"
          >
            <motion.li variants={itemVariants} className="flex items-start gap-3">
              <X size={20} className="text-slate-600 shrink-0 mt-0.5" /> 
              <span>Carpetas físicas y Excels fragmentados y desactualizados.</span>
            </motion.li>
            <motion.li variants={itemVariants} className="flex items-start gap-3">
              <X size={20} className="text-slate-600 shrink-0 mt-0.5" /> 
              <span>Olvido de vencimientos de carnets y capacitaciones.</span>
            </motion.li>
            <motion.li variants={itemVariants} className="flex items-start gap-3">
              <X size={20} className="text-slate-600 shrink-0 mt-0.5" /> 
              <span>Riesgo constante de hallazgos y sanciones legales.</span>
            </motion.li>
          </motion.ul>
        </motion.div>

        {/* LADO SIS (GLASSMORPHISM CORPORATIVO) */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="p-8 md:p-10 rounded-[2rem] border border-blue-500/20 bg-slate-800/50 backdrop-blur-xl relative overflow-hidden flex flex-col justify-center"
        >
          {/* Etiqueta Superior Derecha */}
          <div className="absolute top-0 right-0 bg-blue-500/10 border-b border-l border-blue-500/20 text-blue-300 px-5 py-2 rounded-bl-[1.5rem] text-[9px] font-black uppercase tracking-wider backdrop-blur-md">
            El Estándar
          </div>

          {/* Brillo sutil de fondo (sin exagerar artefactos de luz) */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3 mb-6 text-blue-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
            <ShieldCheck size={18} className="text-blue-400" /> 
            Sistema SIS
          </div>
          
          <motion.ul 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10 space-y-5 text-slate-200 text-sm md:text-base font-medium"
          >
            <motion.li variants={itemVariants} className="flex items-start gap-3">
              <Check size={20} className="text-blue-400 shrink-0 mt-0.5" /> 
              <span>Dashboards consolidados con alertas automáticas.</span>
            </motion.li>
            <motion.li variants={itemVariants} className="flex items-start gap-3">
              <Check size={20} className="text-blue-400 shrink-0 mt-0.5" /> 
              <span>Repositorio cloud con trazabilidad de auditoría.</span>
            </motion.li>
            <motion.li variants={itemVariants} className="flex items-start gap-3">
              <Check size={20} className="text-blue-400 shrink-0 mt-0.5" /> 
              <span>Generación de reportes gerenciales en segundos.</span>
            </motion.li>
          </motion.ul>
        </motion.div>

      </div>
    </section>
  );
};

export default Comparison;