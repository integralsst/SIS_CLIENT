// src/pages/admin/Companies.tsx
import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Users, Contact2, Calendar, Trash2, X, Loader2 } from 'lucide-react';

// Interfaz que coincide con la respuesta de tu backend Prisma
interface Company {
  id: string;
  name: string;
  taxId: string | null;
  _count: {
    users: number;
    contacts: number;
  };
  createdAt: string;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para el Modal de Crear Empresa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', taxId: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // URL base de tu API (Asegúrate de que el puerto coincida con tu backend)
 const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/companies` 
  : 'http://localhost:4000/api/companies';

  // 1. READ: Obtener las empresas
  const fetchCompanies = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener empresas');
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error(error);
      alert('Hubo un problema al cargar las empresas.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // 2. CREATE: Guardar nueva empresa
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Error al crear la empresa');
      
      // Limpiar formulario, cerrar modal y recargar lista
      setFormData({ name: '', taxId: '' });
      setIsModalOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error(error);
      alert('Hubo un error al crear la empresa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. DELETE: Eliminar empresa
  const handleDeleteCompany = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar "${name}"? Esto borrará todos sus usuarios y contactos.`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar');
      
      // Actualizar el estado local para no tener que recargar toda la página
      setCompanies(companies.filter(company => company.id !== id));
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar la empresa.');
    }
  };

  // Filtrado de búsqueda
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (company.taxId && company.taxId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full relative">
      {/* Encabezado */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Gestión de Empresas</h1>
          <p className="text-sm text-neutral-400 mt-1">Administra los inquilinos (tenants) registrados en tu plataforma SaaS.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 active:scale-95"
        >
          <Plus size={18} />
          <span>Nueva Empresa</span>
        </button>
      </header>

      {/* Barra de Búsqueda */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o identificación..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111111] border border-neutral-800/60 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
          />
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="bg-[#111111] border border-neutral-800/60 rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0a0a0a] border-b border-neutral-800/60">
              <tr>
                <th className="px-6 py-4 font-medium text-neutral-400 text-xs uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-4 font-medium text-neutral-400 text-xs uppercase tracking-wider">Identificación</th>
                <th className="px-6 py-4 font-medium text-neutral-400 text-xs uppercase tracking-wider">Métricas</th>
                <th className="px-6 py-4 font-medium text-neutral-400 text-xs uppercase tracking-wider">Registro</th>
                <th className="px-6 py-4 font-medium text-neutral-400 text-xs uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Cargando empresas...
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    No se encontraron empresas.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-neutral-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-neutral-800/80 flex items-center justify-center text-neutral-300 border border-neutral-700/50">
                          <Building2 size={16} />
                        </div>
                        <span className="font-semibold text-white">{company.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-neutral-400 bg-neutral-800/50 px-2.5 py-1 rounded-md border border-neutral-700/50">
                        {company.taxId || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-neutral-300" title="Usuarios">
                          <Users size={14} className="text-neutral-500" />
                          <span className="font-medium">{company._count.users}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-300" title="Contactos/Leads">
                          <Contact2 size={14} className="text-neutral-500" />
                          <span className="font-medium">{company._count.contacts}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-neutral-400 text-xs">
                        <Calendar size={13} />
                        {new Date(company.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteCompany(company.id, company.name)}
                        className="text-neutral-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Eliminar Empresa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer de la tabla */}
        <div className="px-6 py-4 border-t border-neutral-800/60 text-xs text-neutral-500">
          Mostrando {filteredCompanies.length} empresas registradas
        </div>
      </div>

      {/* MODAL DE CREACIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#111111] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white">Registrar Nueva Empresa</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCompany} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Nombre de la Empresa *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej. Consultores Asociados"
                    className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl py-2 px-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Identificación Fiscal (Opcional)</label>
                  <input 
                    type="text" 
                    value={formData.taxId}
                    onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                    placeholder="Ej. NIT o RUC"
                    className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl py-2 px-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-black bg-white hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}