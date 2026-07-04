"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Evidencias listas",
  },
  {
    icon: CalendarCheck,
    title: "Vencimientos visibles",
  },
  {
    icon: CheckCircle2,
    title: "Auditoría controlada",
  },
];

export default function CTASection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative z-10 w-full overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={reduceMotion ? undefined : { once: true, amount: 0.25 }}
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1] as const,
                }
          }
          className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_-55px_rgba(15,23,42,0.45)]"
        >
          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:p-14">
            {/* Bloque izquierdo */}
            <div className="text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                SG-SST bajo control
              </div>

              <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:mx-0 lg:text-6xl">
                Menos papel.
                <span className="block text-cyan-600">
                  Más control del SG-SST.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
                Centraliza evidencias, responsables, vencimientos y auditorías
                en un sistema más claro, ordenado y fácil de gestionar.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="#diagnostico"
                  aria-label="Agendar diagnóstico"
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-bold text-white transition-all duration-300 hover:bg-slate-800 active:scale-[0.98] sm:w-auto"
                >
                  <CalendarCheck size={18} strokeWidth={2.4} />
                  Agendar diagnóstico
                  <ArrowRight
                    size={17}
                    strokeWidth={2.4}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>

                <a
                  href="#how"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition-colors duration-300 hover:bg-slate-50 hover:text-slate-950 sm:w-auto"
                >
                  Ver cómo funciona
                </a>
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Implementación clara · Gestión trazable · Soporte técnico
              </p>
            </div>

            {/* Bloque derecho */}
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm">
                  <ShieldCheck size={24} strokeWidth={2} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Estado del sistema
                  </p>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                    Listo para auditar
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {highlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                        <Icon size={19} strokeWidth={2.2} />
                      </div>

                      <p className="text-sm font-bold text-slate-800">
                        {item.title}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                <p className="text-sm leading-relaxed text-cyan-900">
                  Una sección más liviana, directa y con mayor contraste visual
                  frente a bloques oscuros de la página.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}