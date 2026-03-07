import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Componentes Globales
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // No mostramos Navbar/Footer en el Login ni en el Dashboard para mantener la limpieza visual
  const isAuthPage = location.pathname === '/login';
  const isDashboard = location.pathname === '/dashboard';
  const hideLayout = isAuthPage || isDashboard;

  // Evitamos parpadeos mientras el contexto recupera la sesión del localStorage
  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#05080a] text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {!hideLayout && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Si el usuario ya está logueado y va a /login, lo mandamos al dashboard */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <LoginPage />} 
          />

          {/* RUTA PROTEGIDA: Solo entra si existe un usuario */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          
          {/* Redirección por defecto si la ruta no existe */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
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