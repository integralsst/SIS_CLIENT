import { Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react';
import Logo from '../assets/logosis.webp'; 

const Footer = () => {
  return (
    <footer className="bg-[#05080a] border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-16">
        
        {/* Branding */}
        <div className="space-y-4 col-span-1 sm:col-span-2 md:col-span-1">
          <div className="flex items-center">
             <img src={Logo} alt="Logo SIS" className="h-8 w-auto object-contain rounded-sm grayscale hover:grayscale-0 transition-all duration-300" />
          </div>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xs font-medium">
            Transformando la seguridad y salud en el trabajo con tecnología de vanguardia y cumplimiento legal garantizado.
          </p>
        </div>

        {/* Plataforma (Reemplaza a Servicios) */}
        <div>
          <h4 className="text-slate-200 text-sm font-semibold mb-4 tracking-tight">Plataforma</h4>
          <ul className="space-y-3 text-xs font-medium text-slate-500">
            <li><a href="#comparativa" className="hover:text-cyan-400 transition-colors">Comparativa</a></li>
            <li><a href="#dashboard" className="hover:text-cyan-400 transition-colors">Simulador SG-SST</a></li>
            <li><a href="#modulos" className="hover:text-cyan-400 transition-colors">Módulos Técnicos</a></li>
            <li><a href="#faq" className="hover:text-cyan-400 transition-colors">Preguntas Frecuentes</a></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-slate-200 text-sm font-semibold mb-4 tracking-tight">Contacto</h4>
          <ul className="space-y-3 text-xs font-medium text-slate-500">
            <li className="flex items-center gap-2 hover:text-slate-300 transition-colors"><Mail size={14} /> contacto@sis.com</li>
            <li className="flex items-center gap-2 hover:text-slate-300 transition-colors"><Phone size={14} /> +57 300 000 0000</li>
            <li className="flex items-center gap-2 hover:text-slate-300 transition-colors"><MapPin size={14} /> Manizales, Colombia</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-slate-200 text-sm font-semibold mb-4 tracking-tight">Síguenos</h4>
          <div className="flex gap-5">
            <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors transform hover:scale-110">
              <Linkedin size={18} />
            </a>
            <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors transform hover:scale-110">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-medium text-slate-600">
        <p>© 2026 SIS. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-cyan-400 transition-colors">Política de Privacidad</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Términos de Servicio</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;