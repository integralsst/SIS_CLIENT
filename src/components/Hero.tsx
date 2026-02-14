import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 text-center transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 transition-colors duration-500 dark:drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
          <span className="text-blue-600 dark:text-cyan-400">SIS SAS</span> <br /> 
          Tu Aliado en SST
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto transition-colors duration-500">
          Consultoría y asesoría experta en el diseño e implementación del Sistema de Gestión de la Seguridad y Salud en el Trabajo.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          // Combinamos Tailwind para los colores/sombras en dark mode y Framer Motion para la escala
          className="bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-gray-950 font-bold px-10 py-4 rounded-full text-lg uppercase tracking-wide transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
        >
          Solicitar Asesoría
        </motion.button>
      </motion.div>
    </section>
  );
}