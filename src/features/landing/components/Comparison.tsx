// src/features/landing/components/Comparison.tsx
import { motion } from 'framer-motion';
import { AlertOctagon, CheckCircle, ArrowRight } from 'lucide-react';

export default function Comparison() {
  return (
    <section id="how" className="py-24 md:py-32 px-6 w-full max-w-[1200px] mx-auto overflow-hidden">
      
      {/* BUG FIX: viewport margin reducido a -20px para gatillar rápido en móviles */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-20 md:mb-28"
      >
        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-[1.1] md:leading-[1.05] mb-6 max-w-5xl mx-auto">
          Tu tranquilidad no <br className="hidden md:block" />
          <span className="text-slate-700">pertenece a un Excel.</span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400/90 font-medium leading-relaxed tracking-tight max-w-2xl mx-auto">
          El SG-SST es una obligación legal crítica. Dejarlo en manos de carpetas físicas es jugar con el futuro de tu empresa.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-stretch">
        
        {/* === EL PASADO (El problema) === */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="p-8 md:p-12 rounded-[2rem] bg-[#050608] border border-red-900/20 flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center gap-3 mb-10">
              <AlertOctagon size={24} className="text-red-900/60" strokeWidth={2} />
              <h4 className="text-slate-600 font-bold tracking-widest uppercase text-xs md:text-sm">
                El Costo del Caos
              </h4>
            </div>
            
            <ul className="space-y-8 text-slate-500 font-medium text-base md:text-lg">
              <li className="flex flex-col gap-1">
                <span className="text-slate-400 font-bold">Documentación Vulnerable</span>
                <span className="text-sm">Pérdida de planillas físicas y firmas ilegibles que invalidan las inducciones.</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-slate-400 font-bold">Ceguera Operativa</span>
                <span className="text-sm">Fechas de capacitaciones y exámenes médicos que vencen sin que nadie lo note.</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-slate-400 font-bold">Riesgo Financiero</span>
                <span className="text-sm">Exposición total a demandas laborales y sanciones del Ministerio de Trabajo.</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* === EL FUTURO (La Solución) === */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="relative p-8 md:p-12 rounded-[2rem] bg-[#0c131a] border border-cyan-500/30 flex flex-col justify-between isolate overflow-hidden shadow-[0_0_80px_-20px_rgba(6,182,212,0.15)]"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

          <div>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h4 className="text-white font-bold tracking-widest uppercase text-xs md:text-sm">
                  El Poder del Control
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
                Sistema SIS
              </span>
            </div>
            
            <ul className="space-y-8 text-slate-200 font-medium text-base md:text-lg">
              <li className="flex items-start gap-4">
                <CheckCircle size={24} className="text-cyan-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                <div className="flex flex-col gap-1">
                  <span className="text-white font-bold tracking-tight">Trazabilidad Absoluta</span>
                  <span className="text-sm text-slate-400">Evidencias digitales inalterables (Art. 2.2.4.6.12) disponibles 24/7 en la nube.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle size={24} className="text-cyan-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                <div className="flex flex-col gap-1">
                  <span className="text-white font-bold tracking-tight">Vigilancia Automatizada</span>
                  <span className="text-sm text-slate-400">Alertas predictivas que te avisan antes de que un estándar mínimo caduque.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle size={24} className="text-cyan-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                <div className="flex flex-col gap-1">
                  <span className="text-white font-bold tracking-tight">Auditorías a un Clic</span>
                  <span className="text-sm text-slate-400">Genera reportes gerenciales al instante. Demuestra cumplimiento en segundos.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5">
            <a href="#diagnostico" className="group inline-flex items-center gap-2 text-cyan-400 font-bold text-sm md:text-base hover:text-cyan-300 transition-colors">
              Iniciar transición al modelo digital 
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}