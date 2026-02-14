import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-950 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
          <span className="text-cyan-400">SIS SAS</span> <br /> Tu Aliado en SST
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Consultoría y asesoría experta en el diseño e implementación del Sistema de Gestión de la Seguridad y Salud en el Trabajo.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgb(6, 182, 212)" }}
          whileTap={{ scale: 0.95 }}
          className="bg-cyan-500 text-gray-950 font-bold px-10 py-4 rounded-full text-lg uppercase tracking-wide transition-all"
        >
          Solicitar Asesoría
        </motion.button>
      </motion.div>
    </section>
  );
}