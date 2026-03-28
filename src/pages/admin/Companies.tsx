// src/pages/Users.tsx
import React, { useState } from 'react';
import { UserPlus, MoreHorizontal, Shield, Mail, Building, Search } from 'lucide-react';

// Interfaz temporal para los datos de prueba
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'USER';
  company: string;
  status: 'Activo' | 'Pendiente';
}

const mockUsers: UserData[] = [
  { id: '1', name: 'Administrador Principal', email: 'admin@empresa.com', role: 'OWNER', company: 'Consultoría Global', status: 'Activo' },
  { id: '2', name: 'Carlos Mendoza', email: 'carlos@tecnologia.com', role: 'ADMIN', company: 'TechCorp Solutions', status: 'Activo' },
  { id: '3', name: 'Ana Ruiz', email: 'ana.ruiz@industrias.com', role: 'USER', company: 'Industrias XYZ', status: 'Pendiente' },
  { id: '4', name: 'Laura Gómez', email: 'laura@servicios.com', role: 'USER', company: 'Servicios Integrales', status: 'Activo' },
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');

  // Función para renderizar el badge del rol con diferentes colores
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">PROPIETARIO</span>;
      case 'ADMIN':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">ADMIN</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">USUARIO</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full">
      {/* Encabezado */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Gestión de Usuarios</h1>
          <p className="text-sm text-neutral-400 mt-1">Administra los accesos y roles de la plataforma multiempresa.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 active:scale-95">
          <UserPlus size={18} />
          <span>Invitar Usuario</span>
        </button>
      </header>

      {/* Barra de herramientas (Buscador y Filtros) */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111111] border border-neutral-800/60 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
          />
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="bg-[#111111] border border-neutral-800/60 rounded-2xl overflow-hidden shadow-xl flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0a0a0a] border-b border-neutral-800/60">
              <tr>
                <th className="px-6 py-4 font-medium text-neutral-400 text-xs uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 font-medium text-neutral-400 text-xs uppercase tracking-wider">Empresa (Tenant)</th>
                <th className="px-6 py-4 font-medium text-neutral-400 text-xs uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 font-medium text-neutral-400 text-xs uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 font-medium text-neutral-400 text-xs uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold border border-neutral-700">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                          <Mail size={12} /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <Building size={14} className="text-neutral-500" />
                      {user.company}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-neutral-500 hidden md:block" />
                      {getRoleBadge(user.role)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${user.status === 'Activo' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Activo' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-neutral-500 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginación simple (Visual) */}
        <div className="px-6 py-4 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500">
          <span>Mostrando 1 a 4 de 4 usuarios</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md bg-[#0a0a0a] border border-neutral-800 hover:text-white transition-colors disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 rounded-md bg-[#0a0a0a] border border-neutral-800 hover:text-white transition-colors disabled:opacity-50" disabled>Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}