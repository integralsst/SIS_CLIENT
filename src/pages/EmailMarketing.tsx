import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Users, Send, AlertCircle, CheckCircle2, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EmailMarketing() {
  const { user } = useAuth();
  const [emailList, setEmailList] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const handleProcessEmails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus(null);

    // Convertimos el texto en un arreglo de correos
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

      setStatus({ type: 'success', msg: `${emails.length} contactos cargados para labor comercial.` });
      setEmailList('');
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
        
        {/* Botón rápido de WhatsApp */}
        <a 
          href="https://wa.me/3100000000?text=Hola!%20Me%20interesa%20la%20asesoria%20SST" 
          target="_blank"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all text-sm font-bold"
        >
          <MessageCircle size={18} /> Probar Botón WhatsApp
        </a>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Leads Totales', value: '78', icon: Users, color: 'text-cyan-400' },
          { label: 'Envíos este mes', value: '12', icon: Send, color: 'text-blue-400' },
          { label: 'Interesados', value: '5', icon: CheckCircle2, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <stat.icon className={`${stat.color} mb-4`} size={24} />
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Área de Carga Masiva */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-2xl space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
              <Mail size={24} />
            </div>
            <h2 className="text-xl font-bold">Carga de Prospectos</h2>
          </div>

          <form onSubmit={handleProcessEmails} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Lista de correos (uno por línea)
              </label>
              <textarea 
                value={emailList}
                onChange={(e) => setEmailList(e.target.value)}
                placeholder="cliente1@empresa.com&#10;cliente2@empresa.com"
                className="w-full h-48 p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none text-sm"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isSending}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {isSending ? 'Procesando...' : 'Cargar Contactos para Campaña'}
            </button>
          </form>

          {status && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}>
              <AlertCircle size={18} />
              {status.msg}
            </div>
          )}
        </motion.div>

        {/* Info de Estrategia Comercial */}
        <div className="space-y-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold italic">Estrategia SST Comercial</h2>
          <ul className="space-y-4">
            {[
              "Informa sobre decretos vigentes (Ej. 1072 o Resolución 0312).",
              "Resalta las multas por incumplimiento para generar urgencia.",
              "Adjunta el link de WhatsApp para asesoría inmediata.",
              "Las respuestas llegarán a tu correo de Hostinger."
            ].map((text, i) => (
              <li key={i} className="flex gap-4 text-slate-400">
                <div className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {i + 1}
                </div>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}