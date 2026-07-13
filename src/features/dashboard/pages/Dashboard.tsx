import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BellRing,
  BriefcaseBusiness,
  Building2,
  ShieldCheck,
  Users,
} from "lucide-react";

import { useAuth } from "../../auth/context/AuthContext";
import { apiRequest } from "../../../lib/api";
import type {
  Company,
  ManagedUser,
  Professional,
} from "../../../types/domain";

interface DashboardStats {
  companies: number;
  users: number;
  professionals: number;
}

const internalRoles = new Set([
  "ADMIN",
  "OWNER",
  "SUPERADMIN",
]);

export default function Dashboard() {
  const { user, token } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    companies: 0,
    users: 0,
    professionals: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  const isInternal = Boolean(
    user && internalRoles.has(user.role)
  );

  const canManageUsers = Boolean(
    user &&
      (isInternal || user.role === "CLIENT_ADMIN")
  );

  useEffect(() => {
    if (!user || !token) {
      setLoadingStats(false);
      return;
    }

    let active = true;

    const loadStats = async () => {
      setLoadingStats(true);

      const companyRequest = apiRequest<Company[]>(
        "/api/companies",
        {},
        token
      );

      const userRequest = canManageUsers
        ? apiRequest<ManagedUser[]>("/api/users", {}, token)
        : Promise.resolve([]);

      const professionalRequest = isInternal
        ? apiRequest<Professional[]>(
            "/api/professionals",
            {},
            token
          )
        : Promise.resolve([]);

      const [companies, users, professionals] =
        await Promise.allSettled([
          companyRequest,
          userRequest,
          professionalRequest,
        ]);

      if (!active) return;

      setStats({
        companies:
          companies.status === "fulfilled"
            ? companies.value.length
            : 0,
        users:
          users.status === "fulfilled"
            ? users.value.length
            : 0,
        professionals:
          professionals.status === "fulfilled"
            ? professionals.value.length
            : 0,
      });

      setLoadingStats(false);
    };

    void loadStats();

    return () => {
      active = false;
    };
  }, [token, user, canManageUsers, isInternal]);

  const organizationName = useMemo(() => {
    if (!user) return "tu organización";

    if (user.company?.name) {
      return user.company.name;
    }

    if (isInternal) {
      return "la administración global";
    }

    if (user.professional) {
      return "tu operación profesional";
    }

    return "tu organización";
  }, [user, isInternal]);

  if (!user) return null;

  const metrics = [
    {
      title: "Empresas activas",
      value: loadingStats ? "—" : String(stats.companies),
      description: "Clientes disponibles",
      icon: <Building2 size={20} className="text-purple-400" />,
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Usuarios activos",
      value: loadingStats ? "—" : String(stats.users),
      description: canManageUsers
        ? "Accesos visibles para tu rol"
        : "Sin permiso de administración",
      icon: <Users size={20} className="text-blue-400" />,
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Profesionales",
      value: loadingStats ? "—" : String(stats.professionals),
      description: isInternal
        ? "Prestadores registrados"
        : user.professional
          ? "Perfil profesional vinculado"
          : "No aplica para este rol",
      icon: (
        <BriefcaseBusiness
          size={20}
          className="text-emerald-400"
        />
      ),
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Estado del sistema",
      value: "Óptimo",
      description: "API y sesión disponibles",
      icon: <Activity size={20} className="text-cyan-400" />,
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
  ];

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col">
      <header className="mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="mb-1 text-3xl font-bold tracking-tight text-white">
            Hola, {user.name.split(" ")[0]} 👋
          </h1>

          <p className="text-sm text-neutral-400">
            Resumen de actividad de{" "}
            <span className="font-medium text-neutral-200">
              {organizationName}
            </span>
            .
          </p>
        </motion.div>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border border-neutral-800/60 bg-[#111111] p-6 shadow-lg"
          >
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br from-white/5 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10 mb-4 flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${metric.bg} ${metric.border}`}
              >
                {metric.icon}
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="mb-1 text-3xl font-bold tracking-tight text-white">
                {metric.value}
              </h3>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
                {metric.title}
              </p>
              <p className="text-xs text-neutral-500">
                {metric.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col justify-between rounded-[2rem] border border-neutral-800/60 bg-[#111111] p-8 lg:col-span-2"
        >
          <div>
            <div className="mb-6 flex items-center gap-3">
              <ShieldCheck className="text-cyan-500" size={24} />
              <h2 className="text-lg font-bold text-white">
                Información de sesión
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  Rol asignado
                </p>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                  <p className="text-sm font-medium text-neutral-200">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  Contexto
                </p>
                <p className="break-all text-sm font-mono text-neutral-400">
                  {user.companyId ??
                    user.professionalId ??
                    "administración-global"}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-4 sm:col-span-2">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  Correo electrónico
                </p>
                <p className="text-sm font-medium text-neutral-200">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-[2rem] border border-neutral-800/60 bg-[#111111] p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <BellRing className="text-purple-500" size={20} />
            <h3 className="text-lg font-bold text-white">
              Accesos habilitados
            </h3>
          </div>

          <div className="space-y-3">
            <PermissionRow
              label="Consulta de empresas"
              enabled
            />
            <PermissionRow
              label="Administración de usuarios"
              enabled={canManageUsers}
            />
            <PermissionRow
              label="Gestión de profesionales"
              enabled={isInternal}
            />
            <PermissionRow
              label="Administración global"
              enabled={
                user.role === "OWNER" ||
                user.role === "SUPERADMIN"
              }
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PermissionRow({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-[#0a0a0a] px-4 py-3">
      <span className="text-sm text-neutral-300">{label}</span>
      <span
        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
          enabled
            ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            : "border border-neutral-700 bg-neutral-800 text-neutral-500"
        }`}
      >
        {enabled ? "ACTIVO" : "LIMITADO"}
      </span>
    </div>
  );
}
