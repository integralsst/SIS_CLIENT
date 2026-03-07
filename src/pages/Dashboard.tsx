import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, LogOut, Home, ShieldCheck, Briefcase } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Si no hay usuario, mostramos un estado de carga o redirigimos
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#05080a] text-white p-6 md:p-12">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <main className="max-w-5xl mx-auto relative">
        {/* Header del Dashboard */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold tracking-tight mb-2">Panel de Control</h1>
            <p className="text-slate-500">Gestión de Seguridad y Salud en el Trabajo</p>
          </motion.div>

          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium"
            >
              <Home size={16} /> Ir al inicio
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"
            >
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Rejilla de Info de Usuario */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold italic">Bienvenido, {user.name}</h2>
                <p className="text-slate-400 text-sm">Sesión activa como {user.role}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Empresa</p>
                <p className="text-lg font-medium">{user.company || 'No especificada'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Correo</p>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-[2rem] bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/20 backdrop-blur-md flex flex-col justify-between"
          >
            <Briefcase className="text-cyan-400 mb-4" size={32} />
            <div>
              <h3 className="text-lg font-bold mb-2">Estado del Sistema</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tu plataforma está conectada correctamente a la base de datos remota de Hostinger.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-[10px] uppercase tracking-widest text-cyan-400 font-black">
              Servicio Activo
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}