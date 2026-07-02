"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardCheck, 
  Users, 
  AlertTriangle, 
  FileCheck, 
  ArrowRight, 
  CheckCircle2, 
  Activity 
} from "lucide-react";

// --- TIPOS Y PREGUNTAS ---
type QuizStep = "start" | "question" | "lead_capture" | "result";

const questions = [
  {
    id: "q_size",
    title: "¿Cuántos trabajadores directos o contratistas tiene la empresa?",
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
      { label: "Sí, actualizada al 2026", value: "yes", score: 33 },
      { label: "Tengo un Excel genérico/viejo", value: "partial", score: 10 },
      { label: "No tengo o no sé qué es", value: "no", score: 0 },
    ]
  },
  {
    id: "q_records",
    title: "¿Las bitácoras y actas del COPASST/Vigía están firmadas y al día?",
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
  const [score, setScore] = useState(34); // Base score

  // Datos del Lead
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "" });

  const handleStart = () => setStep("question");

  const handleAnswer = (questionId: string, value: string, points: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setScore(prev => prev + points);

    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setStep("lead_capture");
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría tu lógica para enviar datos a tu base de datos / CRM
    setStep("result");
  };

  // Lógica de Bifurcación
  const isSmallBusiness = answers["q_size"] === "small";

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
      
      {/* HEADER DEL WIDGET */}
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-400">
          <ClipboardCheck size={20} />
          <span className="font-bold text-sm tracking-wide uppercase">Diagnóstico SG-SST</span>
        </div>
        {step === "question" && (
          <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            Paso {currentQ + 1} de {questions.length}
          </span>
        )}
      </div>

      {/* CONTENEDOR DINÁMICO */}
      <div className="p-6 md:p-10 min-h-[400px] flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          
          {/* PANTALLA 1: INICIO */}
          {step === "start" && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
                ¿Tu empresa pasaría hoy una visita del Ministerio?
              </h3>
              <p className="text-slate-600 mb-8 max-w-sm mx-auto font-medium">
                Responde 3 preguntas rápidas, descubre tu nivel de riesgo legal y obtén un plan de acción inmediato.
              </p>
              <button 
                onClick={handleStart}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/30"
              >
                Comenzar Evaluación
              </button>
            </motion.div>
          )}

          {/* PANTALLA 2: PREGUNTAS */}
          {step === "question" && (
            <motion.div 
              key={`q_${currentQ}`}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              {React.createElement(questions[currentQ].icon, { size: 32, className: "text-slate-400 mb-6" })}
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 leading-tight">
                {questions[currentQ].title}
              </h3>
              <div className="flex flex-col gap-3">
                {questions[currentQ].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(questions[currentQ].id, opt.value, opt.score)}
                    className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-cyan-500 hover:bg-cyan-50 transition-all font-semibold text-slate-700 hover:text-cyan-900 flex justify-between items-center group"
                  >
                    {opt.label}
                    <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 text-cyan-500 transition-opacity" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PANTALLA 3: CAPTURA DE LEAD */}
          {step === "lead_capture" && (
            <motion.div 
              key="lead"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            >
              <h3 className="text-2xl font-black text-slate-900 mb-2 text-center">
                ¡Análisis Completado!
              </h3>
              <p className="text-slate-600 text-center mb-6 text-sm font-medium">
                Ingresa tus datos para revelar tu puntaje de cumplimiento y enviarte el reporte detallado.
              </p>
              
              <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4 max-w-sm mx-auto">
                <input 
                  required type="text" placeholder="Tu Nombre o Empresa" 
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium text-slate-800 transition-all"
                  value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})}
                />
                <input 
                  required type="email" placeholder="Correo Electrónico" 
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium text-slate-800 transition-all"
                  value={leadData.email} onChange={e => setLeadData({...leadData, email: e.target.value})}
                />
                <input 
                  required type="tel" placeholder="WhatsApp" 
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none font-medium text-slate-800 transition-all"
                  value={leadData.phone} onChange={e => setLeadData({...leadData, phone: e.target.value})}
                />
                <button type="submit" className="w-full mt-2 p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-xl shadow-slate-900/20">
                  Ver mis resultados
                </button>
              </form>
            </motion.div>
          )}

          {/* PANTALLA 4: RESULTADO Y BIFURCACIÓN (EL EMBUDO) */}
          {step === "result" && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center flex flex-col items-center"
            >
              {/* Círculo de Puntuación */}
              <div className="relative w-32 h-32 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="60" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <motion.circle 
                    cx="64" cy="64" r="60" stroke={score > 70 ? "#10b981" : "#ef4444"} strokeWidth="8" fill="transparent" strokeLinecap="round"
                    strokeDasharray="377"
                    initial={{ strokeDashoffset: 377 }}
                    animate={{ strokeDashoffset: 377 - (377 * score) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900">{score}%</span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2">
                {score > 70 ? "Cumplimiento Parcial" : "Riesgo Crítico de Sanción"}
              </h3>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 max-w-md text-sm font-medium text-slate-600">
                {isSmallBusiness 
                  ? "Para empresas de menos de 10 trabajadores, la Resolución 0312 exige 7 estándares clave. Nuestro sistema parametriza todo automáticamente para tu tamaño."
                  : "Por el volumen de tus trabajadores, requieres un sistema robusto que audite múltiples centros de trabajo y metodologías de riesgo complejas."}
              </div>

              {/* === BIFURCACIÓN DE LA OFERTA === */}
              {isSmallBusiness ? (
                <div className="w-full flex flex-col items-center">
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Plan Autogestionable</span>
                    <div className="text-3xl font-black text-slate-900">$99.000 <span className="text-sm font-medium text-slate-500">COP/mes</span></div>
                  </div>
                  <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-base transition-all hover:scale-105 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2">
                    <CheckCircle2 size={18} /> Crear Cuenta y Blindar mi Empresa
                  </button>
                  <p className="text-[10px] text-slate-400 mt-3 font-medium uppercase">Incluye plantillas y matriz configurada</p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-all hover:scale-105 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2">
                    <Users size={18} /> Agendar Sesión Técnica (15 min)
                  </button>
                  <p className="text-[10px] text-slate-400 mt-3 font-medium uppercase">Evaluaremos la migración de tu estructura actual</p>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};