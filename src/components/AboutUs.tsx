import { motion } from 'framer-motion';

export default function AboutUs() {
  return (
    <section className="py-24 bg-gray-900 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex-1"
        >
          <h2 className="text-4xl font-bold text-fuchsia-500 mb-6 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">
            Respaldo y Experiencia
          </h2>
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            En SIS SAS, nos encargamos del trabajo pesado para que tú te enfoques en hacer crecer tu negocio. Contamos con un equipo de 5 profesionales altamente capacitados, listos para gestionar cada detalle normativo.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            Estructuramos tu sistema desde cero y nos encargamos de la elaboración de documentos, procedimientos, listas de chequeo y todo lo necesario para garantizar entornos seguros y el cumplimiento de la ley.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex-1 w-full"
        >
          {/* Aquí puedes reemplazar el div por una etiqueta <img> con una foto real de una auditoría o tu equipo */}
          <div className="w-full h-80 bg-gray-800 rounded-2xl border border-fuchsia-500/50 shadow-[0_0_25px_rgba(217,70,239,0.3)] flex items-center justify-center">
            <span className="text-fuchsia-400 font-semibold">[Imagen representativa SST]</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}