import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// --- COMPONENTES GLOBALES ---
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/admin/DashboardLayout';

// --- PÁGINAS PÚBLICAS ---
import LandingPage from './pages/public/Home';
import LoginPage from './pages/public/LoginPage';
import DiagnosticoPage from './pages/public/DiagnosticoPage'; // <-- Importamos la nueva página

// --- PÁGINAS ADMINISTRATIVAS (SaaS) ---
import Dashboard from './pages/admin/Dashboard';
import Companies from './pages/admin/Companies';
import Users from './pages/admin/Users';

function AppContent() {
  const { user, loading } = useAuth();

  // Evitamos parpadeos mientras el contexto recupera la sesión
  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#05080a] text-slate-200 font-sans selection:bg-cyan-500/30">
      
      <Routes>
        {/* ==========================================
            RUTAS PÚBLICAS (Con Navbar y Footer)
            ========================================== */}
        <Route 
          path="/" 
          element={
            <>
              <Navbar />
              <main className="flex-grow">
                <LandingPage />
              </main>
              <Footer />
            </>
          } 
        />
        
        {/* ==========================================
            RUTAS PÚBLICAS AISLADAS (Sin Layout Global)
            ========================================== */}
        {/* Si el usuario ya está logueado, lo mandamos directo al dashboard */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />

        {/* Squeeze Page dedicada para campañas publicitarias */}
        <Route 
          path="/diagnostico" 
          element={<DiagnosticoPage />} 
        />

        {/* ==========================================
            RUTAS PRIVADAS (Panel Administrativo SaaS)
            ========================================== */}
        <Route 
          path="/dashboard" 
          element={user ? <DashboardLayout /> : <Navigate to="/login" replace />}
        >
          {/* El 'index' carga el Dashboard inicial al entrar a /dashboard */}
          <Route index element={<Dashboard />} />
          
          {/* Vistas anidadas dentro del Layout lateral */}
          <Route path="empresas" element={<Companies />} />
          <Route path="usuarios" element={<Users />} />
        </Route>

        {/* ==========================================
            CATCH-ALL (Redirección de rutas no encontradas)
            ========================================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
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