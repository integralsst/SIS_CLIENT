import { motion } from 'framer-motion';

export default function AboutUs() {
  return (
    // Agregamos bg-white para modo claro y dark:bg-gray-900 para oscuro
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-500 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex-1"
        >
          {/* Título adaptable: púrpura en claro, fucsia brillante en oscuro */}
          <h2 className="text-4xl font-bold text-purple-600 dark:text-fuchsia-500 mb-6 transition-colors duration-500 dark:drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">
            Respaldo y Experiencia
          </h2>
          {/* Párrafos adaptables para asegurar legibilidad */}
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed transition-colors duration-500">
            En SIS SAS, nos encargamos del trabajo pesado para que tú te enfoques en hacer crecer tu negocio. Contamos con un equipo de 5 profesionales altamente capacitados, listos para gestionar cada detalle normativo.
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed transition-colors duration-500">
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
          {/* Contenedor de imagen adaptable: sombra clásica de día, sombra neón de noche */}
          <div className="w-full h-80 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-fuchsia-500/50 shadow-lg dark:shadow-[0_0_25px_rgba(217,70,239,0.3)] flex items-center justify-center transition-all duration-500">
            <span className="text-purple-500 dark:text-fuchsia-400 font-semibold transition-colors duration-500">
              [Imagen representativa SST]
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}