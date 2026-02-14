import { motion } from 'framer-motion';

export default function Services() {
  // Lista de servicios (Tareas que cubre el modelo de negocio)
  const servicesList = [
    {
      title: "Diseño e Implementación",
      description: "Estructuramos el Sistema de Gestión (SG-SST) desde cero, asegurando el cumplimiento de la normativa legal vigente para tu empresa.",
      colorTheme: "cyan"
    },
    {
      title: "Gestión Documental",
      description: "Elaboramos de manera organizada todos los documentos, procedimientos, manuales y listas de chequeo que tu operación necesita.",
      colorTheme: "fuchsia"
    },
    {
      title: "Asesoría Continua",
      description: "Acompañamiento integral con nuestro equipo de profesionales para auditorías, capacitaciones y gestión de riesgos en el trabajo.",
      colorTheme: "cyan"
    }
  ];

  // Variantes para la animación en cascada de Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3 // Tiempo de espera entre cada tarjeta
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6 } 
    }
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-500 px-6">
      <div className="max-w-6xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
            Nuestros <span className="text-blue-600 dark:text-cyan-400 transition-colors duration-500 dark:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">Servicios</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto transition-colors duration-500">
            Soluciones prácticas y a la medida para proteger a tu equipo y garantizar la tranquilidad legal de tu empresa.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {servicesList.map((service, index) => {
            // Validamos el tema de la tarjeta
            const isCyan = service.colorTheme === 'cyan';
            
            // Clases base estructurales
            const baseCardClasses = "bg-white dark:bg-gray-900 p-8 rounded-2xl flex flex-col h-full transition-all duration-300 border";
            
            // Lógica para aplicar bordes y sombras dependiendo del tema claro/oscuro y el color elegido
            const colorClasses = isCyan 
              ? "border-gray-200 dark:border-cyan-500/50 shadow-lg hover:shadow-xl dark:shadow-[0_0_20px_rgba(6,182,212,0.15)] dark:hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:border-blue-400 dark:hover:border-cyan-400"
              : "border-gray-200 dark:border-fuchsia-500/50 shadow-lg hover:shadow-xl dark:shadow-[0_0_20px_rgba(217,70,239,0.15)] dark:hover:shadow-[0_0_25px_rgba(217,70,239,0.4)] hover:border-purple-400 dark:hover:border-fuchsia-400";
            
            const titleColorClasses = isCyan 
              ? "text-blue-600 dark:text-cyan-400" 
              : "text-purple-600 dark:text-fuchsia-400";

            return (
              <motion.div 
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                className={`${baseCardClasses} ${colorClasses}`}
              >
                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-500 ${titleColorClasses}`}>
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow transition-colors duration-500">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}