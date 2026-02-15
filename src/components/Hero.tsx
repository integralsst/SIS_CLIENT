import { motion } from 'framer-motion';
// Asegúrate de que esta ruta coincida con tu logo real
import logoSis from '../assets/logosis.png'; 

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 transition-colors duration-500">
      
      {/* Contenedor principal: Flexbox para dividir en dos columnas */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12"
      >
        
        {/* COLUMNA IZQUIERDA: Logo */}
        <motion.div 
          className="w-full md:w-1/2 flex justify-center md:justify-end"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img 
            src={logoSis} 
            alt="Logo SIS SAS" 
            // Ajusta el tamaño aquí (max-w-md lo hace bastante grande, ideal para el Hero)
            className="w-64 md:w-full max-w-md drop-shadow-2xl dark:drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]" 
          />
        </motion.div>

        {/* COLUMNA DERECHA: Texto y Botón */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 transition-colors duration-500 dark:drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] leading-tight">
            <span className="text-blue-600 dark:text-cyan-400">SIS SAS</span> <br /> 
            <span className="text-3xl md:text-5xl">Tu Aliado en Seguridad y Salud en el Trabajo</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 transition-colors duration-500">
            Consultoría y asesoría en el diseño, implementación y mantenimiento del Sistema de Gestión de la Seguridad y Salud en el Trabajo.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-gray-950 font-bold px-10 py-4 rounded-full text-lg uppercase tracking-wide transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
          >
            Solicitar Asesoría
          </motion.button>
        </div>

      </motion.div>
    </section>
  );
}