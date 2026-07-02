
import { DiagnosticQuiz } from '../../components/home/DiagnosticQuiz';
import { ShieldCheck } from 'lucide-react';

export default function DiagnosticoPage() {
  return (
    // Usamos el mismo fondo corporativo oscuro para mantener la coherencia de marca,
    // lo que hará que el componente del Quiz (que es blanco) resalte muchísimo.
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-cyan-500/30 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* --- ELEMENTOS DE FONDO --- */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[400px] bg-cyan-500/10 blur-[100px] pointer-events-none z-0" />

      {/* --- LOGO MINIMALISTA --- */}
      {/* Da confianza al usuario de que está en el sitio oficial sin ser un menú navegable */}
      <div className="relative z-10 flex items-center gap-2 mb-8 md:mb-12">
         <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
           <ShieldCheck className="text-cyan-400" size={24} />
         </div>
         <span className="text-white font-bold text-xl md:text-2xl tracking-tight">
           SIS <span className="text-slate-500 font-normal">| Riesgos Laborales</span>
         </span>
      </div>

      {/* --- EL COMPONENTE PRINCIPAL --- */}
      <div className="relative z-10 w-full flex justify-center">
        {/* Aquí simplemente importamos y renderizamos el componente que ya creaste */}
        <DiagnosticQuiz />
      </div>

      {/* --- FOOTER DE CONFIANZA --- */}
      {/* Solo texto legal básico para cumplir con políticas de publicidad (Google/Meta Ads) */}
      <div className="relative z-10 mt-12 text-center text-slate-500 text-xs font-medium">
        <p>© {new Date().getFullYear()} Sistema Integral en Riesgos Laborales S.A.S.</p>
        <div className="flex gap-4 justify-center mt-2">
          <a href="#" className="hover:text-cyan-400 transition-colors">Términos de Servicio</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Política de Privacidad</a>
        </div>
      </div>
      
    </div>
  );
}