// src/features/landing/components/Comparison.tsx
import { motion } from 'framer-motion';
import { ArrowRight, FileX, ShieldCheck, Clock, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

const comparisonData = [
  {
    iconPast: <FileX size={20} />,
    titlePast: "Carpetas y Excel",
    descPast: "Documentación física vulnerable. Planillas que se pierden y firmas ilegibles.",
    iconFuture: <ShieldCheck size={20} />,
    titleFuture: "Nube Inalterable",
    descFuture: "Evidencia digital centralizada, disponible 24/7 y protegida bajo el Art. 2.2.4.6.12.",
  },
  {
    iconPast: <Clock size={20} />,
    titlePast: "Ceguera Operativa",
    descPast: "Capacitaciones y exámenes médicos vencidos sin que nadie lo note a tiempo.",
    iconFuture: <Zap size={20} />,
    titleFuture: "Vigilancia Activa",
    descFuture: "Alertas predictivas que notifican a los responsables antes de cualquier caducidad.",
  },
  {
    iconPast: <AlertTriangle size={20} />,
    titlePast: "Pánico de Auditoría",
    descPast: "Días enteros recopilando información ante una visita del Ministerio de Trabajo.",
    iconFuture: <CheckCircle2 size={20} />,
    titleFuture: "Auditorías a un Clic",
    descFuture: "Reportes gerenciales instantáneos para demostrar el cumplimiento total del estándar.",
  }
];

export default function Comparison() {
  return (
    // FIX: md:pt-4 asegura que en pantallas grandes este componente empiece casi inmediatamente debajo del Hero.
    <section id="how" className="relative z-10 bg-[#05080a] pt-12 pb-24 md:pt-4 md:pb-32 px-6 w-full mx-auto">
      
      <div className="max-w-[1200px] mx-auto w-full">
        {/* HEADER DE LA SECCIÓN */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: "opacity, transform" }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white-[0.02] text-slate-400 text-[11px] uppercase tracking-[0.2em] font-semibold mb-6">
            Evolución Operativa
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[1.1] mb-6 max-w-4xl mx-auto">
            Abandona la Edad de Piedra <br className="hidden md:block" />
            <span className="text-slate-700">del SG-SST.</span>
          </h2>
        </motion.div>

        {/* MATRIZ COMPARATIVA */}
        <div className="flex flex-col gap-4 md:gap-6">
          
          {/* Cabeceras ocultas en móvil, visibles en desktop para dar contexto */}
          <div className="hidden md:grid md:grid-cols-[1fr_auto_1.2fr] gap-8 px-8 mb-2">
            <div className="text-right text-xs font-bold uppercase tracking-widest text-slate-600">Modelo Tradicional</div>
            <div className="w-px" /> {/* Espaciador del divisor */}
            <div className="text-left text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Ecosistema SIS
            </div>
          </div>

          {comparisonData.map((row, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              style={{ willChange: "opacity, transform" }}
              className="group flex flex-col md:grid md:grid-cols-[1fr_auto_1.2fr] gap-0 md:gap-8 bg-[#0c1015] md:bg-transparent rounded-2xl md:rounded-none overflow-hidden md:overflow-visible border border-white/5 md:border-none"
            >
              
              {/* IZQUIERDA (El Problema) */}
              <div className="flex flex-col justify-center p-6 md:p-8 md:text-right md:bg-[#080b0e] md:rounded-[2rem] md:border md:border-white/5 transition-colors group-hover:border-red-900/10">
                <div className="flex items-center md:justify-end gap-3 mb-2 text-slate-600">
                  <div className="md:order-2">{row.iconPast}</div>
                  <h4 className="font-bold text-sm md:text-base tracking-tight line-through decoration-red-900/50">
                    {row.titlePast}
                  </h4>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm md:ml-auto">
                  {row.descPast}
                </p>
              </div>

              {/* DIVISOR CENTRAL */}
              <div className="hidden md:flex flex-col items-center justify-center relative">
                <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                <div className="w-8 h-8 rounded-full bg-[#05080a] border border-white/10 flex items-center justify-center relative z-10 text-slate-600 group-hover:text-cyan-500 group-hover:border-cyan-500/30 transition-colors duration-500">
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* DERECHA (La Solución) */}
              <div className="flex flex-col justify-center p-6 md:p-8 bg-cyan-950/10 md:bg-[#0c131a] border-t border-white/5 md:border-t-0 md:border md:border-cyan-500/20 md:rounded-[2rem] relative overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_40px_-15px_rgba(6,182,212,0.15)] group-hover:border-cyan-500/40">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(6,182,212,0.08)_0%,_transparent_70%)] pointer-events-none" />
                
                <div className="relative z-10 flex items-center gap-3 mb-2 text-cyan-400">
                  {row.iconFuture}
                  <h4 className="font-bold text-base md:text-lg tracking-tight text-white">
                    {row.titleFuture}
                  </h4>
                </div>
                <p className="relative z-10 text-slate-400 text-sm leading-relaxed max-w-md">
                  {row.descFuture}
                </p>
              </div>

            </motion.div>
          ))}

          {/* CTA INFERIOR */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex justify-center w-full relative z-10"
          >
            <a href="#diagnostico" className="group inline-flex items-center gap-2 px-8 py-4 bg-white/5 rounded-full text-cyan-400 font-bold text-sm hover:bg-white/10 transition-colors border border-white/5 hover:border-cyan-500/30">
              Iniciar transición digital 
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}