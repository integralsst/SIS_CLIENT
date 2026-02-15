import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes Globales (Se ven en todas las páginas)
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';
import Footer from './components/Footer';

// Páginas (Las vistas que cambian)
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      {/* Contenedor principal con flexbox para empujar el Footer al fondo */}
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 transition-colors duration-500 font-sans">
        
        {/* Barra de navegación siempre arriba */}
        <Navbar />
        
        {/* Botón flotante para modo oscuro */}
        <ThemeToggle />

        {/* Contenido dinámico (Aquí React Router inyecta la página correspondiente) */}
        {/* pt-20 evita que el contenido quede oculto bajo la Navbar */}
        <main className="flex-grow pt-20">
          <Routes>
            {/* Ruta principal: Cuando el usuario entra a tu dominio, carga Home */}
            <Route path="/" element={<Home />} />
            
            {/* Aquí a futuro puedes agregar más rutas, por ejemplo: */}
            {/* <Route path="/servicios-detalle" element={<ServicesDetail />} /> */}
          </Routes>
        </main>

        {/* Pie de página siempre abajo */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}