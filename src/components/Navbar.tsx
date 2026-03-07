import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Importamos el hook

import Logo from '../assets/logosis.webp'; 

const navLinks = [
  { name: 'Beneficios', href: '#features' },
  { name: 'Cómo funciona', href: '#how' },
  { name: 'Precios', href: '#pricing' },
];

const Navbar = () => {
  const { user, logout } = useAuth(); // Obtenemos el usuario y la función de salir
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(currentScrollY > 20);
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false); 
          } else {
            setIsVisible(true);  
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
          
          {/* Logo */}
          <Link to="/" className="relative group z-50 flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src={Logo} 
                alt="Logo" 
                className="relative h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 rounded-md" 
              />
            </div>
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

          {/* --- CAMBIO: Botón o Info de Usuario en Desktop --- */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 bg-white/5 pl-4 pr-1.5 py-1.5 rounded-full border border-white/10">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold leading-none">Hola,</span>
                  <span className="text-sm font-bold text-white leading-tight">{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                  title="Cerrar Sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 border border-white/10"
              >
                Iniciar Sesión
              </Link>
            )}
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

      {/* PANEL MÓVIL DESLIZABLE */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        
        <div className={`absolute top-0 right-0 w-[300px] h-full bg-[#0a0a0a]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <User size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Bienvenido</span>
                  <span className="text-sm font-bold text-white truncate max-w-[120px]">{user.name}</span>
                </div>
              </div>
            ) : (
              <img src={Logo} alt="Logo" className="h-8 w-auto object-contain rounded-sm" />
            )}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>

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

          {/* --- CAMBIO: Botón Móvil Dinámico --- */}
          <div className="p-6 border-t border-white/10">
            {user ? (
              <button 
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-3 w-full rounded-xl py-4 bg-red-500/10 text-red-400 font-bold border border-red-500/20 active:scale-95 transition-all"
              >
                <LogOut size={18} />
                Cerrar Sesión
              </button>
            ) : (
              <Link 
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full rounded-xl py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-900/20 border border-white/10"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;