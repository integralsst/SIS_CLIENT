"use client";

import { motion, type Variants } from 'framer-motion';
import { 
  Grid, 
  FileSpreadsheet, 
  Users, 
  Cpu, 
  FolderLock,
  ArrowRight
} from 'lucide-react';

// --- ANIMACIONES ACELERADAS ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const ModulesBento = () => {
  return (
    <section id="modules" className="relative py-24 md:py-32 px-4 sm:px-6 w-full max-w-[100vw] bg-slate-50 overflow-hidden isolate">
      
      {/* MALLA SUTIL DE FONDO (Aspecto Técnico) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] -z-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="module-grid-light" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#0f172a" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#module-grid-light)" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto w-full">
        
        {/* === CABECERA DE LA SECCIÓN === */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          style={{ willChange: "opacity, transform" }}
          className="text-center mb-16 md:mb-24 px-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-blue-200/60 bg-blue-50 text-blue-700 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold mb-6">
            <Cpu size={14} strokeWidth={2.5} /> Arquitectura Modular
          </div>
          <h3 className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter mb-6 leading-[1.05] max-w-4xl mx-auto">
            Potencia técnica en cada <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">módulo del sistema.</span>
          </h3>
          <p className="text-slate-600 font-medium max-w-2xl mx-auto text-sm md:text-lg md:leading-relaxed">
            Herramientas desarrolladas con rigor de ingeniería para simplificar la complejidad operativa y blindar el cumplimiento normativo.
          </p>
        </motion.div>

        {/* === BENTO GRID === */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
        >
          
          {/* === MÓDULO 1: MATRIZ DE RIESGOS (Columna ancha) === */}
          <motion.div 
            variants={fadeUp}
            style={{ willChange: "opacity, transform" }}
            className="md:col-span-2 group relative p-6 md:p-10 rounded-[2rem] bg-white border border-slate-200/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.15)] hover:border-cyan-200"
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 md:mb-10">
                <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600 group-hover:scale-110 transition-transform">
                  <Grid size={24} strokeWidth={2} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-widest border border-cyan-200/50 bg-cyan-50 px-3 py-1 rounded-full">
                    Metodología BS (3x3)
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                  Matriz de Peligros y Valoración.
                </h4>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl mb-8 font-medium">
                  Supera las plantillas genéricas estáticas. Nuestro motor procesa la identificación de peligros estructurando una matriz 3x3 que calcula de manera exacta el nivel de riesgo real de tu operación.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Probabilidad</span>
                  <span className="text-sm font-bold text-slate-800">Baja / Med / Alta</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Consecuencia</span>
                  <span className="text-sm font-bold text-slate-800">Escala Paramétrica</span>
                </div>
                <div className="bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100/50">
                  <span className="block text-[10px] uppercase tracking-widest font-bold text-cyan-600 mb-1">Controles</span>
                  <span className="text-sm font-bold text-cyan-700">Jerarquizados</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* === MÓDULO 2: BITÁCORAS CLOUD (Columna simple) === */}
          <motion.div 
            variants={fadeUp}
            style={{ willChange: "opacity, transform" }}
            className="group relative p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] hover:border-blue-200"
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="p-3 w-fit rounded-xl bg-blue-50 text-blue-600 mb-8 md:mb-12 group-hover:scale-110 transition-transform">
                <FileSpreadsheet size={24} strokeWidth={2} />
              </div>
              
              <div className="flex-1">
                <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                  Bitácoras Cloud
                </h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                  Registra inspecciones, entrega de EPP e incidentes generando un historial inmutable para cada empleado.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-auto pt-5 border-t border-slate-100">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                  <ArrowRight size={12} className="text-blue-600" />
                </div>
                <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">Trazabilidad Total</span>
              </div>
            </div>
          </motion.div>

          {/* === MÓDULO 3: GESTIÓN DE COMITÉS (Columna simple) === */}
          <motion.div 
            variants={fadeUp}
            style={{ willChange: "opacity, transform" }}
            className="group relative p-6 md:p-8 rounded-[2rem] bg-white border border-slate-200/60 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.15)] hover:border-purple-200"
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="p-3 w-fit rounded-xl bg-purple-50 text-purple-600 mb-8 md:mb-12 group-hover:scale-110 transition-transform">
                <Users size={24} strokeWidth={2} />
              </div>
              
              <div className="flex-1">
                <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                  Comités y Vigías
                </h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                  Estructura votaciones, actas de apertura y seguimiento de compromisos (COPASST) de forma centralizada.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-auto pt-5 border-t border-slate-100">
                <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center">
                  <ArrowRight size={12} className="text-purple-600" />
                </div>
                <span className="text-xs font-bold text-purple-700 tracking-wider uppercase">Flujo Automatizado</span>
              </div>
            </div>
          </motion.div>

          {/* === MÓDULO 4: REPOSITORIO (Columna ancha Inferior) === */}
          <motion.div 
            variants={fadeUp}
            style={{ willChange: "opacity, transform" }}
            className="md:col-span-2 group relative p-6 md:p-10 rounded-[2rem] bg-white border border-slate-200/60 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] hover:border-emerald-200"
          >
            <div className="relative z-10 max-w-md w-full">
              <div className="p-3 w-fit rounded-xl bg-emerald-50 text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <FolderLock size={24} strokeWidth={2} />
              </div>
              <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                Repositorio de Evidencias
              </h4>
              <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
                Almacenamiento indexado de certificados, inducciones y políticas listos para ser exportados o auditados en segundos por el Ministerio.
              </p>
            </div>

            <div className="relative z-10 w-full sm:w-auto flex flex-col gap-4 shrink-0 bg-slate-50 p-6 rounded-2xl border border-slate-100 sm:min-w-[280px]">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Base de Datos Segura</span>
              </div>
              <div className="h-px w-full bg-slate-200/60 my-1" />
              <div className="flex flex-col gap-3">
                <div className="text-xs text-slate-500 flex justify-between items-center gap-4">
                  <span className="uppercase tracking-widest font-semibold">Disponibilidad</span>
                  <span className="text-slate-700 font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200">24/7</span>
                </div>
                <div className="text-xs text-slate-500 flex justify-between items-center gap-4">
                  <span className="uppercase tracking-widest font-semibold">Búsqueda</span>
                  <span className="text-emerald-700 font-bold bg-emerald-100/50 px-2 py-1 rounded">Milisegundos</span>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default ModulesBento;