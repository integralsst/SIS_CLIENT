import { X, Check, AlertTriangle, Zap } from 'lucide-react';

const Comparison = () => {
  return (
    // Quité el padding en Y gigante (py-20 a py-8)
    <section id="how" className="py-8 md:py-12 px-4 md:px-6 max-w-5xl mx-auto">
      {/* Reduje el gap de 8 a 6 */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        
        {/* Lado Tradicional */}
        <div className="p-6 md:p-8 rounded-[2rem] border border-white/5 bg-[#0a0a0a] shadow-inner flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-5 text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
            <AlertTriangle size={16} /> Gestión Manual
          </div>
          <ul className="space-y-4 text-slate-500 text-sm md:text-base font-medium">
            <li className="flex items-start gap-3">
              <X size={18} className="text-slate-600 shrink-0 mt-0.5" /> 
              <span>Carpetas físicas y Excels desactualizados.</span>
            </li>
            <li className="flex items-start gap-3">
              <X size={18} className="text-slate-600 shrink-0 mt-0.5" /> 
              <span>Olvido de vencimientos de carnets.</span>
            </li>
            <li className="flex items-start gap-3">
              <X size={18} className="text-slate-600 shrink-0 mt-0.5" /> 
              <span>Riesgo constante de sanciones legales.</span>
            </li>
          </ul>
        </div>

        {/* Lado SIS */}
        <div className="p-6 md:p-8 rounded-[2rem] border border-cyan-500/20 bg-cyan-950/20 backdrop-blur-md relative overflow-hidden flex flex-col justify-center shadow-[0_0_40px_-10px_rgba(6,182,212,0.1)]">
          <div className="absolute top-0 right-0 bg-cyan-500 text-black px-4 py-1.5 rounded-bl-[1rem] text-[9px] font-black uppercase tracking-wider">La Solución</div>
          <div className="flex items-center gap-3 mb-5 text-cyan-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
            <Zap size={16} className="fill-cyan-400" /> Sistema SIS
          </div>
          <ul className="space-y-4 text-white text-sm md:text-base font-medium">
            <li className="flex items-start gap-3">
              <Check size={18} className="text-cyan-400 shrink-0 mt-0.5" /> 
              <span>Dashboards con alertas automáticas.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check size={18} className="text-cyan-400 shrink-0 mt-0.5" /> 
              <span>Repositorio en la nube con validez.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check size={18} className="text-cyan-400 shrink-0 mt-0.5" /> 
              <span>Reportes ejecutivos en segundos.</span>
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
};

export default Comparison;