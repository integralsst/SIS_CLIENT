// src/pages/Users.tsx
import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit2, Shield, Mail, Building, Search, Loader2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'OWNER' | 'ADMIN' | 'USER';
  companyId: string | null;
  company?: { name: string };
  status?: string; 
}

export default function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal y estados de edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });

  const { token, user: currentUser } = useAuth();
  
  const API_URL = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api/users` 
    : 'http://localhost:4000/api/users';

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL, { headers: getHeaders() });
      if (!response.ok) throw new Error('Error fetching users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'USER' });
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserData) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingUser ? `${API_URL}/${editingUser.id}` : API_URL;
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({ ...formData, companyId: currentUser?.companyId })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error procesando la solicitud');
      
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar al usuario ${name}?`)) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Error al eliminar');
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      alert('Error eliminando usuario');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'OWNER':
      case 'SUPERADMIN':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">{role}</span>;
      case 'ADMIN':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">ADMIN</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">USER</span>;
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Gestión de Usuarios</h1>
          <p className="text-sm text-neutral-400 mt-1">Administra los accesos y roles de la plataforma.</p>
        </div>
        
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 active:scale-95"
        >
          <UserPlus size={18} />
          <span>Nuevo Usuario</span>
        </button>
      </header>

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

      <div className="bg-[#111111] border border-neutral-800/60 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0a0a0a] border-b border-neutral-800/60">
              <tr>
                <th className="px-6 py-4 font-medium text-neutral-400 text-xs uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 font-medium text-neutral-400 text-xs uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-4 font-medium text-neutral-400 text-xs uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 font-medium text-neutral-400 text-xs uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {isLoading ? (
                <tr><td colSpan={4} className="text-center py-10"><Loader2 className="animate-spin mx-auto text-neutral-500" /></td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold border border-neutral-700 uppercase">
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
                      {user.company?.name || 'Global (Sin empresa)'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-neutral-500 hidden md:block" />
                      {getRoleBadge(user.role)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="text-neutral-500 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Edit2 size={18} />
                    </button>
                    {currentUser?.id !== user.id && (
                      <button 
                        onClick={() => handleDelete(user.id, user.name)}
                        className="text-neutral-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-neutral-800/60 text-xs text-neutral-500">
          Mostrando {filteredUsers.length} usuarios
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Nombre Completo</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl py-2 px-3 text-sm text-white focus:border-neutral-600 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Correo Electrónico</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl py-2 px-3 text-sm text-white focus:border-neutral-600 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  {editingUser ? 'Nueva Contraseña (dejar en blanco para mantener actual)' : 'Contraseña Temporal'}
                </label>
                <input required={!editingUser} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl py-2 px-3 text-sm text-white focus:border-neutral-600 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Rol</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl py-2 px-3 text-sm text-white focus:border-neutral-600 outline-none">
                  <option value="USER">Usuario Estándar</option>
                  <option value="ADMIN">Administrador</option>
                  {currentUser?.role === 'SUPERADMIN' && (
                    <>
                      <option value="OWNER">Propietario</option>
                      <option value="SUPERADMIN">Super Administrador</option>
                    </>
                  )}
                </select>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-2.5 mt-4 rounded-xl text-sm font-bold text-black bg-white hover:bg-neutral-200 disabled:opacity-50">
                {isSubmitting ? 'Guardando...' : (editingUser ? 'Guardar Cambios' : 'Crear Usuario')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}