import { motion, type Variants } from 'framer-motion';
import { 
  FileWarning, 
  ShieldCheck, 
  Activity, 
  FileText 
} from 'lucide-react';

// --- ANIMACIONES FLUIDAS TIPO APPLE (Optimizadas) ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 }, // Reducido ligeramente para menos recorrido en móviles
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerList: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 } // Más rápido para evitar que el usuario scrollee antes de verlos
  }
};

const listItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function Comparison() {
  return (
    <section id="how" className="py-16 md:py-24 px-4 md:px-8 w-full max-w-6xl mx-auto overflow-hidden">
      
      {/* Encabezado */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
        className="text-center mb-16 will-change-[transform,opacity]"
      >
        <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
          La evolución del <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">SG-SST</span>
        </h3>
        <p className="text-slate-400 font-medium max-w-xl mx-auto text-base md:text-lg">
          Deja atrás la incertidumbre operativa. Centraliza, audita y controla con precisión.
        </p>
      </motion.div>

      {/* Contenedor Comparativo */}
      <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch justify-center">
        
        {/* === TARJETA TRADICIONAL === */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex-1 w-full p-8 md:p-10 rounded-[2rem] border border-slate-800/60 bg-slate-900/30 z-0 flex flex-col justify-center will-change-[transform,opacity]"
        >
          <div className="flex items-center gap-3 mb-8 opacity-60">
            <div className="p-2 rounded-xl bg-slate-800">
              <FileWarning size={20} className="text-slate-400" />
            </div>
            <h4 className="text-slate-300 font-semibold tracking-wide uppercase text-sm">
              Gestión Desactualizada
            </h4>
          </div>
          
          <ul className="space-y-6 text-slate-500 font-medium text-sm md:text-base">
            <li className="flex items-start gap-4">
              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
              <p>Matrices y bitácoras fragmentadas en hojas de cálculo propensas a errores.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
              <p>Vencimientos de capacitaciones que pasan desapercibidos.</p>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
              <p>Alta exposición a sanciones y hallazgos críticos en auditorías.</p>
            </li>
          </ul>
        </motion.div>

        {/* === BADGE "VS" === */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-slate-950 border border-slate-800 items-center justify-center shadow-2xl">
          <span className="text-slate-500 font-black text-sm tracking-widest">VS</span>
        </div>

        {/* === TARJETA SIS (Optimizada para Safari) === */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ WebkitTransform: "translateZ(0)" }} // Hack vital para Safari
          className="flex-1 w-full p-8 md:p-10 rounded-[2rem] border border-cyan-500/20 bg-slate-800/40 backdrop-blur-xl shadow-2xl z-10 relative overflow-hidden flex flex-col justify-center transform-gpu will-change-[transform,opacity] transition-transform duration-300 md:hover:-translate-y-1 md:hover:shadow-cyan-900/20"
        >
          {/* Acento superior sutil */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shadow-inner">
                <ShieldCheck size={22} className="text-cyan-400" />
              </div>
              <h4 className="text-white font-bold tracking-wide uppercase text-sm md:text-base">
                El Estándar SIS
              </h4>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-bold tracking-widest uppercase border border-cyan-500/20">
              Recomendado
            </span>
          </div>
          
          <motion.ul 
            variants={staggerList}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6 text-slate-200 font-medium text-sm md:text-base"
          >
            <motion.li variants={listItem} className="flex items-start gap-4">
              <Activity size={22} className="text-cyan-400 shrink-0 mt-0.5" />
              <p>Dashboards gerenciales con indicadores y alertas predictivas.</p>
            </motion.li>
            <motion.li variants={listItem} className="flex items-start gap-4">
              <FileText size={22} className="text-cyan-400 shrink-0 mt-0.5" />
              <p>Control centralizado de bitácoras y trazabilidad documental total.</p>
            </motion.li>
            <motion.li variants={listItem} className="flex items-start gap-4">
              <ShieldCheck size={22} className="text-cyan-400 shrink-0 mt-0.5" />
              <p>Cumplimiento normativo blindado y listo para cualquier auditoría.</p>
            </motion.li>
          </motion.ul>
        </motion.div>

      </div>
    </section>
  );
}