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
  ShieldAlert
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
    ]
  },
  {
    id: "q_matrix",
    title: "¿Cuentas con una Matriz de Riesgos técnica y actualizada?",
    icon: Activity,
    options: [
      { label: "Sí, documentada y actualizada", value: "yes", score: 33 },
      { label: "Tengo un formato genérico/viejo", value: "partial", score: 10 },
      { label: "No tengo o no sé qué es", value: "no", score: 0 },
    ]
  },
  {
    id: "q_records",
    title: "¿Las bitácoras y actas del comité (COPASST/Vigía) están al día?",
    icon: FileCheck,
    options: [
      { label: "Todo en orden y documentado", value: "yes", score: 33 },
      { label: "Faltan firmas y reuniones", value: "partial", score: 10 },
      { label: "No llevamos ese control", value: "no", score: 0 },
    ]
  }
];

export const DiagnosticQuiz = () => {
  const [step, setStep] = useState<QuizStep>("start");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(34);

  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "" });

  const handleStart = () => setStep("question");

  const handleAnswer = (questionId: string, value: string, points: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setScore(prev => prev + points);

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
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
  const progressPercentage = step === "start" ? 0 : step === "result" ? 100 : ((currentQ) / questions.length) * 100;

  return (
    <div className="w-[calc(100%-2rem)] sm:w-full max-w-2xl mx-auto bg-[#0c1015] rounded-[2rem] border border-white/5 overflow-hidden font-sans relative shadow-[0_0_80px_-20px_rgba(6,182,212,0.15)] flex flex-col min-h-[500px] isolate">
      
      {/* ILUMINACIÓN DE FONDO ACELERADA POR GPU */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.05)_0%,_transparent_50%)] pointer-events-none -z-10" />

      {/* HEADER DINÁMICO TÁCTICO */}
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between relative bg-[#05080a]/50">
        <div className="flex items-center gap-3 text-slate-300">
          <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
            <ClipboardCheck size={18} strokeWidth={2} />
          </div>
          <span className="font-bold text-xs tracking-[0.2em] uppercase text-slate-400">Auditoría Flash</span>
        </div>
        
        {step === "question" && (
          <span className="text-xs font-bold text-cyan-500/70 tracking-widest uppercase">
            Fase 0{currentQ + 1} // 0{questions.length}
          </span>
        )}

        {/* BARRA DE PROGRESO LUMINOSA */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-white/5 w-full">
          <motion.div 
            className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* ÁREA DE CONTENIDO */}
      <div className="p-6 md:p-10 flex-1 flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          
          {/* --- PANTALLA 1: INICIO --- */}
          {step === "start" && (
            <motion.div 
              key="start" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.98 }} 
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ willChange: "opacity, transform" }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-red-950/30 border border-red-900/30 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
                <div className="absolute inset-0 rounded-3xl animate-ping opacity-20 bg-red-500" />
                <ShieldAlert size={36} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tighter leading-tight">
                Identifica tu vulnerabilidad <br className="hidden md:block" />legal al instante.
              </h3>
              <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium text-sm md:text-base leading-relaxed">
                El algoritmo evalúa tu exposición a multas procesando 3 variables críticas de tu operación.
              </p>
              <button 
                onClick={handleStart}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-cyan-400 text-slate-950 rounded-full font-bold text-sm md:text-base transition-all duration-300 hover:bg-cyan-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Ejecutar Diagnóstico 
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}

          {/* --- PANTALLA 2: PREGUNTAS --- */}
          {step === "question" && (
            <motion.div 
              key={`q_${currentQ}`} 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -20 }} 
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "opacity, transform" }}
              className="w-full"
            >
              <div className="flex mb-8">
                 <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-cyan-400 shrink-0">
                   {React.createElement(questions[currentQ].icon, { size: 28, strokeWidth: 1.5 })}
                 </div>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white mb-8 leading-tight tracking-tight max-w-lg">
                {questions[currentQ].title}
              </h3>
              
              <div className="flex flex-col gap-3 max-w-lg">
                {questions[currentQ].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(questions[currentQ].id, opt.value, opt.score)}
                    className="w-full text-left p-4 md:p-5 rounded-xl border border-white/5 bg-[#05080a] hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all font-semibold text-slate-300 hover:text-white flex justify-between items-center group active:scale-[0.98]"
                  >
                    <span className="text-sm md:text-base">{opt.label}</span>
                    <div className="w-5 h-5 rounded-full border border-slate-600 group-hover:border-cyan-400 flex items-center justify-center transition-colors shrink-0 ml-4 relative">
                      <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-0 group-active:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* --- PANTALLA 3: CAPTURA DE DATOS --- */}
          {step === "lead_capture" && (
            <motion.div 
              key="lead" 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }} 
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "opacity, transform" }}
              className="w-full flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 rounded-2xl flex items-center justify-center mb-6">
                <Activity size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center tracking-tight">
                Análisis Completado
              </h3>
              <p className="text-slate-400 text-center mb-8 text-sm md:text-base font-medium max-w-xs mx-auto">
                Ingresa tus datos corporativos para desencriptar tu nivel de riesgo.
              </p>
              
              <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4 w-full max-w-sm">
                <input 
                  required type="text" placeholder="Nombre de la Empresa" 
                  className="w-full p-4 rounded-xl border border-white/10 bg-[#05080a] focus:bg-[#0c131a] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none font-medium text-white transition-all text-[16px] placeholder:text-slate-600"
                  value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})}
                />
                <input 
                  required type="email" placeholder="Correo corporativo" 
                  className="w-full p-4 rounded-xl border border-white/10 bg-[#05080a] focus:bg-[#0c131a] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none font-medium text-white transition-all text-[16px] placeholder:text-slate-600"
                  value={leadData.email} onChange={e => setLeadData({...leadData, email: e.target.value})}
                />
                <button type="submit" className="w-full mt-2 p-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-base transition-all active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  Revelar Resultados
                </button>
              </form>
            </motion.div>
          )}

          {/* --- PANTALLA 4: RESULTADOS --- */}
          {step === "result" && (
            <motion.div 
              key="result" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "opacity, transform" }}
              className="text-center flex flex-col items-center"
            >
              <div className="relative w-32 h-32 mb-6">
                <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                  <circle cx="64" cy="64" r="60" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                  <motion.circle 
                    cx="64" cy="64" r="60" 
                    stroke={score > 70 ? "#0ea5e9" : "#ef4444"} 
                    strokeWidth="6" fill="transparent" strokeLinecap="round"
                    strokeDasharray="377"
                    initial={{ strokeDashoffset: 377 }}
                    animate={{ strokeDashoffset: 377 - (377 * score) / 100 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{score}%</span>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                {score > 70 ? "Cumplimiento Parcial" : "Riesgo de Sanción Crítico"}
              </h3>
              
              <div className="bg-[#05080a] border border-white/5 rounded-2xl p-5 mb-8 max-w-sm text-sm font-medium text-slate-400 leading-relaxed text-left">
                {isSmallBusiness 
                  ? "Para una operación de tu tamaño, la norma exige 7 estándares clave innegociables. Detectamos brechas operativas severas. Nuestro software parametriza y cubre estas fallas automáticamente."
                  : "Por el volumen de trabajadores, estás obligado a auditar matrices avanzadas. Operar sin un sistema centralizado te expone a demandas irreversibles."}
              </div>

              {isSmallBusiness ? (
                <div className="w-full flex flex-col items-center">
                  <div className="mb-6 flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 border border-cyan-500/20 bg-cyan-950/30 px-3 py-1 rounded-full mb-3">Licencia Autogestionable</span>
                    <div className="text-4xl font-bold text-white">$99.000 <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">COP/mes</span></div>
                  </div>
                  <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm md:text-base transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <CheckCircle2 size={18} strokeWidth={2.5} /> Blindar mi Empresa
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center pt-2">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-200 text-slate-900 font-bold text-sm md:text-base transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Users size={18} strokeWidth={2.5} /> Agendar Auditoría Técnica
                  </button>
                  <p className="text-xs text-slate-500 mt-4 font-semibold uppercase tracking-widest">15 min con un especialista</p>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};