import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, AlertCircle, Loader2, Users, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EmailMarketing() {
  useAuth(); // Protegemos la ruta
  const [emailList, setEmailList] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isProcessingEmails, setIsProcessingEmails] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/contacts`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('sis_token')}` }
      });
      const data = await res.json();
      setContacts(data);
    } catch (err) { console.error("Error cargando contactos", err); }
  };

  useEffect(() => { fetchContacts(); }, []);

  const pendingCount = contacts.filter(c => c.status === 'LEAD').length;
  const contactedCount = contacts.filter(c => c.status === 'CONTACTED').length;
  const dailyProgress = Math.min((contactedCount / 100) * 100, 100);

  const handleProcessEmails = async (e: React.FormEvent) => {
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
      if (!response.ok) throw new Error('Error al cargar');
      setStatus({ type: 'success', msg: `${emails.length} contactos cargados.` });
      setEmailList('');
      fetchContacts();
    } catch (err: any) { setStatus({ type: 'error', msg: err.message }); }
    finally { setIsProcessingEmails(false); }
  };

  const handleSendCampaign = async () => {
    if (!confirm(`Se enviarán correos a ${Math.min(pendingCount, 100)} prospectos. ¿Continuar?`)) return;
    setIsSending(true);
    try {
      const res = await fetch(`${API_URL}/api/campaigns/send`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('sis_token')}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus({ type: 'success', msg: 'Envío completado.' });
      fetchContacts();
    } catch (err: any) { setStatus({ type: 'error', msg: err.message }); }
    finally { setIsSending(false); }
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-12 text-white relative">
      <header className="space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tighter">Email Marketing</h1>
        <p className="text-xl text-slate-500">Gestión inteligente de prospectos SST en Pereira.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Audiencia Total" value={contacts.length} icon={<Users className="text-blue-400" />} />
        <StatCard label="Por Contactar" value={pendingCount} icon={<Clock className="text-amber-400" />} />
        <StatCard label="Ya Contactados" value={contactedCount} icon={<CheckCircle className="text-emerald-400" />} />
      </div>

      {/* Barra de Progreso Diaria */}
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
              <textarea value={emailList} onChange={(e) => setEmailList(e.target.value)} placeholder="cliente@empresa.com" className="w-full h-40 p-5 bg-black/20 border border-white/10 rounded-3xl outline-none resize-none" />
              <button disabled={isProcessingEmails} className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-slate-200 transition-all flex justify-center">
                {isProcessingEmails ? <Loader2 className="animate-spin"/> : 'Guardar en Base de Datos'}
              </button>
            </form>
            <button onClick={handleSendCampaign} disabled={isSending || pendingCount === 0} className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 font-black text-lg disabled:opacity-30">
              {isSending ? <Loader2 className="animate-spin mx-auto"/> : `ENVIAR A LOS PRÓXIMOS ${Math.min(pendingCount, 100)}`}
            </button>
          </div>
          
          {status && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 rounded-2xl flex items-center gap-3 border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              <AlertCircle size={18} /> {status.msg}
            </motion.div>
          )}
        </section>

        {/* Lista de Contactos con Badges */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold px-2">Estado de Clientes</h2>
          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
            <AnimatePresence>
              {contacts.map((c) => (
                <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-sm">{c.email}</span>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${c.status === 'LEAD' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {c.status === 'LEAD' ? 'Pendiente' : 'Enviado'}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
      <div className="mb-4">{icon}</div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      <h3 className="text-4xl font-black mt-2 tracking-tighter">{value}</h3>
    </div>
  );
}