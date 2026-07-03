"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Scale,
  ShieldCheck,
  Database,
  Building2,
  Lock,
  Terminal,
  FileCheck2,
} from "lucide-react";

// --- DATOS DEL FAQ ---
const faqs = [
  {
    id: "01",
    category: "Normativo",
    title: "¿El servicio está alineado con la Resolución 0312?",
    desc: "Sí. Nuestro servicio se estructura con base en los estándares mínimos aplicables al SG-SST en Colombia, teniendo en cuenta el tamaño de la empresa, el número de trabajadores y el nivel de riesgo. Esto permite orientar el cumplimiento documental, técnico y operativo de forma organizada.",
    icon: Scale,
    color: "cyan",
  },
  {
    id: "02",
    category: "Diagnóstico",
    title: "¿Cómo saben qué necesita mi empresa?",
    desc: "Iniciamos con una revisión del estado actual del SG-SST para identificar avances, brechas y prioridades. A partir de ese diagnóstico definimos un plan de trabajo claro, con actividades, responsables, documentos requeridos y evidencias necesarias para fortalecer el cumplimiento.",
    icon: ShieldCheck,
    color: "blue",
  },
  {
    id: "03",
    category: "Documentación",
    title: "¿Qué pasa si ya tengo documentos o archivos en Excel?",
    desc: "No tienes que empezar desde cero. Revisamos la información existente, depuramos lo que sea útil y organizamos los soportes necesarios dentro del proceso de cumplimiento. El objetivo es aprovechar lo que ya tienes y corregir lo que esté incompleto, desactualizado o sin trazabilidad.",
    icon: Database,
    color: "emerald",
  },
  {
    id: "04",
    category: "Implementación",
    title: "¿El servicio incluye acompañamiento durante el proceso?",
    desc: "Sí. Acompañamos a la empresa en la organización, actualización y seguimiento del SG-SST. Nuestro enfoque no es solo entregar documentos, sino ayudar a que el sistema funcione con evidencias reales, actividades verificables y una gestión más ordenada.",
    icon: Building2,
    color: "cyan",
  },
  {
    id: "05",
    category: "Evidencias",
    title: "¿Las actas, registros y bitácoras sirven como soporte?",
    desc: "Sí. Las actas, bitácoras, registros de capacitación, inspecciones, seguimientos y demás soportes hacen parte de la evidencia del SG-SST. Nuestro servicio ayuda a organizarlos para que puedan ser consultados y presentados ante auditorías, requerimientos de la ARL o visitas de autoridad competente.",
    icon: FileCheck2,
    color: "blue",
  },
  {
    id: "06",
    category: "Seguridad",
    title: "¿La información de mi empresa se maneja de forma confidencial?",
    desc: "Sí. La información suministrada por la empresa se maneja con reserva y se utiliza únicamente para el desarrollo del servicio contratado. Los documentos, registros y datos del SG-SST son tratados como información sensible de la organización.",
    icon: Lock,
    color: "emerald",
  },
];

const colorMap: Record<
  string,
  {
    text: string;
    bg: string;
    border: string;
    hoverBorder: string;
    glow: string;
  }
> = {
  cyan: {
    text: "text-cyan-400",
    bg: "bg-cyan-950/30",
    border: "border-cyan-500/20",
    hoverBorder: "group-hover:border-cyan-500/30",
    glow: "from-cyan-500/10",
  },
  blue: {
    text: "text-blue-400",
    bg: "bg-blue-950/30",
    border: "border-blue-500/20",
    hoverBorder: "group-hover:border-blue-500/30",
    glow: "from-blue-500/10",
  },
  emerald: {
    text: "text-emerald-400",
    bg: "bg-emerald-950/30",
    border: "border-emerald-500/20",
    hoverBorder: "group-hover:border-emerald-500/30",
    glow: "from-emerald-500/10",
  },
};

export default function FAQSection() {
  return (
    <section className="relative isolate w-full max-w-[100vw] bg-[#05080a] px-4 py-24 sm:px-6 md:py-32">
      {/* MALLA DE FONDO */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.02]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="faq-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#faq-grid)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px]">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-24">
          {/* === COLUMNA IZQUIERDA === */}
          <div className="relative lg:w-5/12">
            <div className="lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "opacity, transform" }}
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 md:px-4 md:py-2 md:text-[11px]">
                  <Terminal size={14} strokeWidth={2.5} />
                  Preguntas frecuentes
                </div>

                <h2 className="mb-6 text-4xl font-bold leading-[1.05] tracking-tighter text-white md:text-5xl lg:text-6xl">
                  Claridad para cumplir{" "}
                  <span className="text-slate-700">sin improvisar.</span>
                </h2>

                <p className="mb-10 max-w-md text-sm font-medium leading-relaxed text-slate-400 md:text-lg">
                  Sabemos que el SG-SST requiere orden, evidencia y seguimiento.
                  Aquí resolvemos las preguntas más comunes de las empresas que
                  necesitan fortalecer su cumplimiento en Colombia.
                </p>

                <div className="hidden items-center gap-3 text-xs font-bold uppercase tracking-widest text-cyan-500/70 lg:flex">
                  <span>Iniciar diagnóstico</span>
                  <ArrowRight size={14} className="animate-pulse" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* === COLUMNA DERECHA === */}
          <div className="relative flex flex-col lg:w-7/12">
            {/* Línea de tiempo vertical */}
            <div className="absolute bottom-8 left-[31px] top-8 z-0 hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent sm:block md:left-[39px]" />

            <div className="relative z-10 flex flex-col gap-6 md:gap-8">
              {faqs.map((faq, index) => {
                const theme = colorMap[faq.color];

                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ willChange: "opacity, transform" }}
                    className="group relative flex flex-col items-start gap-5 sm:flex-row md:gap-8"
                  >
                    {/* Icono / Nodo */}
                    <div className="relative flex shrink-0 items-center justify-center">
                      <div
                        className={`relative z-10 isolate flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-[#0c1015] shadow-lg transition-colors md:h-20 md:w-20 ${theme.hoverBorder}`}
                      >
                        <div
                          className={`absolute inset-0 -z-10 bg-gradient-to-br ${theme.glow} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                        />
                        <faq.icon
                          className={`h-7 w-7 transition-transform group-hover:scale-110 md:h-8 md:w-8 ${theme.text}`}
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>

                    {/* Contenido */}
                    <div
                      className={`relative flex-1 overflow-hidden rounded-[2rem] border border-white/5 bg-[#0c131a] p-6 transition-colors md:p-8 ${theme.hoverBorder}`}
                    >
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${theme.border} ${theme.bg} ${theme.text}`}
                        >
                          {faq.category}
                        </span>

                        <span className="ml-auto font-mono text-xs font-bold text-slate-600">
                          FAQ_{faq.id}
                        </span>
                      </div>

                      <h3 className="mb-3 pr-4 text-xl font-bold tracking-tight text-white md:text-2xl">
                        {faq.title}
                      </h3>

                      <p className="text-sm font-medium leading-relaxed text-slate-400 md:text-base">
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