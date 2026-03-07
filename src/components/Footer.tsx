import { Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react';

// Importamos el logo exactamente igual que en el Navbar
import Logo from '../assets/logo.png'; 

const Footer = () => {
  return (
    <footer className="bg-[#05080a] border-t border-white/5 pt-16 pb-8 px-6 mt-12 md:mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-16">
        
        {/* Branding */}
        <div className="space-y-4 col-span-1 sm:col-span-2 md:col-span-1">
          <div className="flex items-center">
             {/* Renderizamos solo el logo, limpio y elegante */}
             <img src={Logo} alt="Logo SIS" className="h-8 w-auto object-contain rounded-sm grayscale hover:grayscale-0 transition-all duration-300" />
          </div>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xs font-medium">
            Transformando la seguridad y salud en el trabajo con tecnología de vanguardia y cumplimiento legal garantizado.
          </p>
        </div>

        {/* Servicios */}
        <div>
          <h4 className="text-slate-200 text-sm font-semibold mb-4 tracking-tight">Servicios</h4>
          <ul className="space-y-3 text-xs font-medium text-slate-500">
            <li><a href="#" className="hover:text-white transition-colors">Auditorías SST</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Gestión de Riesgos</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Capacitaciones</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Software de Seguimiento</a></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-slate-200 text-sm font-semibold mb-4 tracking-tight">Contacto</h4>
          <ul className="space-y-3 text-xs font-medium text-slate-500">
            <li className="flex items-center gap-2"><Mail size={14} /> contacto@sis.com</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +57 300 000 0000</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Pereira, Colombia</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-slate-200 text-sm font-semibold mb-4 tracking-tight">Síguenos</h4>
          <div className="flex gap-5">
            {/* Quitamos los fondos redondos para un look más "flat" y moderno */}
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <Linkedin size={18} />
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Al estilo Apple, con enlaces legales extra y tipografía muy sutil */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-medium text-slate-600">
        <p>© 2026 SIS. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-400 transition-colors">Política de Privacidad</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Términos de Servicio</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;