"use client";

import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";

export default function CTASection() {
  return (
    // El fondo de la sección ahora es exactamente el mismo del Footer (#05080a)
    <section className="relative px-6 py-12 md:py-24 z-10 w-full selection:bg-cyan-500/30 bg-[#05080a]">
      
      {/* PUENTE ESTRUCTURAL: Extiende el fondo claro (slate-50) del FAQ solo hasta la mitad de esta sección.
          La mitad inferior revelará el color #05080a fusionándose perfectamente con el Footer. */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-slate-50 pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 lg:p-16 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl shadow-slate-950/50"
        >
          {/* Elementos Decorativos confinados a la tarjeta */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-10 w-64 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 blur-sm opacity-50" />

          {/* Bloque de Texto (Izquierda en desktop) */}
          <div className="relative z-10 lg:w-[60%] text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
              Sistematiza el SG-SST y blinda <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                tu responsabilidad legal.
              </span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Deja de depender de plantillas desactualizadas. Agenda una sesión técnica y parametriza la Resolución 0312 en minutos.
            </p>
          </div>

          {/* Bloque de Botones (Derecha en desktop) */}
          <div className="relative z-10 lg:w-[40%] flex justify-center lg:justify-end w-full">
            
            <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-base transition-all hover:bg-cyan-400 hover:scale-105 active:scale-95 shadow-[0_0_30px_-10px_rgba(6,182,212,0.5)] overflow-hidden w-full sm:w-auto">
              <span className="relative z-10 flex items-center gap-2">
                <CalendarCheck size={18} />
                Agendar Demo
              </span>
            </button>

          </div>
        </motion.div>

      </div>
    </section>
  );
}