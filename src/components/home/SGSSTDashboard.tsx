"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, XCircle, AlertTriangle, BarChart3, PieChart,
  ShieldCheck, Building2, MousePointerClick,
  Scale, ClipboardList, TrendingUp
} from "lucide-react";

// --- DATOS MOCK ORIENTADOS A SG-SST ---
const sgsstData = {
  emisor: "SIS Sistema Integral en Riesgos Laborales S.A.S.",
  cliente: "Empresa Constructora XYZ S.A.",
  nit: "900.123.456-7",
  periodo: "Corte: Julio 2026",
  fechaEmision: "01 de Julio, 2026",
  kpis: {
    totalEstandares: 60,
    cumplimiento: 56,
    planMejora: 4,
    criticos: 0,
    nivelRiesgoSancion: "Mínimo",
  },
  evolucionCumplimiento: [
    { mes: "Ene", porcentaje: 65 },
    { mes: "Feb", porcentaje: 72 },
    { mes: "Mar", porcentaje: 80 },
    { mes: "Abr", porcentaje: 88 },
    { mes: "May", porcentaje: 91 },
    { mes: "Jun", porcentaje: 93.3 },
  ],
  auditoriasInternas: [
    { area: "Matriz Riesgos 3x3 (BS)", avance: 100 },
    { area: "Bitácoras Actualizadas", avance: 95 }, 
    { area: "Gestión COPASST/Vigía", avance: 100 },   
    { area: "Planes Emergencia", avance: 85 },
    { area: "Medicina del Trabajo", avance: 90 },   
  ]
};

// --- COMPONENTES BASE ---
const ReportSection: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; className?: string }> = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white border border-slate-200 rounded-lg p-3 md:p-5 flex flex-col h-full shadow-sm ${className}`}>
    <div className="flex items-center gap-2 mb-3 md:mb-4 pb-2 border-b border-slate-100">
      <Icon size={16} className="text-[#1d428a] md:w-[18px] md:h-[18px]" />
      <h3 className="text-xs md:text-sm font-bold text-[#0a1d37] uppercase tracking-wide">{title}</h3>
    </div>
    <div className="flex-1 min-h-0 relative w-full flex flex-col justify-center">
      {children}
    </div>
  </div>
);

// 1. Gráfico de Barras
const ComplianceBarChart: React.FC<{ data: typeof sgsstData.auditoriasInternas }> = ({ data }) => {
  return (
    <div className="flex flex-col justify-between h-full w-full gap-2 md:gap-3">
      {data.map((item, idx) => {
        return (
          <div key={idx} className="flex flex-col gap-1">
            <div className="flex justify-between items-end text-[10px] md:text-xs">
              <span className="font-semibold text-slate-600 truncate mr-2">{item.area}</span>
              <span className="font-bold text-[#0a1d37]">{item.avance}%</span>
            </div>
            <div className="w-full h-1.5 md:h-2.5 bg-slate-100 rounded-sm overflow-hidden transform-gpu">
              <motion.div 
                className={`h-full rounded-sm transform-gpu will-change-[width] ${item.avance === 100 ? 'bg-cyan-500' : 'bg-[#1d428a]'}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${item.avance}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 2. Gráfico de Área
const TimelineAreaChart: React.FC<{ data: typeof sgsstData.evolucionCumplimiento }> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxVal = 100;

  const getCoordinates = (index: number, value: number) => ({
    x: (index / (data.length - 1)) * 100,
    y: 100 - (value / maxVal) * 100
  });

  const pointsList = data.map((d, i) => getCoordinates(i, d.porcentaje));
  const polylinePoints = pointsList.map(p => `${p.x},${p.y}`).join(" ");
  const areaPoints = `${polylinePoints} 100,100 0,100`;

  return (
    <div className="w-full h-full flex flex-col relative pt-2">
      <div className="flex-1 relative w-full mb-2 min-h-[100px] md:min-h-[120px]">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-full border-t border-slate-100 relative">
              <span className="absolute -top-3.5 -left-1 text-[8px] md:text-[9px] font-medium text-slate-400 bg-white pr-1">
                {Math.round((maxVal * (1 - i/3)))}%
              </span>
            </div>
          ))}
        </div>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full overflow-visible ml-5 md:ml-6 w-[calc(100%-1.25rem)] md:w-[calc(100%-1.5rem)]">
          <defs>
            <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1d428a" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <motion.polygon points={areaPoints} fill="url(#areaColor)" 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} 
            className="transform-gpu" />
          
          <motion.polyline points={polylinePoints} fill="transparent" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} 
            className="transform-gpu" />
        </svg>

        {pointsList.map((p, i) => (
          <div key={`dot-${i}`} 
               className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center cursor-pointer z-20 group ml-5 md:ml-6 touch-manipulation"
               style={{ left: `calc(${p.x}% - 0.5rem)`, top: `${p.y}%` }}
               onMouseEnter={() => setHoveredIndex(i)} 
               onMouseLeave={() => setHoveredIndex(null)}
               onClick={() => setHoveredIndex(hoveredIndex === i ? null : i)}
          >
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.5 + (i*0.1) }}
                 className="relative w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white border-2 border-cyan-500 group-hover:scale-125 group-hover:bg-cyan-500 transition-all duration-200 shadow-sm" />
            
            <AnimatePresence>
              {hoveredIndex === i && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: -5 }} exit={{ opacity: 0, y: 0 }}
                     className="absolute bottom-full left-1/2 -translate-x-1/2 bg-[#0a1d37] text-white text-[9px] md:text-[10px] font-medium py-1 px-2 rounded shadow-md pointer-events-none whitespace-nowrap z-30 transform-gpu">
                  {data[i].porcentaje.toFixed(1)}%
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end mt-1 md:mt-2 pl-5 md:pl-6">
        {data.map((d, i) => (
          <span key={i} className="text-[8px] md:text-[10px] font-semibold text-slate-500 whitespace-nowrap">{d.mes}</span>
        ))}
      </div>
    </div>
  );
};

// 3. Gráfico de Dona
const StatusDonutChart: React.FC<{ kpis: typeof sgsstData.kpis }> = ({ kpis }) => {
  const data = [
    { label: "Cumple", val: kpis.cumplimiento, color: "#06b6d4" },     
    { label: "Mejora", val: kpis.planMejora, color: "#f59e0b" }, 
    { label: "Crítico", val: kpis.criticos, color: "#ef4444" } 
  ];
  const total = kpis.totalEstandares;
  let accumulatedPct = 0;
  const radius = 40; 
  const circumference = 2 * Math.PI * radius; 

  return (
    <div className="flex flex-row items-center justify-center gap-4 h-full w-full">
      <div className="relative h-full aspect-square max-h-[90px] md:max-h-[120px] flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible transform -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
          {data.map((d, i) => {
            if (d.val === 0) return null;
            const pct = (d.val / total) * 100;
            const dash = `${(pct / 100) * circumference} ${circumference}`; 
            const offset = -((accumulatedPct / 100) * circumference);
            accumulatedPct += pct;
            return (
              <motion.circle key={i} cx="50" cy="50" r={radius} fill="transparent" stroke={d.color} strokeWidth="8"
                      strokeDasharray={dash} strokeDashoffset={offset} strokeLinecap="round"
                      initial={{ strokeDasharray: `0 ${circumference}` }} whileInView={{ strokeDasharray: dash }} viewport={{ once: true }} 
                      transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                      className="transition-all duration-300 transform-gpu origin-center" />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} 
            className="text-sm md:text-xl font-black text-[#0a1d37]">
            {((kpis.cumplimiento / total) * 100).toFixed(0)}%
          </motion.span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 w-full justify-center">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: d.color }} />
              <span className="text-[10px] md:text-xs font-semibold text-slate-600 leading-none">{d.label}</span>
            </div>
            <div className="pl-3.5">
              <span className="text-xs font-bold text-[#0a1d37] leading-none">{d.val} ítems</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SECCIÓN PRINCIPAL ---
export const SGSSTDashboard = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <section className="w-full max-w-[100vw] overflow-x-hidden font-sans flex flex-col items-center pt-10 pb-16 md:py-24">
      
      {/* CABECERA */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl flex flex-col items-center text-center mb-10 md:mb-20 z-10 px-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium mb-4 md:mb-6">
          <ShieldCheck size={12} /> Auditoría Continua
        </div>
        <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3 md:mb-4 leading-[1.1]">
          Preparados para el <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Ministerio</span>
        </h3>
        <p className="text-slate-400 font-medium max-w-xl mx-auto text-sm md:text-lg">
          Simula visitas, identifica brechas en tu Resolución 0312 y mantén el cumplimiento legal impecable.
        </p>
      </motion.div>

      {/* CONTENEDOR DEL REPORTE */}
      <div className="relative w-full max-w-[900px] z-0 md:px-6">
        
        {/* PAPELES DE FONDO (Ocultos en móvil para limpiar el diseño) */}
        <motion.div className="hidden md:flex absolute inset-0 bg-slate-900 border border-slate-800 rounded-sm overflow-hidden z-0 flex-col transform-gpu shadow-xl"
          initial={{ opacity: 0, rotate: 0, scale: 0.95 }} whileInView={{ opacity: 1, rotate: 4, scale: 0.95, y: 25, x: 15 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }} />
        <motion.div className="hidden md:flex absolute inset-0 bg-slate-800 border border-slate-700 rounded-sm overflow-hidden z-10 flex-col transform-gpu shadow-lg"
          initial={{ opacity: 0, rotate: 0, scale: 0.98 }} whileInView={{ opacity: 1, rotate: -3, scale: 0.98, y: 12, x: -15 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} />

        {/* PAPEL PRINCIPAL (De borde a borde en celular) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="relative z-20 w-full bg-white md:shadow-[0_0_50px_-15px_rgba(6,182,212,0.15)] border-y md:border border-slate-200 md:rounded-sm overflow-hidden flex flex-col transform-gpu"
        >
          {/* ENCABEZADO */}
          <div className="bg-slate-900 px-4 py-4 md:px-8 md:py-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-1.5 md:p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg shrink-0">
                <Scale size={20} className="text-cyan-400 md:w-7 md:h-7" />
              </div>
              <div>
                <h1 className="text-sm md:text-xl font-bold tracking-tight leading-tight">Estado SG-SST</h1>
                <p className="text-[9px] md:text-sm text-slate-400 font-medium opacity-90">Simulador MinTrabajo</p>
              </div>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-800 sm:border-0 relative z-10">
              <p className="text-xs md:text-sm font-bold flex items-center justify-start sm:justify-end gap-1.5 text-cyan-300">
                <Building2 size={12} className="md:w-[14px] md:h-[14px]" /> {sgsstData.cliente}
              </p>
            </div>
          </div>

          {/* CUERPO DEL INFORME */}
          <div className="p-4 md:p-8 flex flex-col gap-5 md:gap-6">
            
            {/* Título de sección */}
            <div className="flex flex-col">
              <h2 className="text-sm md:text-lg font-bold text-[#0a1d37] border-l-3 md:border-l-4 border-cyan-500 pl-2 md:pl-3 leading-tight">
                Indicadores de Conformidad
              </h2>
              <div className="md:hidden flex items-center gap-1.5 text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-2 pl-3">
                <MousePointerClick size={10} className="text-cyan-500" /> Desliza para ver más
              </div>
            </div>

            {/* KPIs - Carrusel Horizontal en móvil, Grid en Desktop */}
            <div className="flex w-full overflow-x-auto snap-x snap-mandatory gap-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-5 md:pb-0 md:overflow-visible">
              {[
                { label: "Estándares", val: sgsstData.kpis.totalEstandares, Icon: ClipboardList, color: "text-[#1d428a]" },
                { label: "Cumplimiento", val: sgsstData.kpis.cumplimiento, Icon: CheckCircle2, color: "text-emerald-600" },
                { label: "Plan Mejora", val: sgsstData.kpis.planMejora, Icon: AlertTriangle, color: "text-amber-500" },
                { label: "Críticos", val: sgsstData.kpis.criticos, Icon: XCircle, color: "text-slate-400" },
                { label: "Riesgo Sanción", val: sgsstData.kpis.nivelRiesgoSancion, Icon: ShieldCheck, color: "text-cyan-600" },
              ].map((kpi, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-lg p-3 md:p-4 flex flex-col relative shrink-0 w-[130px] md:w-auto snap-start">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight">{kpi.label}</span>
                    <kpi.Icon size={12} className={`${kpi.color} opacity-80 shrink-0`} />
                  </div>
                  <span className={`text-xl md:text-2xl font-black ${kpi.color} leading-none mt-auto`}>
                    {kpi.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Gráficos */}
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mt-1">
              
              <div className="flex-[3] min-h-[190px] md:min-h-[280px]">
                 <ReportSection title="Curva de Blindaje Normativo" icon={TrendingUp}>
                    <TimelineAreaChart data={sgsstData.evolucionCumplimiento} />
                 </ReportSection>
              </div>

              <div className="flex-[2] flex flex-col gap-4 md:gap-6">
                 <div className="flex-1 min-h-[160px]">
                   <ReportSection title="Implementación Documental" icon={BarChart3}>
                     <ComplianceBarChart data={sgsstData.auditoriasInternas} />
                   </ReportSection>
                 </div>
                 
                 {/* Gráfico de dona: Oculto en móvil para ahorrar espacio vertical */}
                 <div className="hidden sm:flex flex-1 min-h-[130px] md:min-h-[160px]">
                   <ReportSection title="Estado de la Normativa" icon={PieChart}>
                     <StatusDonutChart kpis={sgsstData.kpis} />
                   </ReportSection>
                 </div>
              </div>

            </div>
          </div>

          {/* PIE DE PÁGINA */}
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex justify-between items-center text-[9px] md:text-[10px] text-slate-400 font-medium">
            <p>© {new Date().getFullYear()} SIS Riesgos Laborales.</p>
            <p className="hidden md:block">Informe Generado Automáticamente.</p>
          </div>

        </motion.div>
      </div>
    </section>
  );
};