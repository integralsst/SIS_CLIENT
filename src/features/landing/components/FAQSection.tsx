"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Scale, 
  ShieldAlert, 
  Database, 
  Building2, 
  Lock,
  Terminal
} from "lucide-react";

// --- DATOS DEL FAQ ---
const faqs = [
  {
    id: "01",
    category: "Normativo",
    title: "¿El sistema cumple con la Resolución 0312?",
    desc: "Totalmente. El software parametriza los estándares mínimos según el tamaño y nivel de riesgo de la empresa, actualizándose automáticamente frente a cualquier modificación del Ministerio de Trabajo.",
    icon: Scale,
    color: "cyan"
  },
  {
    id: "02",
    category: "Metodología",
    title: "¿Qué matriz de riesgos utiliza?",
    desc: "A diferencia de las plantillas genéricas, nuestro motor integra una matriz de riesgos 3x3 basada en un estándar británico modificado, permitiendo una valoración técnica, jerarquizada y precisa de los controles operativos.",
    icon: ShieldAlert,
    color: "blue"
  },
  {
    id: "03",
    category: "Implementación",
    title: "¿Cómo migro mis Excel actuales al sistema?",
    desc: "Contamos con módulos de importación masiva. Puedes cargar tus bases de datos de trabajadores, inventarios de EPP y matrices actuales directamente al sistema para no empezar desde cero.",
    icon: Database,
    color: "emerald"
  },
  {
    id: "04",
    category: "Multi-Empresa",
    title: "¿Puedo gestionar a todos mis clientes aquí?",
    desc: "Sí. La arquitectura multi-tenant está diseñada específicamente para asesores y consultores. Mantienes la información de hasta 90+ empresas totalmente aislada, con dashboards individuales para cada una.",
    icon: Building2,
    color: "cyan"
  },
  {
    id: "05",
    category: "Seguridad",
    title: "¿Qué validez tienen las bitácoras cloud?",
    desc: "El repositorio cuenta con trazabilidad inmutable y disponibilidad 24/7. Las actas de COPASST y bitácoras generadas sirven como evidencia digital totalmente válida ante requerimientos de ARL o auditorías.",
    icon: Lock,
    color: "blue"
  }
];

const colorMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  cyan: { text: "text-cyan-400", bg: "bg-cyan-950/30", border: "border-cyan-500/20", glow: "from-cyan-500/10" },
  blue: { text: "text-blue-400", bg: "bg-blue-950/30", border: "border-blue-500/20", glow: "from-blue-500/10" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-950/30", border: "border-emerald-500/20", glow: "from-emerald-500/10" },
};

export default function FAQSection() {
  return (
    // FIX: Eliminado 'overflow-hidden' para permitir que el 'sticky' funcione en el DOM
    <section className="relative py-24 md:py-32 px-4 sm:px-6 w-full max-w-[100vw] bg-[#05080a] isolate">
      
      {/* MALLA DE FONDO */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] -z-10 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="faq-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#faq-grid)" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto w-full relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* === COLUMNA IZQUIERDA (Sticky Container) === */}
          {/* FIX: Se remueve el flex-col interno y se establece altura implícita por el row padre */}
          <div className="lg:w-5/12 relative">
            
            {/* FIX: Contenedor Sticky limpio */}
            <div className="lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "opacity, transform" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/5 bg-white/5 text-slate-300 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold mb-6">
                  <Terminal size={14} strokeWidth={2.5} /> Base de Conocimiento
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-6 tracking-tighter">
                  Transparencia <br />
                  <span className="text-slate-700">técnica y legal.</span>
                </h2>
                
                <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed mb-10 max-w-md">
                  Sabemos que la responsabilidad civil y penal del SG-SST no es un juego. Aquí respondemos las dudas críticas sobre la solidez de nuestra arquitectura.
                </p>

                <div className="hidden lg:flex items-center gap-3 text-cyan-500/70 text-xs font-bold tracking-widest uppercase">
                  <span>Auditar registros</span>
                  <ArrowRight size={14} className="animate-pulse" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* === COLUMNA DERECHA: Nodos de Información === */}
          <div className="lg:w-7/12 flex flex-col relative">
            
            {/* Línea de tiempo vertical */}
            <div className="absolute top-8 bottom-8 left-[31px] md:left-[39px] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden sm:block z-0" />

            <div className="flex flex-col gap-6 md:gap-8 relative z-10">
              {faqs.map((faq, index) => {
                const theme = colorMap[faq.color];

                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "opacity, transform" }}
                    className="group flex flex-col sm:flex-row gap-5 md:gap-8 items-start relative"
                  >
                    
                    {/* Icono / Nodo de conexión */}
                    <div className="relative shrink-0 flex items-center justify-center">
                      <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#0c1015] border border-white/5 flex items-center justify-center shadow-lg transition-colors group-hover:${theme.border} z-10 isolate overflow-hidden`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                        <faq.icon className={`w-7 h-7 md:w-8 md:h-8 ${theme.text} transition-transform group-hover:scale-110`} strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Contenedor de contenido */}
                    <div className={`flex-1 p-6 md:p-8 rounded-[2rem] bg-[#0c131a] border border-white/5 transition-colors group-hover:${theme.border} relative overflow-hidden`}>
                      
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border ${theme.border} ${theme.bg} ${theme.text}`}>
                          {faq.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-600 ml-auto">LOG_{faq.id}</span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-3 pr-4">
                        {faq.title}
                      </h3>
                      
                      <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                        {faq.desc}
                      </p>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}