import ThemeToggle from './components/ThemeToggle';
import Hero from './components/Hero'; 
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Contact from './components/Contact';
// Importa el resto de tus componentes aquí...

export default function App() {
  return (
    /* Contenedor principal: Aquí se define el fondo y texto base para ambos modos */
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 transition-colors duration-500 font-sans">
      
      {/* Botón flotante siempre visible */}
      <ThemeToggle />

      {/* Aquí van tus componentes que viste en la imagen */}
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <AboutUs /> 
        <Services />
        <Contact />
      </main>

    </div>
  );
}