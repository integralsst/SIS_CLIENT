"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardCheck, 
  Users, 
  Activity, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2,
  ChevronRight
} from "lucide-react";

// --- TIPOS Y PREGUNTAS ---
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
  const [score, setScore] = useState(34); // Base score inicial

  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "" });

  const handleStart = () => setStep("question");

  const handleAnswer = (questionId: string, value: string, points: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setScore(prev => prev + points);

    // Pequeño timeout para que el usuario vea el clic antes de cambiar de pantalla
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
      } else {
        setStep("lead_capture");
      }
    }, 250);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("result");
  };

  const isSmallBusiness = answers["q_size"] === "small";
  const progressPercentage = ((currentQ) / questions.length) * 100;

  return (
    // AJUSTE CLAVE: max-w-xl y mx-auto para evitar que se estire en Desktop
    <div className="w-full max-w-xl mx-auto bg-white rounded-[2rem] shadow-2xl shadow-cyan-900/20 overflow-hidden font-sans border border-slate-100 flex flex-col min-h-[480px]">
      
      {/* HEADER DINÁMICO */}
      <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex items-center justify-between relative">
        <div className="flex items-center gap-2.5 text-slate-800">
          <div className="p-1.5 bg-cyan-100 rounded-lg text-cyan-600">
            <ClipboardCheck size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-sm tracking-wide uppercase text-slate-700">Diagnóstico SG-SST</span>
        </div>
        
        {step === "question" && (
          <span className="text-xs font-bold text-slate-400">
            Pregunta {currentQ + 1} de {questions.length}
          </span>
        )}

        {/* BARRA DE PROGRESO INVISIBLE HASTA QUE EMPIEZAN LAS PREGUNTAS */}
        <div className="absolute bottom-0 left-0 h-1 bg-slate-200 w-full">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: step === "question" ? `${progressPercentage}%` : step === "lead_capture" ? "90%" : step === "result" ? "100%" : "0%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* ÁREA DE CONTENIDO */}
      <div className="p-6 md:p-10 flex-1 flex flex-col justify-center relative bg-white">
        <AnimatePresence mode="wait">
          
          {/* --- PANTALLA 1: INICIO --- */}
          {step === "start" && (
            <motion.div key="start" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-blue-100">
                <AlertTriangle size={36} strokeWidth={2} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                Identifica tu vulnerabilidad legal al instante.
              </h3>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium text-sm md:text-base leading-relaxed">
                Responde 3 preguntas estructuradas y descubre si tu empresa está preparada para evitar sanciones.
              </p>
              <button 
                onClick={handleStart}
                className="w-full sm:w-max mx-auto px-10 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
              >
                Comenzar Evaluación <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* --- PANTALLA 2: PREGUNTAS --- */}
          {step === "question" && (
            <motion.div key={`q_${currentQ}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full">
              
              <div className="flex justify-center mb-6">
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400">
                   {React.createElement(questions[currentQ].icon, { size: 32 })}
                 </div>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 leading-tight text-center max-w-md mx-auto">
                {questions[currentQ].title}
              </h3>
              
              <div className="flex flex-col gap-3 max-w-md mx-auto">
                {questions[currentQ].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(questions[currentQ].id, opt.value, opt.score)}
                    className="w-full text-left p-4 md:p-5 rounded-2xl border-2 border-slate-100 hover:border-cyan-500 hover:bg-cyan-50/50 transition-all font-bold text-slate-700 hover:text-cyan-900 flex justify-between items-center group active:scale-[0.98]"
                  >
                    <span>{opt.label}</span>
                    {/* Botón radial simulado */}
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-cyan-500 flex items-center justify-center transition-colors shrink-0 ml-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* --- PANTALLA 3: CAPTURA (Solución Anti-Zoom iOS) --- */}
          {step === "lead_capture" && (
            <motion.div key="lead" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full">
              <h3 className="text-2xl font-black text-slate-900 mb-2 text-center">
                ¡Análisis Completado!
              </h3>
              <p className="text-slate-500 text-center mb-8 text-sm md:text-base font-medium max-w-xs mx-auto">
                Ingresa tus datos para revelar tu puntaje exacto y entregarte el diagnóstico.
              </p>
              
              <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4 max-w-sm mx-auto w-full">
                {/* NOTA CRÍTICA: text-[16px] evita que el iPhone haga zoom automático */}
                <input 
                  required type="text" placeholder="Nombre o Empresa" 
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none font-medium text-slate-800 transition-all text-[16px] placeholder:text-slate-400"
                  value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})}
                />
                <input 
                  required type="email" placeholder="Correo Electrónico" 
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none font-medium text-slate-800 transition-all text-[16px] placeholder:text-slate-400"
                  value={leadData.email} onChange={e => setLeadData({...leadData, email: e.target.value})}
                />
                <input 
                  required type="tel" placeholder="WhatsApp (Opcional)" 
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none font-medium text-slate-800 transition-all text-[16px] placeholder:text-slate-400"
                  value={leadData.phone} onChange={e => setLeadData({...leadData, phone: e.target.value})}
                />
                <button type="submit" className="w-full mt-4 p-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-base transition-all active:scale-95 shadow-xl shadow-cyan-600/20">
                  Ver mis resultados
                </button>
              </form>
            </motion.div>
          )}

          {/* --- PANTALLA 4: RESULTADOS (El Embudo de Venta) --- */}
          {step === "result" && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center flex flex-col items-center">
              
              <div className="relative w-32 h-32 mb-6 drop-shadow-xl">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="60" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <motion.circle 
                    cx="64" cy="64" r="60" stroke={score > 70 ? "#10b981" : "#ef4444"} strokeWidth="8" fill="transparent" strokeLinecap="round"
                    strokeDasharray="377"
                    initial={{ strokeDashoffset: 377 }}
                    animate={{ strokeDashoffset: 377 - (377 * score) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900">{score}%</span>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
                {score > 70 ? "Cumplimiento Parcial" : "Riesgo de Sanción"}
              </h3>
              
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 max-w-md text-sm font-medium text-slate-600 leading-relaxed shadow-inner">
                {isSmallBusiness 
                  ? "Para empresas de tu tamaño, la norma exige 7 estándares clave. Tu nivel actual indica brechas operativas. Te entregamos todo parametrizado automáticamente."
                  : "Por el volumen de trabajadores, requieres auditar múltiples áreas y matrices avanzadas. Necesitas una estructura robusta urgentemente."}
              </div>

              {isSmallBusiness ? (
                <div className="w-full flex flex-col items-center">
                  <div className="mb-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">Plan Autogestionable</span>
                    <div className="text-4xl font-black text-slate-900 mt-4">$99.000 <span className="text-base font-bold text-slate-400">COP/mes</span></div>
                  </div>
                  <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-base transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2">
                    <CheckCircle2 size={20} /> Blindar mi Empresa Hoy
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center pt-2">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2">
                    <Users size={20} /> Agendar Sesión Técnica
                  </button>
                  <p className="text-xs text-slate-400 mt-4 font-semibold">15 min gratis con un auditor experto</p>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};