
import { motion } from 'framer-motion';
import { DiagnosticQuiz } from '../../components/home/DiagnosticQuiz';
import { Timer, Lock, Scale } from 'lucide-react';

// Importamos el logo desde la carpeta assets. 
// (Asegúrate de que la extensión sea la correcta: .png, .svg, etc.)
import logoSIS from '../../assets/logosis.webp'; 

export default function DiagnosticoPage() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col lg:flex-row font-sans selection:bg-cyan-500/30 overflow-hidden">
      
      {/* ==========================================
          LADO IZQUIERDO: Propuesta de Valor y Confianza
          ========================================== */}
      <div className="relative w-full lg:w-5/12 flex flex-col justify-between p-6 md:p-12 lg:p-16 xl:p-20 border-b lg:border-b-0 lg:border-r border-slate-800/50 z-10">
        
        {/* Fondo sutil tipo cuadrícula técnica (sin destellos de luz excesivos) */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative z-10">
          {/* LOGO CORPORATIVO */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 md:mb-20"
          >
            <img 
              src={logoSIS} 
              alt="SIS Riesgos Laborales Logo" 
              className="h-10 md:h-12 w-auto object-contain"
            />
          </motion.div>

          {/* COPY PERSUASIVO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium mb-6">
              <Scale size={12} /> Auditoría Normativa 2026
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
              ¿Sobrevivirías a una <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                visita del Ministerio?
              </span>
            </h1>
            
            <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-md mb-10">
              La gestión en Excel ya no es suficiente. Evalúa la madurez de tu SG-SST, identifica brechas críticas y descubre si estás en riesgo de sanción.
            </p>

            {/* MICRO-COMPROMISOS (Derribar objeciones) */}
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400"><Timer size={16} /></div>
                Resultados en menos de 2 minutos.
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400"><Lock size={16} /></div>
                Análisis 100% privado y confidencial.
              </li>
            </ul>
          </motion.div>
        </div>

        {/* FOOTER IZQUIERDO (Solo en Desktop) */}
        <div className="hidden lg:block relative z-10 mt-12 text-slate-500 text-xs font-medium">
          <p>© {new Date().getFullYear()} SIS Sistema Integral en Riesgos Laborales S.A.S.</p>
        </div>
      </div>

      {/* ==========================================
          LADO DERECHO: El Diagnóstico Interactivo
          ========================================== */}
      <div className="relative w-full lg:w-7/12 flex items-center justify-center p-4 md:p-8 lg:p-12 bg-[#0a0f16] z-0">
        
        {/* Patrón de puntos para darle profundidad al fondo del quiz */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative z-10 w-full max-w-2xl"
        >
          {/* El componente del Quiz importado */}
          <DiagnosticQuiz />
        </motion.div>

      </div>

      {/* FOOTER MÓVIL (Visible solo en pantallas pequeñas) */}
      <div className="lg:hidden w-full p-6 bg-[#0a0f16] text-center text-slate-500 text-xs font-medium border-t border-slate-800/50">
        <p>© {new Date().getFullYear()} SIS Sistema Integral en Riesgos Laborales S.A.S.</p>
      </div>

    </div>
  );
}