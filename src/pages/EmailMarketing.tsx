import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, AlertCircle, MessageCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EmailMarketing() {
  // Eliminamos { user } para quitar la alerta de "valor no leído"
  useAuth(); 
  const [emailList, setEmailList] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isProcessingEmails, setIsProcessingEmails] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // 1. FUNCIÓN PARA CARGAR CONTACTOS A LA DB
  const handleProcessEmails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingEmails(true);
    setStatus(null);

    const emails = emailList.split(/[\n,]+/).map(e => e.trim()).filter(e => e.includes('@'));

    try {
      const response = await fetch(`${API_URL}/api/contacts/bulk`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sis_token')}`
        },
        body: JSON.stringify({ 
          contacts: emails.map(email => ({ email })) 
        }),
      });

      if (!response.ok) throw new Error('Error al cargar los contactos');

      setStatus({ type: 'success', msg: `${emails.length} contactos cargados exitosamente en la base de datos.` });
      setEmailList('');
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setIsProcessingEmails(false);
    }
  };

  // 2. FUNCIÓN PARA DISPARAR LA CAMPAÑA MASIVA (RESEND)
  const handleSendCampaign = async () => {
    if (!confirm('¿Estás seguro de enviar esta campaña a todos tus contactos?')) return;
    
    setIsSending(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_URL}/api/campaigns/send`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('sis_token')}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al enviar la campaña');

      setStatus({ type: 'success', msg: '¡Campaña comercial enviada con éxito a través de Resend!' });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Email Marketing</h1>
          <p className="text-slate-500 mt-1">Informa requisitos legales y capta nuevos clientes SST.</p>
        </div>
        
        <a 
          href="https://wa.me/3100000000?text=Hola!%20Me%20interesa%20la%20asesoria%20SST" 
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all text-sm font-bold"
        >
          <MessageCircle size={18} /> Probar Botón WhatsApp
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Tarjeta de Carga Masiva */}
          <motion.div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
                <Mail size={24} />
              </div>
              <h2 className="text-xl font-bold">Carga de Prospectos</h2>
            </div>

            <form onSubmit={handleProcessEmails} className="space-y-4">
              <textarea 
                value={emailList}
                onChange={(e) => setEmailList(e.target.value)}
                placeholder="ejemplo@empresa.com"
                className="w-full h-40 p-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none text-sm"
                required
              />
              <button 
                type="submit"
                disabled={isProcessingEmails}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                {isProcessingEmails ? <Loader2 className="animate-spin" size={20} /> : 'Cargar Contactos'}
              </button>
            </form>
          </motion.div>

          {/* Tarjeta de Disparo */}
          <motion.div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-[#0a0a0a] border border-cyan-500/20 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Send className="text-cyan-400" size={20} /> Acción de Envío
            </h2>
            <button 
              onClick={handleSendCampaign}
              disabled={isSending || isProcessingEmails}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black transition-all flex items-center justify-center gap-2"
            >
              {isSending ? <Loader2 className="animate-spin" size={20} /> : 'DISPARAR CAMPAÑA AHORA'}
            </button>
          </motion.div>

          {status && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
              status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              <AlertCircle size={18} />
              {status.msg}
            </div>
          )}
        </div>

        <div className="space-y-6 flex flex-col justify-center lg:pl-8 text-slate-400">
           <h2 className="text-2xl font-bold italic text-white">Estrategia SST Comercial</h2>
           <p className="text-sm leading-relaxed">Las respuestas comerciales llegarán a contacto@sisriesgoslaborales.com.</p>
        </div>
      </div>
    </div>
  );
}