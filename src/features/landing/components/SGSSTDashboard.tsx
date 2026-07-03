"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
 AlertTriangle, 
  Building2, Server, BarChart3, TrendingUp
} from "lucide-react";

// --- DATOS MOCK SG-SST ---
const sgsstData = {
  cliente: "Constructora XYZ S.A.",
  kpis: {
    total: 60,
    cumplimiento: 56,
    brechas: 4,
    nivelRiesgo: "Controlado",
  },
  evolucion: [
    { mes: "Feb", val: 42 }, { mes: "Mar", val: 55 }, { mes: "Abr", val: 68 },
    { mes: "May", val: 79 }, { mes: "Jun", val: 88 }, { mes: "Jul", val: 93 }
  ],
  auditorias: [
    { area: "Matriz de Riesgos (Art. 2.2.4.6.15)", avance: 100 },
    { area: "Comité COPASST y Vigía", avance: 95 }, 
    { area: "Planes de Emergencia", avance: 85 },
    { area: "Vigilancia Epidemiológica", avance: 90 },   
  ]
};

// --- COMPONENTE: Barras Horizontales GPU ---
const GPUHorizontalBar: React.FC<{ avance: number; delay: number }> = ({ avance, delay }) => (
  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative isolate">
    <motion.div 
      className={`absolute top-0 left-0 bottom-0 w-full rounded-full origin-left ${avance === 100 ? 'bg-cyan-400' : 'bg-slate-500'}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: avance / 100 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
      style={{ willChange: "transform" }}
    />
  </div>
);

// --- COMPONENTE: Gráfico de Barras Verticales GPU ---
const VerticalBarChart = () => (
  <div className="flex items-end justify-between gap-2 md:gap-4 h-32 md:h-40 mt-4 w-full">
    {sgsstData.evolucion.map((d, i) => (
      <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full group">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-cyan-400 mb-1">
          {d.val}%
        </div>
        <div className="w-full h-full bg-white/5 rounded-t-md relative flex items-end overflow-hidden isolate border-b border-white/10">
          <motion.div
            // FIX: Se agregó h-full para que el origen de escala detecte la altura del contenedor
            className="w-full h-full bg-gradient-to-t from-cyan-900/40 to-cyan-400 origin-bottom rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: d.val / 100 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "transform" }}
          />
        </div>
        <span className="text-[10px] md:text-xs font-semibold text-slate-500 tracking-wider">{d.mes}</span>
      </div>
    ))}
  </div>
);

// --- COMPONENTE: Medidor Radial (Donut) ---
const RadialGauge: React.FC<{ value: number }> = ({ value }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center shrink-0">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="50%" cy="50%" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
        <motion.circle 
          cx="50%" cy="50%" r={radius} 
          stroke="#22d3ee" strokeWidth="8" fill="transparent" 
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ willChange: "stroke-dashoffset" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl md:text-3xl font-black text-white leading-none">{value}</span>
        <span className="text-[9px] font-bold text-cyan-500 tracking-widest uppercase mt-1">Score</span>
      </div>
    </div>
  );
};

export const SGSSTDashboard = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <section className="relative w-full max-w-[1200px] mx-auto py-20 md:py-32 px-4 sm:px-6 flex flex-col items-center">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: "opacity, transform" }}
        className="w-full text-center mb-12 md:mb-20 relative z-10"
      >
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-cyan-500/20 bg-[#0c131a] text-cyan-400 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold mb-6">
          <Server size={14} strokeWidth={2.5} /> Telemetría Normativa
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter leading-[1.05] mb-6 max-w-4xl mx-auto px-2">
          Control absoluto en <br className="hidden sm:block" />
          <span className="text-slate-700">tiempo real.</span>
        </h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: "opacity, transform" }}
        className="relative z-20 w-full max-w-5xl bg-[#0c1015] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 flex flex-col gap-6 md:gap-8 shadow-2xl isolate overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.08)_0%,_transparent_50%)] pointer-events-none -z-10" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 md:pb-8 border-b border-white/5">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl shrink-0">
              <Building2 size={20} className="text-cyan-400 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-none mb-1 md:mb-1.5">{sgsstData.cliente}</h3>
              <p className="text-[10px] md:text-xs text-slate-500 font-bold tracking-widest uppercase">ID-AUDIT: 2026-07-A</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#05080a] border border-emerald-500/20 px-3 py-1.5 md:px-4 md:py-2 rounded-full w-max">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] md:text-xs font-bold text-emerald-400 tracking-wider uppercase">Sincronizado</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          
          <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-[#050608] border border-white/5 rounded-2xl p-5 md:p-6 flex items-center justify-between group transition-colors hover:border-cyan-500/20">
                <div className="flex flex-col">
                  <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Salud Normativa</span>
                  <span className="text-xl md:text-2xl font-black text-white tracking-tight">{sgsstData.kpis.nivelRiesgo}</span>
                  <span className="text-xs text-emerald-400 font-medium mt-1">+12% vs mes anterior</span>
                </div>
                <RadialGauge value={93} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#050608] border border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between group hover:border-white/10 transition-colors">
                  <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Estándares</span>
                  <span className="text-3xl md:text-4xl font-black text-white tracking-tighter mt-4">{sgsstData.kpis.total}</span>
                </div>
                <div className="bg-[#050608] border border-white/5 rounded-2xl p-4 md:p-5 flex flex-col justify-between group hover:border-amber-500/20 transition-colors">
                  <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Brechas</span>
                  <div className="flex items-end justify-between mt-4">
                    <span className="text-3xl md:text-4xl font-black text-amber-400 tracking-tighter">{sgsstData.kpis.brechas}</span>
                    <AlertTriangle size={18} className="text-amber-500/50 mb-1" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#050608] border border-white/5 rounded-2xl p-5 md:p-8 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-cyan-500" strokeWidth={2.5} />
                <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-widest">Evolución Semestral</h4>
              </div>
              <VerticalBarChart />
            </div>
          </div>

          <div className="lg:col-span-1 bg-[#050608] border border-white/5 rounded-2xl p-5 md:p-8 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-8 md:mb-10 pb-4 border-b border-white/5">
              <BarChart3 size={16} className="text-slate-400" strokeWidth={2.5} />
              <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-widest">Auditoría Interna</h4>
            </div>

            <div className="flex flex-col gap-6 flex-1 justify-center">
              {sgsstData.auditorias.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2 md:gap-3 group">
                  <div className="flex justify-between items-end text-xs md:text-sm">
                    <span className="font-semibold text-slate-400 group-hover:text-white transition-colors truncate pr-4">{item.area}</span>
                    <span className={`font-bold shrink-0 ${item.avance === 100 ? 'text-cyan-400' : 'text-slate-500'}`}>
                      {item.avance}%
                    </span>
                  </div>
                  <GPUHorizontalBar avance={item.avance} delay={idx * 0.15} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
};