"use client";

import { motion } from "framer-motion";
import { CalendarCheck, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    // Fondo unificado #05080a. Empalme perfecto y natural con FAQ y Footer.
    <section className="relative px-4 sm:px-6 py-24 md:py-32 z-10 w-full bg-[#05080a] isolate flex justify-center">

      <div className="max-w-[1200px] w-full relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: "opacity, transform" }}
          className="relative bg-[#0c1015] border border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-8 sm:p-12 md:p-16 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 group transition-colors hover:border-cyan-500/20"
        >
          {/* Aceleración por GPU: Resplandor radial sin blurs de CSS */}
          <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.1)_0%,_transparent_50%)] pointer-events-none -z-10 transition-opacity duration-700 opacity-50 group-hover:opacity-100" />

          {/* Malla Vectorial Ultraligera */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] -z-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <rect width="40" height="40" fill="none" stroke="#ffffff" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-grid)" />
            </svg>
          </div>

          {/* Bloque de Texto */}
          <div className="relative z-10 lg:w-[60%] text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Despliegue Inmediato
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] mb-6 tracking-tighter">
              Sistematiza el SG-SST y blinda <br className="hidden lg:block" />
              <span className="text-slate-600">tu responsabilidad legal.</span>
            </h2>
            
            <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed max-w-xl">
              Deja de depender de plantillas desactualizadas. Implementa un motor paramétrico que automatiza la Resolución 0312 y audita tu operación en tiempo real.
            </p>
          </div>

          {/* Bloque de Botones */}
          <div className="relative z-10 lg:w-[40%] flex flex-col items-center lg:items-end w-full gap-4">
            <a
              href="#diagnostico"
              className="group/btn relative inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-cyan-400 text-slate-950 font-bold text-sm md:text-base transition-all hover:bg-cyan-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto overflow-hidden shadow-[0_0_40px_-10px_rgba(6,182,212,0.4)]"
            >
              <CalendarCheck size={20} strokeWidth={2.5} className="transition-transform group-hover/btn:-translate-y-0.5" />
              <span className="relative z-10">Agendar Sesión Técnica</span>
              <ArrowRight size={18} className="absolute right-6 opacity-0 -translate-x-4 transition-all group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
            </a>
            
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest text-center lg:text-right w-full">
              Cupos limitados para julio 2026
            </p>
          </div>
          
        </motion.div>

      </div>
    </section>
  );
}