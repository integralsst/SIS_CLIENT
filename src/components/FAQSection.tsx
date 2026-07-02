"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Scale, 
  ShieldAlert, 
  Database, 
  Building2, 
  Lock,
  MessageCircleQuestion
} from "lucide-react";

// --- DATOS DEL FAQ (Orientados al SG-SST) ---
const faqs = [
  {
    id: "01",
    category: "Normativo",
    title: "¿El sistema cumple con la Resolución 0312?",
    desc: "Totalmente. El software parametriza los estándares mínimos según el tamaño y nivel de riesgo de la empresa, actualizándose automáticamente frente a cualquier modificación del Ministerio de Trabajo.",
    icon: Scale,
    color: "text-blue-600",
    bgIcon: "bg-blue-500/10",
    borderIcon: "border-blue-500/30",
    badgeStyles: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    id: "02",
    category: "Metodología",
    title: "¿Qué matriz de riesgos utiliza?",
    desc: "A diferencia de las plantillas genéricas, nuestro motor integra una matriz de riesgos 3x3 basada en un estándar británico modificado, permitiendo una valoración técnica, jerarquizada y precisa de los controles operativos.",
    icon: ShieldAlert,
    color: "text-cyan-600",
    bgIcon: "bg-cyan-500/10",
    borderIcon: "border-cyan-500/30",
    badgeStyles: "bg-cyan-50 text-cyan-700 border-cyan-200"
  },
  {
    id: "03",
    category: "Implementación",
    title: "¿Cómo migro mis Excel actuales al sistema?",
    desc: "Contamos con módulos de importación masiva. Puedes cargar tus bases de datos de trabajadores, inventarios de EPP y matrices actuales directamente al sistema para no empezar desde cero.",
    icon: Database,
    color: "text-emerald-600",
    bgIcon: "bg-emerald-500/10",
    borderIcon: "border-emerald-500/30",
    badgeStyles: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    id: "04",
    category: "Multi-Empresa",
    title: "¿Puedo gestionar a todos mis clientes aquí?",
    desc: "Sí. La arquitectura multi-tenant está diseñada específicamente para asesores y consultores. Mantienes la información de hasta 90+ empresas totalmente aislada, con dashboards individuales para cada una.",
    icon: Building2,
    color: "text-blue-600",
    bgIcon: "bg-blue-500/10",
    borderIcon: "border-blue-500/30",
    badgeStyles: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    id: "05",
    category: "Seguridad",
    title: "¿Qué validez tienen las bitácoras cloud?",
    desc: "El repositorio cuenta con trazabilidad inmutable y disponibilidad 24/7. Las actas de COPASST y bitácoras generadas sirven como evidencia digital totalmente válida ante requerimientos de ARL o auditorías.",
    icon: Lock,
    color: "text-slate-600",
    bgIcon: "bg-slate-500/10",
    borderIcon: "border-slate-500/30",
    badgeStyles: "bg-slate-100 text-slate-700 border-slate-200"
  }
];

export default function FAQSection() {
  return (
    <section className="pb-24 pt-32 md:pt-44 -mt-12 md:-mt-20 z-10 bg-slate-50 relative selection:bg-cyan-200 selection:text-slate-900">
      
      {/* Elementos Decorativos de Fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-200/30 to-transparent blur-3xl opacity-60" />
        <div className="absolute bottom-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-200/30 to-transparent blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* COLUMNA IZQUIERDA: Sticky Content */}
          <div className="lg:w-5/12 flex flex-col items-start relative">
            <div className="lg:sticky lg:top-32 lg:pb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-12 h-[2px] bg-blue-600"></span>
                  <span className="text-blue-600 font-bold tracking-[0.2em] text-xs uppercase flex items-center gap-2">
                    <MessageCircleQuestion size={14} /> Resolvemos tus dudas
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                  Transparencia <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                    técnica y legal.
                  </span>
                </h2>
                
                <p className="text-slate-600 text-lg font-medium leading-relaxed mb-10 max-w-md">
                  Sabemos que la responsabilidad civil y penal del SG-SST no es un juego. Aquí respondemos las dudas más comunes sobre la solidez de nuestro software.
                </p>

                <div className="hidden lg:flex items-center gap-3 text-slate-400 text-sm font-bold tracking-widest uppercase animate-pulse">
                  <span>Explora las respuestas</span>
                  <ArrowRight size={16} className="text-cyan-500" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Scrolling Cards */}
          <div className="lg:w-7/12 flex flex-col gap-6 md:gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border border-slate-200 hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-500 overflow-hidden"
              >
                {/* Resplandor hover dinámico */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${faq.bgIcon}`}></div>

                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start relative z-10">
                  
                  {/* Icono animado */}
                  <div className="relative shrink-0 w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                    <motion.div 
                      className={`absolute inset-0 border-2 rounded-2xl ${faq.borderIcon}`}
                      animate={{ scale: [1, 1.15, 1], opacity: [0, 1, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    />
                    <faq.icon className={`w-8 h-8 ${faq.color}`} strokeWidth={1.5} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col items-start gap-2 mb-4">
                      {/* Badge de Categoría */}
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border ${faq.badgeStyles}`}>
                        {faq.category}
                      </span>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-bold text-slate-300">{faq.id}</span>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{faq.title}</h3>
                      </div>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {faq.desc}
                    </p>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}