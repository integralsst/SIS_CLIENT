import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Comparison from '../components/Comparison';

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Fondo con grid sutil y ruido premium */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* NOTA: Ya no están aquí ni el Navbar ni el Footer. 
        App.tsx se encarga de mostrarlos.
      */}

      {/* Usamos flex y gap más pequeños para acercar los componentes */}
      <main className="flex flex-col gap-12 md:gap-16 pt-8 pb-16">
        
        <Hero />
        
        {/* Envolvemos Comparison en motion para que aparezca al hacer scroll */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Comparison />
        </motion.div>
        
        {/* CTA de cierre animado */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="py-12 px-6 text-center relative overflow-hidden"
        >
          {/* Brillo de fondo para el CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-[100px] -z-10" />
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            ¿Listo para blindar <br className="hidden md:block" /> la seguridad de tu empresa?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
            Únete a las empresas que ya automatizaron su gestión SST con estándares de 2026.
          </p>
          <button className="px-10 py-4 rounded-full bg-white text-black font-extrabold hover:bg-cyan-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl">
            Hablar con un consultor ahora
          </button>
        </motion.section>

      </main>
    </div>
  );
}