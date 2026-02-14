import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';
import Hero from './components/Hero'; 
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    /* Contenedor principal: Aquí se define el fondo y texto base para ambos modos */
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 transition-colors duration-500 font-sans">
      
      {/* Barra de Navegación superior fija */}
      <Navbar />

      {/* Botón flotante para cambiar el tema siempre visible */}
      <ThemeToggle />

      {/* Contenido principal con padding-top para compensar la altura de la Navbar fija */}
      <main className="container mx-auto px-4 pt-24 pb-8">
        
        {/* Secciones con sus respectivos IDs para la navegación */}
        <div id="inicio">
          <Hero />
        </div>
        
        <div id="nosotros">
          <AboutUs /> 
        </div>

        <div id="servicios">
          <Services />
        </div>
        
        <div id="contacto">
          <Contact />
        </div>

        <div id="footer">
          <Footer />
        </div>
        
      </main>

    </div>
  );
}