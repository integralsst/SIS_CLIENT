// 1. Quitamos las llaves de los imports para que coincidan con el 'export default'
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Comparison from '../components/Comparison';
import Footer from '../components/Footer'; // Importamos el nuevo Footer modular

export default function LandingPage() {
  return (
    <div className="min-h-screen relative bg-[#05080a]">
      {/* Fondo con grid sutil y ruido premium */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Navbar arriba de todo */}
      <Navbar />

      <main>
        {/* Secciones principales */}
        <Hero />
        
        <div className="space-y-24 md:space-y-32">
          <Comparison />
          
          {/* CTA de cierre antes del footer */}
          <section className="py-24 px-6 text-center relative overflow-hidden">
            {/* Brillo de fondo para el CTA */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-[100px] -z-10" />
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              ¿Listo para blindar <br className="hidden md:block" /> la seguridad de tu empresa?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
              Únete a las empresas en Pereira que ya automatizaron su gestión SST con estándares de 2026.
            </p>
            <button className="px-10 py-4 rounded-full bg-white text-black font-extrabold hover:bg-cyan-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl">
              Hablar con un consultor ahora
            </button>
          </section>
        </div>
      </main>
      
      {/* Usamos el componente Footer que ya tiene toda la estructura robusta */}
      <Footer />
    </div>
  );
}