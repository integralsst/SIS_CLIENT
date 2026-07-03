import { motion } from 'framer-motion';
import { AlertOctagon, CheckCircle, ArrowRight, EyeOff, TrendingDown, ShieldCheck, Activity, FileCheck2 } from 'lucide-react';

export default function Comparison() {
  return (
    <section id="how" className="py-24 md:py-32 px-0 md:px-6 w-full max-w-[1200px] mx-auto overflow-hidden">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: "opacity, transform" }}
        className="text-center mb-16 md:mb-28 px-6"
      >
        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-[1.1] md:leading-[1.05] mb-6 max-w-5xl mx-auto">
          Tu tranquilidad no <br className="hidden md:block" />
          <span className="text-slate-700">pertenece a un Excel.</span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400/90 font-medium leading-relaxed tracking-tight max-w-2xl mx-auto">
          El SG-SST es una obligación legal crítica. Dejarlo en manos de carpetas físicas es jugar con el futuro de tu empresa.
        </p>
      </motion.div>

      {/* CONTENEDOR HÍBRIDO: Carrusel CSS Scroll Snap en Móvil / Grid en Desktop */}
      <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 gap-6 md:gap-8 items-stretch px-6 md:px-0 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* === EL PASADO (El problema) === */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ willChange: "opacity, transform" }}
          // SNAP CENTER para carrusel móvil
          className="min-w-[85vw] md:min-w-0 snap-center shrink-0 p-8 md:p-12 rounded-[2rem] bg-[#050608] border border-red-900/20 flex flex-col justify-between group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-12 px-4 py-1.5 rounded-full bg-red-950/30 border border-red-900/30">
              <AlertOctagon size={16} className="text-red-500" strokeWidth={2.5} />
              <h4 className="text-red-400 font-bold tracking-widest uppercase text-xs">
                El Costo del Caos
              </h4>
            </div>
            
            {/* Ítems rediseñados en bloques verticales centrados */}
            <div className="flex flex-col gap-10 text-slate-500 w-full max-w-xs mx-auto">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/5 text-slate-600">
                  <FileCheck2 size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block text-slate-400 font-bold text-lg mb-1">Documentación Vulnerable</span>
                  <span className="text-sm leading-relaxed">Pérdida de planillas físicas y firmas ilegibles que invalidan las inducciones.</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/5 text-slate-600">
                  <EyeOff size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block text-slate-400 font-bold text-lg mb-1">Ceguera Operativa</span>
                  <span className="text-sm leading-relaxed">Fechas de capacitaciones y exámenes médicos que vencen sin que nadie lo note.</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/5 text-slate-600">
                  <TrendingDown size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block text-slate-400 font-bold text-lg mb-1">Riesgo Financiero</span>
                  <span className="text-sm leading-relaxed">Exposición total a demandas laborales y sanciones del Ministerio de Trabajo.</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* === EL FUTURO (La Solución) === */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          style={{ willChange: "opacity, transform" }}
          className="relative min-w-[85vw] md:min-w-0 snap-center shrink-0 p-8 md:p-12 rounded-[2rem] bg-[#0c131a] border border-cyan-500/30 flex flex-col justify-between isolate overflow-hidden"
        >
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.08)_0%,_transparent_50%)] pointer-events-none -z-10" />
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-12 px-4 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-500/30">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h4 className="text-cyan-400 font-bold tracking-widest uppercase text-xs">
                El Poder del Control
              </h4>
            </div>
            
            <div className="flex flex-col gap-10 text-slate-200 w-full max-w-xs mx-auto">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <ShieldCheck size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block text-white font-bold text-lg mb-1 tracking-tight">Trazabilidad Absoluta</span>
                  <span className="text-sm text-slate-400 leading-relaxed">Evidencias digitales inalterables (Art. 2.2.4.6.12) disponibles 24/7 en la nube.</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Activity size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block text-white font-bold text-lg mb-1 tracking-tight">Vigilancia Automatizada</span>
                  <span className="text-sm text-slate-400 leading-relaxed">Alertas predictivas que te avisan antes de que un estándar mínimo caduque.</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <CheckCircle size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block text-white font-bold text-lg mb-1 tracking-tight">Auditorías a un Clic</span>
                  <span className="text-sm text-slate-400 leading-relaxed">Genera reportes gerenciales al instante. Demuestra cumplimiento en segundos.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/5 flex justify-center w-full">
            <a href="#diagnostico" className="group inline-flex items-center gap-2 text-cyan-400 font-bold text-sm md:text-base hover:text-cyan-300 transition-colors">
              Transición al modelo digital 
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}