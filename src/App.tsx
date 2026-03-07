import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Componentes Globales
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage'; // Importamos la nueva página

// Creamos un componente envoltorio interno para poder usar el hook useLocation
function AppContent() {
  const location = useLocation();
  
  // Condición: Si la ruta actual es "/login", no mostramos Navbar ni Footer
  const isAuthPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-[#05080a] text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {!isAuthPage && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}