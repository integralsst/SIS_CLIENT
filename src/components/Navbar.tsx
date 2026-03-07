import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, Shield } from 'lucide-react';
import Logo from '../assets/logosis.jpg'; 

const navLinks = [
  { name: 'Beneficios', href: '#features' },
  { name: 'Cómo funciona', href: '#how' },
  { name: 'Precios', href: '#pricing' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Lógica exacta de scroll optimizado ---
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(currentScrollY > 20);
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false); // Oculta al hacer scroll hacia abajo
          } else {
            setIsVisible(true);  // Muestra al hacer scroll hacia arriba
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const textColorClass = isScrolled 
    ? "text-slate-300 hover:text-cyan-400" 
    : "text-slate-200 hover:text-white";

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ease-in-out border-b ${
          isScrolled
            ? 'bg-[#05080a]/80 backdrop-blur-xl border-white/10 shadow-lg shadow-black/20'
            : 'bg-transparent border-transparent py-4'
        } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          
          {/* Branding / Logo */}
          <Link to="/" className="relative group z-50 flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
                  <img src={Logo} alt="Logo" className="relative h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105" /> 
             
              <div className="relative h-10 w-10 bg-cyan-500/10 rounded-xl border border-cyan-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                 <Shield className="text-cyan-500" size={20} />
              </div>
            </div>
            <span className="font-bold text-xl md:text-2xl tracking-tight block text-white transition-colors">
              SIS<span className="text-cyan-500">.</span>
            </span>
          </Link>

          {/* Navegación Desktop */}
          <nav className={`hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full border transition-all ${
            isScrolled ? "bg-white/5 border-white/5" : "border-transparent"
          }`}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-full hover:bg-white/10 ${textColorClass}`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Botón Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button className="px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 border border-white/10">
              Iniciar Sesión
            </button>
          </div>

          {/* Menú Móvil (Botón Hamburguesa) */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-full text-slate-200 hover:bg-white/10 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* --- PANEL MÓVIL DESLIZABLE (Nativo sin librerías pesadas) --- */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Fondo oscuro con blur */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)} 
        />
        
        {/* Menú lateral */}
        <div className={`absolute top-0 right-0 w-[300px] h-full bg-[#0a0a0a]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {/* Header Menú Móvil */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <span className="font-bold text-xl text-white">SIS.</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Links Móvil */}
          <div className="flex flex-col p-6 gap-2 flex-grow">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex items-center justify-between p-4 rounded-2xl text-lg font-medium text-slate-300 hover:bg-white/5 hover:text-cyan-400 transition-all border border-transparent hover:border-white/5"
              >
                {link.name}
                <ChevronRight className="h-4 w-4 opacity-30 group-hover:opacity-100 transition-all" />
              </a>
            ))}
          </div>

          {/* Footer Menú Móvil */}
          <div className="p-6 border-t border-white/10">
             <button className="w-full rounded-xl py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-900/20 border border-white/10">
                Iniciar Sesión
             </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;