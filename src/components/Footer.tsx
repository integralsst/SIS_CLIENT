export default function Footer() {
  // Obtenemos el año actual automáticamente
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-200 dark:bg-gray-950 py-12 px-6 border-t border-gray-300 dark:border-gray-800 transition-colors duration-500">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Columna 1: Marca y Descripción */}
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
            <span className="text-blue-600 dark:text-cyan-400">SIS</span> SAS
          </h3>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-500">
            Tu aliado estratégico en Seguridad y Salud en el Trabajo. Protegemos a tu equipo y garantizamos el cumplimiento normativo.
          </p>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
            Enlaces Rápidos
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="#inicio" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-300">
                Inicio
              </a>
            </li>
            <li>
              <a href="#nosotros" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-fuchsia-400 transition-colors duration-300">
                Respaldo y Experiencia
              </a>
            </li>
            <li>
              <a href="#servicios" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-300">
                Servicios SST
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 3: Contacto y Redes Sociales */}
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
            Contacto
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-500">
            contacto@sissas.com <br />
            +57 (Aquí tu número)
          </p>
          
          {/* Iconos de Redes Sociales */}
          <div className="flex justify-center md:justify-start space-x-4">
            {/* LinkedIn */}
            <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-300">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="text-gray-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors duration-300">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

      </div>
      
      {/* Copyright */}
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-300 dark:border-gray-800 text-center text-gray-500 dark:text-gray-500 text-sm transition-colors duration-500">
        &copy; {currentYear} SIS SAS. Todos los derechos reservados.
      </div>
    </footer>
  );
}