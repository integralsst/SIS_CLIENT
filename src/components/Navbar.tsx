import { Shield } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="text-cyan-500" size={24} />
          <span className="font-bold text-xl tracking-tight text-white">SIS<span className="text-cyan-500">.</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Beneficios</a>
          <a href="#how" className="hover:text-white transition-colors">Cómo Funciona</a>
          <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
        </div>
        <button className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-cyan-500 hover:text-white transition-all">
          Iniciar Ahora
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 