import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, Users, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

// 1. Definición estricta de interfaces para TypeScript
interface Contact {
  id?: string | number; // Opcional por si tu backend usa _id
  _id?: string; 
  email: string;
  status: 'LEAD' | 'CONTACTED' | string;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

export default function EmailMarketing() {
  useAuth(); // Protegemos la ruta
  
  // 2. Tipado de los estados
  const [emailList, setEmailList] = useState<string>('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isProcessingEmails, setIsProcessingEmails] = useState<boolean>(false);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const fetchContacts = async (): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/api/contacts`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('sis_token')}` }
      });
      const data: Contact[] = await res.json();
      setContacts(data);
    } catch (err) { 
      console.error("Error cargando contactos", err); 
    }
  };

  useEffect(() => { 
    fetchContacts(); 
  }, []);

  const pendingCount = contacts.filter(c => c.status === 'LEAD').length;
  const contactedCount = contacts.filter(c => c.status === 'CONTACTED').length;
  const dailyProgress = Math.min((contactedCount / 100) * 100, 100);

  // 3. Tipado correcto para el evento del formulario
  const handleProcessEmails = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsProcessingEmails(true);
    
    const emails = emailList.split(/[\n,]+/).map(e => e.trim()).filter(e => e.includes('@'));
    
    try {
      const response = await fetch(`${API_URL}/api/contacts/bulk`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sis_token')}`
        },
        body: JSON.stringify({ contacts: emails.map(email => ({ email })) }),
      });
      
      if (!response.ok) throw new Error('Error al guardar los correos en la base de datos');
      
      // Alerta de éxito con SweetAlert2
      Swal.fire({
        title: '¡Carga Exitosa!',
        text: `Se han guardado ${emails.length} contactos correctamente.`,
        icon: 'success',
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#0891b2' // cyan-600
      });

      setEmailList('');
      fetchContacts();
    } catch (err: unknown) { 
      // Manejo estricto del error en TS
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido';
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#0891b2'
      });
    } finally { 
      setIsProcessingEmails(false); 
    }
  };

  const handleSendCampaign = async (): Promise<void> => {
    // Reemplazo del window.confirm nativo por SweetAlert2
    const result = await Swal.fire({
      title: '¿Iniciar envío?',
      text: `Se enviarán correos a los próximos ${Math.min(pendingCount, 100)} prospectos.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0891b2', // cyan-600
      cancelButtonColor: '#ef4444',  // red-500
      confirmButtonText: 'Sí, enviar campaña',
      cancelButtonText: 'Cancelar',
      background: '#0a0a0a',
      color: '#fff'
    });

    if (!result.isConfirmed) return;

    setIsSending(true);
    try {
      const res = await fetch(`${API_URL}/api/campaigns/send`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('sis_token')}` }
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error enviando la campaña');
      
      Swal.fire({
        title: '¡Campaña Enviada!',
        text: 'Los correos han sido despachados con éxito.',
        icon: 'success',
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#0891b2'
      });
      
      fetchContacts();
    } catch (err: unknown) { 
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido';
      Swal.fire({
        title: 'Error de envío',
        text: errorMessage,
        icon: 'error',
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#0891b2'
      });
    } finally { 
      setIsSending(false); 
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-12 text-white relative">
      
      <div className="mb-8">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium w-fit px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20"
        >
          <ArrowLeft size={18} />
          Volver al Dashboard
        </Link>
      </div>

      <header className="space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tighter">Email Marketing</h1>
        <p className="text-xl text-slate-500">Gestión inteligente de prospectos SST en Pereira.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Audiencia Total" value={contacts.length} icon={<Users className="text-blue-400" />} />
        <StatCard label="Por Contactar" value={pendingCount} icon={<Clock className="text-amber-400" />} />
        <StatCard label="Ya Contactados" value={contactedCount} icon={<CheckCircle className="text-emerald-400" />} />
      </div>

      <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold">Cupo Diario Usado (Resend)</h3>
          <span className="text-2xl font-black text-cyan-400">{contactedCount}/100</span>
        </div>
        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${dailyProgress}%` }} className="h-full bg-cyan-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Mail size={20}/> Carga Masiva</h2>
            <form onSubmit={handleProcessEmails} className="space-y-4">
              <textarea 
                value={emailList} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmailList(e.target.value)} 
                placeholder="cliente@empresa.com" 
                className="w-full h-40 p-5 bg-black/20 border border-white/10 rounded-3xl outline-none resize-none focus:border-cyan-500/50 transition-colors" 
              />
              <button disabled={isProcessingEmails} className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-slate-200 transition-all flex justify-center disabled:opacity-50">
                {isProcessingEmails ? <Loader2 className="animate-spin"/> : 'Guardar en Base de Datos'}
              </button>
            </form>
            <button onClick={handleSendCampaign} disabled={isSending || pendingCount === 0} className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 font-black text-lg disabled:opacity-30 transition-all hover:scale-[1.02] active:scale-[0.98]">
              {isSending ? <Loader2 className="animate-spin mx-auto"/> : `ENVIAR A LOS PRÓXIMOS ${Math.min(pendingCount, 100)}`}
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold px-2">Estado de Clientes</h2>
          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <AnimatePresence>
              {contacts.map((c) => (
                <motion.div 
                  key={c.id || c._id || c.email} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
                >
                  <span className="text-sm truncate mr-4">{c.email}</span>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase shrink-0 ${c.status === 'LEAD' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {c.status === 'LEAD' ? 'Pendiente' : 'Enviado'}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {contacts.length === 0 && (
              <div className="text-center p-8 text-slate-500 border border-dashed border-white/10 rounded-2xl">
                No hay contactos registrados aún.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// 4. Componente hijo tipado correctamente
function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
      <div className="mb-4">{icon}</div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      <h3 className="text-4xl font-black mt-2 tracking-tighter">{value}</h3>
    </div>
  );
}