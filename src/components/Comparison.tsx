import { motion, type Variants } from 'framer-motion';
import { 
  FileWarning, 
  ShieldCheck, 
  Activity, 
  FileText 
} from 'lucide-react';

// --- ANIMACIONES FLUIDAS ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerList: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const listItem: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Comparison() {
  return (
    <section id="how" className="py-16 md:py-24 px-4 md:px-8 w-full max-w-6xl mx-auto overflow-hidden">
      
      {/* Encabezado de la sección */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
        className="text-center mb-16"
      >
        <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
          La evolución del <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-300">SG-SST</span>
        </h3>
        <p className="text-slate-400 font-medium max-w-xl mx-auto">
          Deja atrás la incertidumbre operativa. Centraliza, audita y controla con precisión.
        </p>
      </motion.div>

      {/* Contenedor Comparativo */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0 relative">
        
        {/* === TARJETA TRADICIONAL (Opaca y plana) === */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="w-full lg:w-[45%] p-8 md:p-10 rounded-3xl border border-slate-800/60 bg-slate-900/30 lg:rounded-r-none lg:pr-16 z-0"
        >
          <div className="flex items-center gap-3 mb-8 opacity-60">
            <div className="p-2 rounded-lg bg-slate-800">
              <FileWarning size={20} className="text-slate-400" />
            </div>
            <h4 className="text-slate-300 font-semibold tracking-wide uppercase text-sm">
              Gestión Desactualizada
            </h4>
          </div>
          
          <ul className="space-y-6 text-slate-500 font-medium text-sm md:text-base">
            <li className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
              <p>Matrices y bitácoras fragmentadas en hojas de cálculo propensas a errores.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
              <p>Vencimientos de capacitaciones que pasan desapercibidos.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
              <p>Alta exposición a sanciones y hallazgos críticos en auditorías.</p>
            </li>
          </ul>
        </motion.div>

        {/* === BADGE "VS" (Solo Desktop) === */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950 border border-slate-800 items-center justify-center shadow-xl">
          <span className="text-slate-500 font-bold text-xs">VS</span>
        </div>

        {/* === TARJETA SIS (Destacada, Glassmorphism, Elevada) === */}
        <motion.div 
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="w-full lg:w-[55%] p-8 md:p-12 rounded-3xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-2xl shadow-2xl z-10 relative overflow-hidden"
        >
          {/* Acento sutil en el borde superior */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <ShieldCheck size={24} className="text-blue-400" />
              </div>
              <h4 className="text-white font-bold tracking-wide uppercase text-sm md:text-base">
                El Estándar SIS
              </h4>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-[10px] font-bold tracking-widest uppercase border border-blue-500/20">
              Recomendado
            </span>
          </div>
          
          <motion.ul 
            variants={staggerList}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6 text-slate-200 font-medium text-base md:text-lg"
          >
            <motion.li variants={listItem} className="flex items-start gap-4">
              <Activity size={24} className="text-blue-400 shrink-0 mt-0.5" />
              <p>Dashboards gerenciales con indicadores y alertas predictivas.</p>
            </motion.li>
            <motion.li variants={listItem} className="flex items-start gap-4">
              <FileText size={24} className="text-blue-400 shrink-0 mt-0.5" />
              <p>Control centralizado de bitácoras y trazabilidad documental total.</p>
            </motion.li>
            <motion.li variants={listItem} className="flex items-start gap-4">
              <ShieldCheck size={24} className="text-blue-400 shrink-0 mt-0.5" />
              <p>Cumplimiento normativo blindado y listo para cualquier auditoría.</p>
            </motion.li>
          </motion.ul>

        </motion.div>

      </div>
    </section>
  );
}