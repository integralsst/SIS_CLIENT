import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 1. Aquí importamos tu logo desde la carpeta assets
import logoSis from '../assets/logosis.png'; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Lista de enlaces de navegación
  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    // Contenedor principal con efecto glassmorphism (difuminado) y fijado arriba
    <nav className="fixed w-full z-40 top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* 2. Sección del Logo Modificada */}
          <div className="flex-shrink-0">
            <a href="#inicio" className="flex items-center gap-3 transition-transform duration-300 hover:scale-105">
              {/* Esta es la imagen de tu logo. Ajusta "h-12" si lo quieres más grande o más pequeño */}
              <img src={logoSis} alt="Logo SIS SAS" className="h-12 w-auto" />
              
              {/* Mantenemos el texto al lado, pero se ocultará en celulares muy pequeños (hidden sm:block) para que no choque con el menú */}
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white transition-colors duration-500 hidden sm:block">
                <span className="text-blue-600 dark:text-cyan-400 dark:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">SIS</span> SAS
              </span>
            </a>
          </div>

          {/* Menú para Escritorio (Oculto en móviles) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  whileHover={{ y: -2 }}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Botón de Menú para Móviles */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-300"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? (
                // Icono "X" para cerrar
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Icono "Hamburguesa" para abrir
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable para Móviles (Animado) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)} // Cierra el menú al hacer clic
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}