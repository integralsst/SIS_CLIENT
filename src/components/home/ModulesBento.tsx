"use client";

import { motion, type Variants } from 'framer-motion';
import { 
  Grid, 
  FileSpreadsheet, 
  Users, 
  Cpu, 
  CheckCircle2,
  FolderLock
} from 'lucide-react';

// --- ANIMACIONES FLUIDAS ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

export const ModulesBento = () => {
  return (
    // Se cambió el fondo a slate-50 para crear un contraste elegante con las tarjetas blancas
    <section id="modules" className="py-16 md:py-24 px-4 md:px-8 w-full max-w-full bg-slate-50 overflow-hidden">
      
      <div className="max-w-6xl mx-auto">
        {/* CABECERA DE LA SECCIÓN (Modificada para fondo claro) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold mb-6 shadow-sm">
            <Cpu size={14} /> Arquitectura Modular
          </div>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-[1.1]">
            Potencia técnica en cada <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              módulo del sistema
            </span>
          </h3>
          <p className="text-slate-600 font-medium max-w-xl mx-auto text-base md:text-lg">
            Herramientas diseñadas con rigor técnico para simplificar la complejidad operativa y blindar el cumplimiento normativo.
          </p>
        </motion.div>

        {/* --- BENTO GRID ASIMÉTRICO --- */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[auto]"
        >
          
          {/* === MÓDULO 1: MATRIZ DE RIESGOS (Ocupa 2 columnas) === */}
          <motion.div 
            variants={fadeUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="md:col-span-2 p-8 md:p-10 rounded-[2rem] border border-slate-200 bg-white relative overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 group"
          >
            {/* Acento superior sutil */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-80" />
            
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600 shadow-sm">
                  <Grid size={28} />
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
                  Metodología BS (3x3)
                </span>
              </div>

              <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                Matriz de Peligros y Valoración de Riesgos
              </h4>
              <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed max-w-xl mb-8">
                Supera las plantillas genéricas. Nuestro motor procesa la identificación de peligros y valoración en una matriz 3x3 basada en un estándar británico modificado, calculando el nivel de riesgo real de tu operación.
              </p>
            </div>

            {/* Mini-interfaz ilustrativa integrada (Light version) */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="block text-[10px] uppercase font-bold text-slate-500">Probabilidad</span>
                <span className="text-sm md:text-base font-bold text-cyan-700">Baja / Med / Alta</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="block text-[10px] uppercase font-bold text-slate-500">Consecuencia</span>
                <span className="text-sm md:text-base font-bold text-blue-700">Escala 1 a 3</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="block text-[10px] uppercase font-bold text-emerald-600">Controles</span>
                <span className="text-sm md:text-base font-bold text-emerald-700">Jerarquizados</span>
              </div>
            </div>
          </motion.div>

          {/* === MÓDULO 2: BITÁCORAS Y TRAZABILIDAD (Ocupa 1 columna) === */}
          <motion.div 
            variants={fadeUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-8 md:p-10 rounded-[2rem] border border-slate-200 bg-white relative overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
          >
            <div>
              <div className="p-3.5 w-fit rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-8 shadow-sm">
                <FileSpreadsheet size={28} />
              </div>
              <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                Bitácoras de Seguridad Cloud
              </h4>
              <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                Registra inspecciones, entrega de EPP e incidentes. Mantén un historial inmutable para cada una de las empresas de tu portafolio.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2.5 text-xs font-bold text-blue-700 bg-blue-50/80 p-3.5 rounded-xl border border-blue-200">
              <CheckCircle2 size={18} className="shrink-0 text-blue-500" />
              <span>Respaldo instantáneo sin pérdida</span>
            </div>
          </motion.div>

          {/* === MÓDULO 3: GESTIÓN DE COMITÉS (Ocupa 1 columna) === */}
          <motion.div 
            variants={fadeUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-8 md:p-10 rounded-[2rem] border border-slate-200 bg-white relative overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
          >
            <div>
              <div className="p-3.5 w-fit rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 mb-8 shadow-sm">
                <Users size={28} />
              </div>
              <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                Conformación COPASST y Vigías
              </h4>
              <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                Automatiza votaciones, generación de actas, reuniones mensuales y seguimiento de compromisos normativos por empresa.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2.5 text-xs font-bold text-purple-700 bg-purple-50/80 p-3.5 rounded-xl border border-purple-200">
              <CheckCircle2 size={18} className="shrink-0 text-purple-500" />
              <span>Plantillas listas para firma legal</span>
            </div>
          </motion.div>

          {/* === MÓDULO 4: AUDITORÍA Y REPOSITORIO (Ocupa 2 columnas) === */}
          <motion.div 
            variants={fadeUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="md:col-span-2 p-8 md:p-10 rounded-[2rem] border border-slate-200 bg-white relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300"
          >
            <div className="max-w-md">
              <div className="p-3.5 w-fit rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-6 shadow-sm">
                <FolderLock size={28} />
              </div>
              <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                Repositorio de Evidencias
              </h4>
              <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                Dile adiós a las carpetas desordenadas. Almacena certificados, carnets y políticas listos para exportar ante cualquier requerimiento de ARL o el Ministerio.
              </p>
            </div>

            {/* Bloque visual lateral (Light version) */}
            <div className="w-full md:w-auto flex flex-col gap-3 shrink-0 bg-slate-50 p-6 rounded-2xl border border-slate-200 min-w-[240px]">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span>Soporte Resolución 0312</span>
              </div>
              <div className="h-px w-full bg-slate-200 my-1.5" />
              <div className="text-xs text-slate-600 flex justify-between">
                <span>Disponibilidad:</span>
                <span className="text-slate-900 font-mono font-bold">24/7/365</span>
              </div>
              <div className="text-xs text-slate-600 flex justify-between">
                <span>Búsqueda:</span>
                <span className="text-emerald-600 font-bold">Instantánea</span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
export default ModulesBento;