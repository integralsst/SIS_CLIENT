import { motion } from 'framer-motion';

export default function Contact() {
  // Clase base para reutilizar en todos los inputs y el textarea, manteniendo el código limpio
  const inputClasses = "w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg p-4 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-cyan-400 transition-colors duration-300 placeholder-gray-500 dark:placeholder-gray-400";

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-500 px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-blue-600 dark:text-cyan-400 mb-4 transition-colors duration-500 dark:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
            Hablemos de tu Empresa
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors duration-500">
            Déjanos tus datos y un asesor se comunicará contigo a la brevedad.
          </p>
        </div>

        <form className="flex flex-col gap-6 bg-white dark:bg-gray-900 p-8 md:p-10 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-2xl transition-colors duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Nombre completo"
              className={inputClasses}
            />
            <input
              type="text"
              placeholder="Nombre de la empresa"
              className={inputClasses}
            />
          </div>
          <input
            type="email"
            placeholder="Correo electrónico"
            className={inputClasses}
          />
          <textarea
            rows={4}
            placeholder="¿Qué requerimientos en SST tienes actualmente?"
            className={`${inputClasses} resize-none`}
          ></textarea>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            // Sombras y colores adaptables mediante Tailwind
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-gray-950 font-bold py-4 rounded-lg text-lg uppercase tracking-wide transition-all duration-300 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] dark:hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]"
          >
            Enviar Mensaje
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}