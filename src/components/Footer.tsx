import { Shield, Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#05080a] border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Branding */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="text-cyan-500" size={24} />
            <span className="font-bold text-xl text-white">SIS<span className="text-cyan-500">.</span></span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Transformando la seguridad y salud en el trabajo con tecnología de vanguardia y cumplimiento legal garantizado.
          </p>
        </div>

        {/* Servicios */}
        <div>
          <h4 className="text-white font-bold mb-6">Servicios</h4>
          <ul className="space-y-3 text-sm text-slate-500">
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Auditorías SST</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Gestión de Riesgos</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Capacitaciones</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Software de Seguimiento</li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-white font-bold mb-6">Contacto</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li className="flex items-center gap-3"><Mail size={16} /> contacto@sis.com</li>
            <li className="flex items-center gap-3"><Phone size={16} /> +57 300 000 0000</li>
            <li className="flex items-center gap-3"><MapPin size={16} /> Pereira, Colombia</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-white font-bold mb-6">Síguenos</h4>
          <div className="flex gap-4">
            <div className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer">
              <Linkedin size={20} />
            </div>
            <div className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer">
              <Instagram size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center text-slate-600 text-xs">
        <p>© 2026 SIS. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;