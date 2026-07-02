import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

// --- COMPONENTES GLOBALES ---
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import DashboardLayout from '../components/layouts/DashboardLayout';

// --- PÁGINAS PÚBLICAS ---
import LandingPage from '../features/landing/pages/Home';
import LoginPage from '../features/auth/pages/LoginPage';
import DiagnosticoPage from '../features/landing/pages/DiagnosticoPage'

// --- PÁGINAS ADMINISTRATIVAS (SaaS) ---
import Dashboard from '../features/dashboard/pages/Dashboard';
import Companies from '../features/companies/pages/Companies';
import Users from '../features/users/pages/Users';

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