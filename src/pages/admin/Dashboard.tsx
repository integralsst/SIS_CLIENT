import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Users, Building2, TrendingUp, Activity, BellRing } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      {/* Header Limpio (Sin botones, ya están en el layout) */}
      <header className="mb-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Hola, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-neutral-400">
            Resumen de actividad de <span className="text-neutral-200 font-medium">{user.company || 'tu organización'}</span>.
          </p>
        </motion.div>
      </header>

      {/* Grid de Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Usuarios Activos", value: "12", trend: "+2 este mes", icon: <Users size={20} className="text-blue-400" />, bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { title: "Empresas Conectadas", value: "4", trend: "Estable", icon: <Building2 size={20} className="text-purple-400" />, bg: "bg-purple-500/10", border: "border-purple-500/20" },
          { title: "Campañas Enviadas", value: "8", trend: "+12% vs mes anterior", icon: <TrendingUp size={20} className="text-emerald-400" />, bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
          { title: "Estado del Sistema", value: "Óptimo", trend: "100% Uptime", icon: <Activity size={20} className="text-cyan-400" />, bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
        ].map((metric, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-[#111111] border border-neutral-800/60 shadow-lg relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${metric.bg} ${metric.border} border`}>
                {metric.icon}
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{metric.value}</h3>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">{metric.title}</p>
              <p className="text-xs text-neutral-500">{metric.trend}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sección Inferior: Detalles y Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Card de Perfil Técnico (Reutilizado pero adaptado) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }} 
          className="lg:col-span-2 p-8 rounded-[2rem] bg-[#111111] border border-neutral-800/60 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-cyan-500" size={24} />
              <h2 className="text-lg font-bold text-white">Información de Sesión</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-neutral-800">
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Rol Asignado</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <p className="text-sm font-medium text-neutral-200">{user.role}</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-neutral-800">
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">ID de Inquilino (Tenant)</p>
                <p className="text-sm font-mono text-neutral-400">{user.companyId || 'global-admin-123'}</p>
              </div>
              <div className="col-span-2 p-4 rounded-2xl bg-[#0a0a0a] border border-neutral-800">
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Correo Electrónico</p>
                <p className="text-sm font-medium text-neutral-200">{user.email}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Panel de Actividad Reciente (Mockup) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }} 
          className="p-8 rounded-[2rem] bg-[#111111] border border-neutral-800/60"
        >
          <div className="flex items-center gap-3 mb-6">
            <BellRing className="text-purple-500" size={20} />
            <h3 className="text-lg font-bold text-white">Actividad Reciente</h3>
          </div>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-neutral-800 before:to-transparent">
            {/* Ítem de actividad 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-neutral-900 border-2 border-emerald-500 z-10"></div>
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] pl-4 md:pl-0 md:pr-4">
                <div className="p-3 bg-[#0a0a0a] rounded-xl border border-neutral-800/60">
                  <p className="text-xs text-white font-medium">Nueva empresa registrada</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Hace 2 horas</p>
                </div>
              </div>
            </div>
            
            {/* Ítem de actividad 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-neutral-900 border-2 border-blue-500 z-10"></div>
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] pl-4 md:pl-0 md:pr-4">
                <div className="p-3 bg-[#0a0a0a] rounded-xl border border-neutral-800/60">
                  <p className="text-xs text-white font-medium">Campaña SST enviada</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Ayer, 14:30</p>
                </div>
              </div>
            </div>
            
            {/* Ítem de actividad 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-neutral-900 border-2 border-neutral-600 z-10"></div>
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] pl-4 md:pl-0 md:pr-4">
                <div className="p-3 bg-[#0a0a0a] rounded-xl border border-neutral-800/60">
                  <p className="text-xs text-white font-medium">Actualización de sistema</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">25 Mar 2026</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}