import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  useAuth,
  type UserRole,
} from "../features/auth/context/AuthContext";

// ======================================================
// COMPONENTES GLOBALES
// ======================================================

import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";
import DashboardLayout from "../components/layouts/DashboardLayout";

// ======================================================
// PÁGINAS PÚBLICAS
// ======================================================

import LandingPage from "../features/landing/pages/Home";
import LoginPage from "../features/auth/pages/LoginPage";
import DiagnosticoPage from "../features/landing/pages/DiagnosticoPage";

// ======================================================
// PÁGINAS DEL PANEL
// ======================================================

import Dashboard from "../features/dashboard/pages/Dashboard";
import Companies from "../features/companies/pages/Companies";
import Users from "../features/users/pages/Users";
import Professionals from "../features/profesionals/pages/Professionals";

// ======================================================
// MÓDULO SG-SST
// ======================================================

import SgsstDashboard from "../features/sgsst/pages/SgsstDashboard";
import CompanySgsstConfiguration from "../features/sgsst/pages/CompanySgsstConfiguration";
import Evaluations from "../features/sgsst/pages/Evaluations";
import EvaluationMatrix from "../features/sgsst/pages/EvaluationMatrix";
import ActionPlans from "../features/sgsst/pages/ActionPlans";

// ======================================================
// PERMISOS
// ======================================================

const INTERNAL_ROLES: UserRole[] = [
  "ADMIN",
  "OWNER",
  "SUPERADMIN",
];

const USER_MANAGEMENT_ROLES: UserRole[] = [
  "CLIENT_ADMIN",
  "ADMIN",
  "OWNER",
  "SUPERADMIN",
];

const SGSST_MANAGEMENT_ROLES: UserRole[] = [
  "PROFESSIONAL",
  "ADMIN",
  "OWNER",
  "SUPERADMIN",
];

// ======================================================
// CONTENIDO PRINCIPAL
// ======================================================

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05080a]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  const canManageUsers = Boolean(
    user &&
      USER_MANAGEMENT_ROLES.includes(
        user.role
      )
  );

  const canManageProfessionals = Boolean(
    user &&
      INTERNAL_ROLES.includes(user.role)
  );

  const canManageSgsst = Boolean(
    user &&
      SGSST_MANAGEMENT_ROLES.includes(
        user.role
      )
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#05080a] font-sans text-slate-200 selection:bg-cyan-500/30">
      <Routes>
        {/* ==================================================
            RUTAS PÚBLICAS CON NAVBAR Y FOOTER
        ================================================== */}

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

        {/* ==================================================
            RUTAS PÚBLICAS AISLADAS
        ================================================== */}

        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/diagnostico"
          element={<DiagnosticoPage />}
        />

        {/* ==================================================
            RUTAS PRIVADAS DEL PANEL
        ================================================== */}

        <Route
          path="/dashboard"
          element={
            user ? (
              <DashboardLayout />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        >
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="empresas"
            element={<Companies />}
          />

          <Route
            path="usuarios"
            element={
              canManageUsers ? (
                <Users />
              ) : (
                <Navigate
                  to="/dashboard"
                  replace
                />
              )
            }
          />

          <Route
            path="profesionales"
            element={
              canManageProfessionals ? (
                <Professionals />
              ) : (
                <Navigate
                  to="/dashboard"
                  replace
                />
              )
            }
          />

          {/* ==================================================
              MÓDULO SG-SST
          ================================================== */}

          <Route
            path="sgsst"
            element={<SgsstDashboard />}
          />

          <Route
            path="sgsst/configuracion/:empresaId"
            element={
              canManageSgsst ? (
                <CompanySgsstConfiguration />
              ) : (
                <Navigate
                  to="/dashboard/sgsst"
                  replace
                />
              )
            }
          />

          <Route
            path="sgsst/evaluaciones"
            element={<Evaluations />}
          />

          <Route
            path="sgsst/evaluaciones/:evaluacionId"
            element={<EvaluationMatrix />}
          />

          <Route
            path="sgsst/planes-accion"
            element={<ActionPlans />}
          />
        </Route>

        {/* ==================================================
            RUTAS NO ENCONTRADAS
        ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </div>
  );
}

// ======================================================
// APP
// ======================================================

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
