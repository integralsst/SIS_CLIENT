import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Comparison from '../components/Comparison';

export default function LandingPage() {
  return (
    <div className="relative">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* gap-4 en móvil, gap-8 en desktop. Mucho más pegados que antes */}
      <main className="flex flex-col gap-4 md:gap-8 pt-4 pb-12">
        
        <Hero />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Comparison />
        </motion.div>
        
        {/* CTA: Menos padding superior, tipografía más comprimida */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="pt-12 pb-20 px-6 text-center relative overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-[120px] -z-10 pointer-events-none" />
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-[1.1]">
            El estándar de seguridad. <br className="hidden md:block" />
            <span className="text-slate-400">Automatizado hoy.</span>
          </h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm md:text-base font-medium">
            Únete a las empresas que ya simplificaron su SST.
          </p>
          <button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm md:text-base hover:bg-slate-200 transition-all hover:scale-[1.02] active:scale-95">
            Hablar con un experto
          </button>
        </motion.section>

      </main>
    </div>
  );
}