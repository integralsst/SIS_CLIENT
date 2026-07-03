"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from "lucide-react";

const proofPoints = [
  {
    icon: ShieldCheck,
    title: "Evidencia trazable",
    description: "Documentos, registros y soportes organizados para auditoría.",
  },
  {
    icon: Zap,
    title: "Activación rápida",
    description: "Diagnóstico inicial y despliegue del sistema sin fricción.",
  },
  {
    icon: CheckCircle2,
    title: "Control operativo",
    description: "Seguimiento de responsables, vencimientos y cumplimiento.",
  },
];

export default function CTASection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative z-10 flex w-full justify-center overflow-hidden bg-[#05080a] px-4 py-14 sm:px-6 sm:py-20 md:py-32">
      {/* Fondo ambiental liviano */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.09),transparent_68%)] sm:h-[420px] sm:w-[720px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="absolute inset-0 hidden md:block">
          <svg
            className="absolute right-0 top-0 h-full w-[54%] opacity-[0.08]"
            viewBox="0 0 600 600"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M80 520 C180 360 300 420 420 240 S520 90 590 150"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="8 12"
            />
            <path
              d="M120 570 C240 390 330 470 460 290 S550 130 620 190"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="8 12"
            />
            <circle cx="445" cy="235" r="84" stroke="white" strokeWidth="1" />
            <circle cx="445" cy="235" r="42" stroke="white" strokeWidth="1" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1200px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={reduceMotion ? undefined : { once: true, amount: 0.25 }}
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1] as const,
                }
          }
          style={{ willChange: reduceMotion ? "auto" : "opacity, transform" }}
          className="group relative overflow-hidden rounded-[1.75rem] border border-white/5 bg-[#0c1015] shadow-[0_0_70px_-35px_rgba(6,182,212,0.35)] sm:rounded-[2rem] md:rounded-[3rem]"
        >
          {/* Luz superior muy sutil */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.14),transparent_48%)] opacity-75 transition-opacity duration-700 sm:bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.12),transparent_45%)] md:group-hover:opacity-100"
          />

          {/* Protector de lectura */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,10,0.18),rgba(5,8,10,0.86)_70%,rgba(5,8,10,0.28))] sm:bg-[linear-gradient(135deg,rgba(5,8,10,0.18),rgba(5,8,10,0.82)_62%,rgba(5,8,10,0.25))]"
          />

          <div className="relative grid gap-7 p-5 sm:gap-10 sm:p-10 md:p-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14 lg:p-16">
            {/* Bloque principal */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="mb-5 inline-flex items-center justify-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:mb-6 sm:px-4 sm:text-[11px] sm:tracking-[0.2em]">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Despliegue inmediato
              </div>

              <h2 className="max-w-3xl text-[2.45rem] font-bold leading-[0.98] tracking-tighter text-white sm:text-5xl sm:leading-[1.05] md:text-6xl lg:text-7xl">
                <span className="sm:hidden">
                  Cumple SG-SST.{" "}
                  <span className="text-slate-700">Sin improvisar.</span>
                </span>

                <span className="hidden sm:inline">
                  Sistematiza el SG-SST.{" "}
                  <span className="text-slate-700">
                    Reduce el riesgo legal.
                  </span>
                </span>
              </h2>

              <p className="mt-5 max-w-[20rem] text-sm font-medium leading-relaxed text-slate-400 sm:mt-6 sm:max-w-xl sm:text-base md:text-lg">
                <span className="sm:hidden">
                  Centraliza evidencias, vencimientos y auditorías en un solo
                  sistema.
                </span>

                <span className="hidden sm:inline">
                  Deja atrás plantillas dispersas, vencimientos invisibles y
                  evidencias difíciles de encontrar. Implementa un sistema
                  centralizado para gestionar cumplimiento, registros y auditorías
                  con mayor control.
                </span>
              </p>

              <div className="mt-7 flex w-full flex-col items-center gap-3 sm:mt-9 sm:w-auto sm:flex-row lg:items-start">
                <a
                  href="#diagnostico"
                  aria-label="Agendar sesión técnica"
                  className="group/btn inline-flex min-h-13 w-full touch-manipulation items-center justify-center gap-2.5 rounded-full bg-cyan-400 px-6 py-4 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-cyan-300 active:scale-[0.98] sm:min-h-14 sm:w-auto sm:gap-3 sm:px-7"
                >
                  <CalendarCheck
                    size={18}
                    strokeWidth={2.4}
                    className="transition-transform duration-300 md:group-hover/btn:-translate-y-0.5"
                  />

                  <span className="sm:hidden">Agendar diagnóstico</span>
                  <span className="hidden sm:inline">Agendar sesión técnica</span>

                  <ArrowRight
                    size={17}
                    strokeWidth={2.4}
                    className="transition-transform duration-300 md:group-hover/btn:translate-x-1"
                  />
                </a>

                <a
                  href="#how"
                  className="hidden min-h-14 touch-manipulation items-center justify-center rounded-full border border-white/5 bg-white/[0.03] px-7 py-4 text-sm font-bold text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white sm:inline-flex sm:w-auto"
                >
                  Ver cómo funciona
                </a>
              </div>

              <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 sm:mt-4 sm:text-[11px] sm:tracking-[0.18em] lg:text-left">
                <span className="sm:hidden">Cupos limitados · Julio 2026</span>
                <span className="hidden sm:inline">
                  Cupos limitados para julio 2026
                </span>
              </p>
            </div>

            {/* Panel derecho */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#080b0e]/95 p-4 sm:rounded-[1.75rem] sm:p-5 md:rounded-[2rem] md:p-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.10),transparent_58%)]"
                />

                <div className="relative">
                  <div className="mb-5 flex items-center justify-between gap-4 sm:mb-7">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 sm:text-[11px] sm:tracking-[0.2em]">
                        Estado del sistema
                      </p>

                      <h3 className="mt-1.5 text-2xl font-bold tracking-tighter text-white sm:mt-2 sm:text-3xl">
                        Listo para auditar.
                      </h3>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 sm:h-12 sm:w-12">
                      <ShieldCheck size={23} strokeWidth={1.8} />
                    </div>
                  </div>

                  <div className="mb-5 rounded-2xl border border-white/5 bg-white/[0.025] p-4 sm:mb-7">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">
                        Cobertura documental
                      </span>
                      <span className="text-xs font-bold text-cyan-400">
                        92%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full w-[92%] rounded-full bg-cyan-400" />
                    </div>
                  </div>

                  {/* Mobile compacto */}
                  <div className="grid grid-cols-3 gap-2 sm:hidden">
                    {proofPoints.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.title}
                          className="flex min-h-[84px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0c1015] px-2 py-3 text-center"
                        >
                          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.03] text-cyan-400">
                            <Icon size={17} strokeWidth={2} />
                          </div>

                          <h4 className="text-[11px] font-bold leading-tight tracking-tight text-white">
                            {item.title}
                          </h4>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tablet / Desktop completo */}
                  <div className="hidden gap-3 sm:grid">
                    {proofPoints.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.title}
                          className="flex gap-4 rounded-2xl border border-white/5 bg-[#0c1015] p-4"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] text-cyan-400">
                            <Icon size={19} strokeWidth={2} />
                          </div>

                          <div>
                            <h4 className="text-sm font-bold tracking-tight text-white">
                              {item.title}
                            </h4>
                            <p className="mt-1 text-sm leading-relaxed text-slate-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 -bottom-px hidden h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent md:block"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}