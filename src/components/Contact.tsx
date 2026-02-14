import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section className="py-24 bg-gray-950 px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-cyan-400 mb-4 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
            Hablemos de tu Empresa
          </h2>
          <p className="text-gray-400 text-lg">Déjanos tus datos y un asesor se comunicará contigo a la brevedad.</p>
        </div>

        <form className="flex flex-col gap-6 bg-gray-900 p-8 md:p-10 rounded-2xl border border-gray-800 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Nombre completo"
              className="w-full bg-gray-950 text-white border border-gray-700 rounded-lg p-4 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
            <input
              type="text"
              placeholder="Nombre de la empresa"
              className="w-full bg-gray-950 text-white border border-gray-700 rounded-lg p-4 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full bg-gray-950 text-white border border-gray-700 rounded-lg p-4 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
          />
          <textarea
            rows={4}
            placeholder="¿Qué requerimientos en SST tienes actualmente?"
            className="w-full bg-gray-950 text-white border border-gray-700 rounded-lg p-4 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors resize-none"
          ></textarea>
          
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0px 0px 15px rgb(6, 182, 212)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full mt-4 bg-cyan-500 text-gray-950 font-bold py-4 rounded-lg text-lg uppercase tracking-wide transition-all"
          >
            Enviar Mensaje
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}