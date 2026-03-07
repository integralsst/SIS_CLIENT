import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Ajusta el nombre de tu archivo de logo según lo que tienes en assets
import Logo from '../assets/logosis.webp'; 

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05080a] relative px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Efectos de fondo premium */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-600/10 blur-[150px] -z-10 rounded-full pointer-events-none" />

      {/* Tarjeta de Login Animada */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] bg-[#0a0a0a]/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-white/5"
      >
        
        {/* Logo superior */}
        <div className="flex justify-center mb-8">
          <div className="h-12 w-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
             <img src={Logo} alt="Logo" className="h-8 w-auto object-contain" />
          </div>
        </div>

        {/* Encabezado */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            Bienvenido de nuevo
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {/* Formulario */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          {/* Input: Correo */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Correo Electrónico
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="ejemplo@empresa.com"
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Input: Contraseña */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Contraseña
              </label>
              <a href="#" className="text-[11px] font-bold text-cyan-500 hover:text-cyan-400 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm tracking-widest"
                required
              />
            </div>
          </div>

          {/* Botón Iniciar Sesión */}
          <button
            type="submit"
            // Si quieres el botón morado de la foto, cambia el bg-gradient a: "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
            className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-900/20 transition-all hover:scale-[1.02] active:scale-95 border border-white/10"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Enlaces inferiores */}
        <div className="mt-8 text-center space-y-6">
          <p className="text-sm text-slate-400">
            ¿Aún no tienes cuenta?{' '}
            <a href="#" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
              Regístrate gratis
            </a>
          </p>
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Volver al inicio
          </Link>
        </div>

      </motion.div>
    </div>
  );
}