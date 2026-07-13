import {
  BriefcaseBusiness,
  Building2,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../features/auth/context/AuthContext";

const internalRoles = new Set([
  "ADMIN",
  "OWNER",
  "SUPERADMIN",
]);

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return null;

  const isInternal = internalRoles.has(user.role);
  const canManageUsers =
    isInternal || user.role === "CLIENT_ADMIN";

  const items = [
    {
      to: "/dashboard",
      label: "Inicio",
      icon: LayoutDashboard,
      visible: true,
      exact: true,
    },
    {
      to: "/dashboard/empresas",
      label: "Empresas",
      icon: Building2,
      visible: true,
    },
    {
      to: "/dashboard/usuarios",
      label: "Usuarios",
      icon: Users,
      visible: canManageUsers,
    },
    {
      to: "/dashboard/profesionales",
      label: "Profesionales",
      icon: BriefcaseBusiness,
      visible: isInternal,
    },
  ];

  const isActive = (
    path: string,
    exact = false
  ): boolean => {
    if (exact) {
      return location.pathname === path;
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <aside className="z-20 flex w-64 shrink-0 flex-col border-r border-neutral-800/50 bg-[#0a0a0a]">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight">
            Panel de control
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Gestión SG-SST
          </p>
        </div>

        <nav className="mt-4 flex-1 space-y-2 px-4">
          {items
            .filter((item) => item.visible)
            .map((item) => {
              const Icon = item.icon;
              const active = isActive(
                item.to,
                item.exact
              );

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                    active
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-neutral-400 hover:bg-neutral-800/50 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}
        </nav>

        <div className="border-t border-neutral-800/50 p-4">
          <div className="mb-3 rounded-xl border border-neutral-800 bg-[#111111] px-4 py-3">
            <p className="truncate text-sm font-medium text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-neutral-500">
              {user.email}
            </p>
            <p className="mt-1 text-[10px] font-bold tracking-wider text-cyan-500">
              {user.role}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition-colors hover:bg-red-400/10"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">
              Cerrar sesión
            </span>
          </button>
        </div>
      </aside>

      <main className="relative flex-1 overflow-y-auto">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 min-h-full p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
