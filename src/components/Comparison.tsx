import { X, Check, AlertTriangle, Zap } from 'lucide-react';

const Comparison = () => {
  return (
    <section id="how" className="py-20 px-6 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Lado Tradicional */}
        <div className="p-8 rounded-3xl border border-red-500/10 bg-red-500/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 text-red-400 font-bold uppercase tracking-widest text-xs">
            <AlertTriangle size={18} /> Gestión Tradicional
          </div>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li className="flex gap-3">
              <X size={16} className="text-red-500 shrink-0 mt-0.5" /> 
              Carpetas físicas y archivos de Excel desactualizados.
            </li>
            <li className="flex gap-3">
              <X size={16} className="text-red-500 shrink-0 mt-0.5" /> 
              Olvido de fechas de vencimiento de carnets y pólizas.
            </li>
            <li className="flex gap-3">
              <X size={16} className="text-red-500 shrink-0 mt-0.5" /> 
              Riesgo de sanciones legales por falta de evidencia.
            </li>
          </ul>
        </div>

        {/* Lado SIS */}
        <div className="p-8 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-cyan-500 text-black px-4 py-1 text-[10px] font-black uppercase">Recomendado</div>
          <div className="flex items-center gap-3 mb-6 text-cyan-400 font-bold uppercase tracking-widest text-xs">
            <Zap size={18} className="fill-cyan-400" /> Sistema SIS
          </div>
          <ul className="space-y-4 text-white text-sm">
            <li className="flex gap-3">
              <Check size={16} className="text-cyan-400 shrink-0 mt-0.5" /> 
              Dashboards en tiempo real con alertas automáticas.
            </li>
            <li className="flex gap-3">
              <Check size={16} className="text-cyan-400 shrink-0 mt-0.5" /> 
              Repositorio en la nube con validez legal.
            </li>
            <li className="flex gap-3">
              <Check size={16} className="text-cyan-400 shrink-0 mt-0.5" /> 
              Reportes ejecutivos generados en segundos.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Comparison;