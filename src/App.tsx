import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes Globales
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <BrowserRouter>
      {/* Mantenemos el fondo fijo en #05080a para que toda la app 
        tenga la estética oscura de SIS por defecto.
      */}
      <div className="min-h-screen flex flex-col bg-[#05080a] text-slate-200 font-sans selection:bg-cyan-500/30">
        
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}