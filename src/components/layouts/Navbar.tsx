import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import Logo from '../../assets/logosis.webp'; 

const navLinks = [
  { name: 'Comparativa', href: '#comparativa' },
  { name: 'Simulador', href: '#dashboard' },
  { name: 'Módulos', href: '#modulos' },
  { name: 'FAQ', href: '#faq' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Modificamos el estado inicial de visibilidad para que no salte
  const [isVisible, setIsVisible] = useState(false); 
  const [isInSplash, setIsInSplash] = useState(true); 
  
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll lock agresivo para iOS y prevención de reflow
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Evita el elastic scroll en iOS Safari
      document.body.style.touchAction = 'none'; 
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileMenuOpen]);

  // Lógica de Scroll Corregida
  useEffect(() => {
    // Verificación inicial 
    if (window.scrollY > 50) {
      setIsInSplash(false);
    }

    let ticking = false;
    const handleScroll = () => {
      if (isMobileMenuOpen) return;

      const currentScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(currentScrollY > 20);
          
          if (currentScrollY < 50) {
            // Zona cero: Aseguramos que esté en modo splash y preparamos isVisible en false
            setIsInSplash(true);
            setIsVisible(false);
          } else {
            // Fuera de la zona cero
            setIsInSplash(false);
            
            if (currentScrollY > lastScrollY) {
              // Si baja, lo ocultamos
              setIsVisible(false);
            } else if (currentScrollY < lastScrollY) {
              // Si sube, lo mostramos
              setIsVisible(true);
            }
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileMenuOpen]);

  const shouldShowNavbar = isMobileMenuOpen || (!isInSplash && isVisible);

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 transition-transform duration-300 ease-in-out will-change-transform ${
          shouldShowNavbar ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div 
          className={`absolute inset-0 transition-all duration-300 ${
            isScrolled ? 'bg-[#05080a]' : 'bg-transparent'
          }`}
        />

        <div className={`relative max-w-7xl mx-auto px-6 transition-all duration-300 flex items-center justify-between ${
          isScrolled ? 'h-16' : 'h-24 md:h-28'
        }`}>
          
          <Link to="/" className="flex items-center group">
            <img 
              src={Logo} 
              alt="Logo SIS" 
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[13px] font-semibold text-slate-400 hover:text-white transition-colors tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 pl-5 pr-1.5 py-1.5 bg-white-[0.02] rounded-full border border-white/5 hover:border-white/10 transition-all">
                <Link to="/dashboard" className="text-xs font-bold text-slate-300 hover:text-cyan-400 transition-colors">
                  Dashboard
                </Link>
                <div className="w-px h-4 bg-white/10"></div>
                <div className="w-7 h-7 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-xs font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
                <button onClick={logout} className="p-1.5 rounded-full text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all group" title="Cerrar Sesión">
                  <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                Iniciar Sesión
              </Link>
            )}
          </div>

          <div className="md:hidden relative z-50">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -mr-2 text-slate-300 hover:text-white transition-colors"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* MENÚ MÓVIL FULLSCREEN */}
      <div 
        className={`fixed inset-0 z-[9999] bg-[#05080a] flex flex-col md:hidden transition-all duration-300 ease-out will-change-transform ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-8">
          <img src={Logo} alt="Logo SIS" className="h-8 w-auto object-contain opacity-80" />
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors active:scale-95"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-col px-8 py-4 gap-6 mt-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-4xl font-semibold text-slate-300 hover:text-white tracking-tighter transition-colors flex items-center justify-between group"
            >
              {link.name}
              <ChevronRight className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" strokeWidth={2} />
            </a>
          ))}
        </div>

        <div className="flex-grow" />

        <div className="p-6 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
            {user ? (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-lg font-bold border border-cyan-500/20">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-semibold text-white tracking-tight truncate max-w-[200px]">
                      {user.name}
                    </span>
                    <span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">
                      Sesión Activa
                    </span>
                  </div>
                </div>
                
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 rounded-2xl bg-cyan-400 text-slate-950 font-semibold text-center transition-transform active:scale-95 text-lg"
                >
                  Ir al Dashboard
                </Link>

                <button 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="w-full py-4 rounded-2xl bg-white/5 text-slate-300 font-medium hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={18} /> Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-slate-400 text-sm text-center mb-1">
                  Accede a tu plataforma de gestión SG-SST
                </p>
                <Link 
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-4 rounded-2xl bg-cyan-400 text-slate-950 font-semibold text-lg text-center transition-transform active:scale-95 shadow-none"
                >
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;