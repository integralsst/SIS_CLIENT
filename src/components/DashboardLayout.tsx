// src/components/DashboardLayout.tsx
import { Outlet, Link, useLocation } from 'react-router-dom';
// Asumo que usas lucide-react por los íconos de tu proyecto anterior, si no, puedes cambiarlos
import { LayoutDashboard, Building2, Users, Mail, LogOut } from 'lucide-react';

export default function DashboardLayout() {
  const location = useLocation();

  // Función auxiliar para saber si el link está activo y pintarlo diferente
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      
      {/* SIDEBAR (Menú Lateral) */}
      <aside className="w-64 border-r border-neutral-800/50 bg-[#0a0a0a] flex flex-col z-20">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight">Panel de Control</h2>
          <p className="text-xs text-neutral-500 mt-1">Gestión SaaS</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium text-sm">Inicio</span>
          </Link>

          <Link 
            to="/dashboard/empresas" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/dashboard/empresas') ? 'bg-primary/10 text-primary' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}
          >
            <Building2 size={20} />
            <span className="font-medium text-sm">Empresas</span>
          </Link>

          <Link 
            to="/dashboard/usuarios" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/dashboard/usuarios') ? 'bg-primary/10 text-primary' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}
          >
            <Users size={20} />
            <span className="font-medium text-sm">Usuarios</span>
          </Link>

          <Link 
            to="/dashboard/email-marketing" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/dashboard/email-marketing') ? 'bg-primary/10 text-primary' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}
          >
            <Mail size={20} />
            <span className="font-medium text-sm">Email Marketing</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-800/50">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-400/10 transition-colors">
            <LogOut size={20} />
            <span className="font-medium text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL (Derecha) */}
      <main className="flex-1 relative overflow-y-auto">
        {/* Fondo de grilla que tienes en tu diseño actual */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        
        <div className="relative z-10 p-8">
          {/* Aquí es donde React Router inyectará las páginas dinámicamente */}
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}