"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  Users,
  Activity,
  FileCheck,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

type QuizStep = "start" | "question" | "lead_capture" | "result";

const questions = [
  {
    id: "q_size",
    title: "¿Cuántos trabajadores o contratistas directos tiene tu empresa?",
    icon: Users,
    options: [
      { label: "De 1 a 10 trabajadores", value: "small", score: 0 },
      { label: "De 11 a 50 trabajadores", value: "medium", score: 0 },
      { label: "Más de 50 trabajadores", value: "large", score: 0 },
    ],
  },
  {
    id: "q_matrix",
    title: "¿Cuentas con una Matriz de Riesgos técnica y actualizada?",
    icon: Activity,
    options: [
      { label: "Sí, documentada y actualizada", value: "yes", score: 33 },
      { label: "Tengo un formato genérico/viejo", value: "partial", score: 10 },
      { label: "No tengo o no sé qué es", value: "no", score: 0 },
    ],
  },
  {
    id: "q_records",
    title: "¿Las bitácoras y actas del comité COPASST/Vigía están al día?",
    icon: FileCheck,
    options: [
      { label: "Todo en orden y documentado", value: "yes", score: 33 },
      { label: "Faltan firmas y reuniones", value: "partial", score: 10 },
      { label: "No llevamos ese control", value: "no", score: 0 },
    ],
  },
];

const DesktopDiagnosticBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden md:block"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(6,182,212,0.16),transparent_26%),radial-gradient(circle_at_85%_15%,rgba(239,68,68,0.12),transparent_25%),radial-gradient(circle_at_50%_90%,rgba(14,165,233,0.12),transparent_32%)]" />

      <motion.div
        className="absolute left-[-10%] top-[-20%] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"
        animate={{
          x: [0, 80, 20, 0],
          y: [0, 40, 90, 0],
          scale: [1, 1.12, 0.95, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-[-25%] right-[-10%] h-96 w-96 rounded-full bg-red-500/10 blur-3xl"
        animate={{
          x: [0, -60, -20, 0],
          y: [0, -30, -80, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.35]"
        viewBox="0 0 900 620"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="diagnostic-grid"
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 44 0 L 0 0 0 44"
              fill="none"
              stroke="rgba(148,163,184,0.25)"
              strokeWidth="1"
            />
          </pattern>

          <linearGradient id="scan-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(6,182,212,0)" />
            <stop offset="50%" stopColor="rgba(6,182,212,0.85)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0)" />
          </linearGradient>
        </defs>

        <rect width="900" height="620" fill="url(#diagnostic-grid)" />

        <motion.path
          d="M80 440 C180 310 240 500 340 350 S520 250 630 320 S760 450 830 250"
          fill="none"
          stroke="rgba(6,182,212,0.55)"
          strokeWidth="2"
          strokeDasharray="8 10"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        <motion.path
          d="M110 185 L185 120 L260 175 L335 95 L410 150 L485 110"
          fill="none"
          stroke="rgba(34,211,238,0.7)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {[110, 185, 260, 335, 410, 485].map((cx, index) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy={[185, 120, 175, 95, 150, 110][index]}
            r="5"
            fill="rgba(34,211,238,0.9)"
            animate={{
              r: [4, 7, 4],
              opacity: [0.45, 1, 0.45],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.25,
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.line
          x1="0"
          x2="900"
          y1="0"
          y2="0"
          stroke="url(#scan-line)"
          strokeWidth="2"
          animate={{ y1: [80, 540, 80], y2: [80, 540, 80] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.g
          animate={{ rotate: 360 }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: "720px 175px" }}
        >
          <circle
            cx="720"
            cy="175"
            r="72"
            fill="none"
            stroke="rgba(6,182,212,0.22)"
            strokeWidth="2"
          />
          <circle
            cx="720"
            cy="175"
            r="42"
            fill="none"
            stroke="rgba(6,182,212,0.3)"
            strokeWidth="2"
            strokeDasharray="6 8"
          />
          <path
            d="M720 175 L720 103"
            stroke="rgba(6,182,212,0.65)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>
      </svg>

      <motion.div
        className="absolute right-8 top-24 w-48 rounded-2xl border border-cyan-400/15 bg-slate-950/40 p-4 shadow-2xl backdrop-blur-md"
        animate={{
          y: [0, -10, 0],
          opacity: [0.65, 1, 0.65],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-300">
            Scan SST
          </span>
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-cyan-300"
              animate={{ width: ["35%", "82%", "45%"] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <div className="h-2 w-4/5 rounded-full bg-white/10" />
          <div className="h-2 w-3/5 rounded-full bg-white/10" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-16 left-8 w-44 rounded-2xl border border-red-400/15 bg-slate-950/40 p-4 shadow-2xl backdrop-blur-md"
        animate={{
          y: [0, 12, 0],
          opacity: [0.55, 0.95, 0.55],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.9)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-red-300">
            Riesgo
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <motion.div
              key={item}
              className="h-7 rounded-md border border-white/10 bg-white/5"
              animate={{
                opacity: [0.25, 0.8, 0.25],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: item * 0.12,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const MobileDiagnosticBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden md:hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.18),transparent_36%),radial-gradient(circle_at_100%_80%,rgba(239,68,68,0.12),transparent_30%)]" />

      <motion.div
        className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-cyan-400/20"
        animate={{
          rotate: 360,
          scale: [1, 1.08, 1],
        }}
        transition={{
          rotate: {
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      <motion.div
        className="absolute left-6 top-24 h-px w-32 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent"
        animate={{ x: [-80, 280, -80], opacity: [0, 1, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-8 right-6 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 backdrop-blur-sm"
        animate={{ y: [0, -8, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-[9px] font-black uppercase tracking-[0.22em] text-cyan-300">
          Diagnóstico
        </span>
      </motion.div>
    </div>
  );
};

export const DiagnosticQuiz = () => {
  const [step, setStep] = useState<QuizStep>("start");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(34);

  const [leadData, setLeadData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleStart = () => setStep("question");

  const handleAnswer = (questionId: string, value: string, points: number) => {
    if (answers[questionId]) return;

    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setScore((prev) => Math.min(prev + points, 100));

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((prev) => prev + 1);
      } else {
        setStep("lead_capture");
      }
    }, 300);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("result");
  };

  const isSmallBusiness = answers["q_size"] === "small";

  const progressPercentage =
    step === "start"
      ? 0
      : step === "result"
      ? 100
      : step === "lead_capture"
      ? 85
      : ((currentQ + 1) / questions.length) * 70;

  return (
    <div className="relative isolate mx-auto flex min-h-[560px] w-[calc(100%-1.25rem)] max-w-2xl flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0c1015] font-sans shadow-[0_0_90px_-28px_rgba(6,182,212,0.55)] sm:w-full md:min-h-[590px] md:rounded-[2rem]">
      <DesktopDiagnosticBackground />
      <MobileDiagnosticBackground />

      <div className="absolute inset-0 -z-20 bg-[linear-gradient(145deg,#05080a_0%,#0c1015_45%,#07131a_100%)]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

      <div className="relative flex items-center justify-between border-b border-white/10 bg-[#05080a]/65 px-5 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
        <div className="flex items-center gap-3 text-slate-300">
          <div className="relative rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-2 text-cyan-300 shadow-[0_0_18px_rgba(6,182,212,0.18)]">
            <ClipboardCheck size={18} strokeWidth={2} />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.95)]" />
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400 sm:text-xs">
              Auditoría Flash
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/70 sm:block">
              Diagnóstico SG-SST
            </span>
          </div>
        </div>

        {step === "question" && (
          <span className="rounded-full border border-cyan-400/15 bg-cyan-400/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 sm:text-xs">
            Fase 0{currentQ + 1} // 0{questions.length}
          </span>
        )}

        {step === "lead_capture" && (
          <span className="rounded-full border border-cyan-400/15 bg-cyan-400/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 sm:text-xs">
            Resultado listo
          </span>
        )}

        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
          <motion.div
            className="h-full bg-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.9)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center p-5 sm:p-6 md:p-10">
        <AnimatePresence mode="wait">
          {step === "start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{ willChange: "opacity, transform" }}
              className="mx-auto w-full max-w-lg text-center"
            >
              <div className="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/25 bg-red-950/30 text-red-400 shadow-[0_0_36px_rgba(239,68,68,0.18)] sm:h-24 sm:w-24">
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-red-500/20"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <ShieldAlert size={40} strokeWidth={1.5} />
              </div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/5 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                  Evaluación rápida
                </span>
              </div>

              <h3 className="mb-4 text-3xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-4xl md:text-5xl">
                Identifica tu vulnerabilidad legal al instante.
              </h3>

              <p className="mx-auto mb-9 max-w-sm text-sm font-medium leading-relaxed text-slate-400 sm:text-base">
                El diagnóstico evalúa tu exposición a multas procesando 3
                variables críticas de tu operación.
              </p>

              <button
                onClick={handleStart}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 px-8 py-4 text-sm font-black text-slate-950 shadow-[0_0_28px_rgba(6,182,212,0.28)] transition-all duration-300 hover:scale-[1.02] hover:bg-cyan-200 active:scale-[0.98] sm:w-auto sm:px-10 sm:text-base"
              >
                Ejecutar Diagnóstico
                <ChevronRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </motion.div>
          )}

          {step === "question" && (
            <motion.div
              key={`q_${currentQ}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "opacity, transform" }}
              className="w-full"
            >
              <div className="mb-7 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-cyan-300 shadow-[0_0_22px_rgba(6,182,212,0.08)]">
                    {React.createElement(questions[currentQ].icon, {
                      size: 28,
                      strokeWidth: 1.5,
                    })}
                  </div>

                  <div className="hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                      Variable crítica
                    </p>
                    <p className="text-sm font-semibold text-slate-300">
                      Responde con la situación real de tu empresa
                    </p>
                  </div>
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {currentQ + 1}/{questions.length}
                </div>
              </div>

              <h3 className="mb-7 max-w-xl text-2xl font-black leading-tight tracking-[-0.04em] text-white sm:text-3xl">
                {questions[currentQ].title}
              </h3>

              <div className="flex max-w-xl flex-col gap-3">
                {questions[currentQ].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      handleAnswer(questions[currentQ].id, opt.value, opt.score)
                    }
                    className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#05080a]/80 p-4 text-left font-semibold text-slate-300 backdrop-blur-sm transition-all hover:border-cyan-400/50 hover:bg-cyan-950/25 hover:text-white active:scale-[0.985] sm:p-5"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 bg-cyan-300 opacity-0 transition-opacity group-hover:opacity-100" />

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm leading-snug sm:text-base">
                        {opt.label}
                      </span>

                      <div className="relative ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-600 transition-colors group-hover:border-cyan-300">
                        <motion.div
                          className="h-2.5 w-2.5 rounded-full bg-cyan-300 opacity-0 group-hover:opacity-100"
                          whileHover={{ scale: 1.15 }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "lead_capture" && (
            <motion.div
              key="lead"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "opacity, transform" }}
              className="mx-auto flex w-full max-w-md flex-col items-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 shadow-[0_0_28px_rgba(6,182,212,0.16)]">
                <Activity size={28} strokeWidth={1.5} />
              </div>

              <h3 className="mb-2 text-center text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                Análisis completado
              </h3>

              <p className="mx-auto mb-8 max-w-xs text-center text-sm font-medium leading-relaxed text-slate-400 sm:text-base">
                Ingresa tus datos corporativos para revelar el nivel de riesgo
                detectado.
              </p>

              <form onSubmit={handleLeadSubmit} className="flex w-full flex-col gap-4">
                <input
                  required
                  type="text"
                  placeholder="Nombre de la empresa"
                  className="w-full rounded-2xl border border-white/10 bg-[#05080a]/85 p-4 text-[16px] font-medium text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-400 focus:bg-[#0c131a] focus:ring-1 focus:ring-cyan-400/50"
                  value={leadData.name}
                  onChange={(e) =>
                    setLeadData({ ...leadData, name: e.target.value })
                  }
                />

                <input
                  required
                  type="email"
                  placeholder="Correo corporativo"
                  className="w-full rounded-2xl border border-white/10 bg-[#05080a]/85 p-4 text-[16px] font-medium text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-400 focus:bg-[#0c131a] focus:ring-1 focus:ring-cyan-400/50"
                  value={leadData.email}
                  onChange={(e) =>
                    setLeadData({ ...leadData, email: e.target.value })
                  }
                />

                <input
                  required
                  type="tel"
                  placeholder="WhatsApp o celular"
                  className="w-full rounded-2xl border border-white/10 bg-[#05080a]/85 p-4 text-[16px] font-medium text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-400 focus:bg-[#0c131a] focus:ring-1 focus:ring-cyan-400/50"
                  value={leadData.phone}
                  onChange={(e) =>
                    setLeadData({ ...leadData, phone: e.target.value })
                  }
                />

                <button
                  type="submit"
                  className="mt-2 w-full rounded-2xl bg-cyan-300 p-4 text-base font-black text-slate-950 shadow-[0_0_24px_rgba(6,182,212,0.26)] transition-all hover:bg-cyan-200 active:scale-[0.98]"
                >
                  Revelar Resultados
                </button>
              </form>
            </motion.div>
          )}

          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "opacity, transform" }}
              className="mx-auto flex w-full max-w-lg flex-col items-center text-center"
            >
              <div className="relative mb-6 h-36 w-36">
                <svg className="h-full w-full -rotate-90 drop-shadow-[0_0_12px_rgba(6,182,212,0.45)]">
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke="#1e293b"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="72"
                    cy="72"
                    r="64"
                    stroke={score > 70 ? "#22d3ee" : "#ef4444"}
                    strokeWidth="7"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray="402"
                    initial={{ strokeDashoffset: 402 }}
                    animate={{
                      strokeDashoffset: 402 - (402 * score) / 100,
                    }}
                    transition={{
                      duration: 1.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.2,
                    }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black tracking-[-0.06em] text-white">
                    {score}%
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Score
                  </span>
                </div>
              </div>

              <h3 className="mb-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                {score > 70
                  ? "Cumplimiento parcial"
                  : "Riesgo de sanción crítico"}
              </h3>

              <div className="mb-8 max-w-sm rounded-2xl border border-white/10 bg-[#05080a]/85 p-5 text-left text-sm font-medium leading-relaxed text-slate-400 backdrop-blur-sm">
                {isSmallBusiness
                  ? "Para una operación de tu tamaño, la norma exige estándares clave innegociables. Detectamos brechas operativas que pueden ser gestionadas con un sistema documental claro, trazable y actualizado."
                  : "Por el volumen de trabajadores, tu empresa necesita mayor control documental, seguimiento técnico y evidencia organizada. Operar sin un sistema centralizado puede aumentar la exposición a sanciones y hallazgos."}
              </div>

              {isSmallBusiness ? (
                <div className="flex w-full flex-col items-center">
                  <div className="mb-6 flex flex-col items-center">
                    <span className="mb-3 rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                      Licencia autogestionable
                    </span>

                    <div className="text-4xl font-black tracking-[-0.06em] text-white">
                      $99.000{" "}
                      <span className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                        COP/mes
                      </span>
                    </div>
                  </div>

                  <button className="flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 px-8 py-4 text-sm font-black text-slate-950 shadow-[0_0_24px_rgba(6,182,212,0.26)] transition-all hover:bg-cyan-200 active:scale-[0.98] sm:w-auto sm:text-base">
                    <CheckCircle2 size={18} strokeWidth={2.5} />
                    Blindar mi Empresa
                  </button>
                </div>
              ) : (
                <div className="flex w-full flex-col items-center pt-2">
                  <button className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-black text-slate-950 transition-all hover:bg-slate-200 active:scale-[0.98] sm:w-auto sm:text-base">
                    <Users size={18} strokeWidth={2.5} />
                    Agendar Auditoría Técnica
                  </button>

                  <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    15 min con un especialista
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};