import {
  AlertTriangle,
  ArrowRight,
  Building2,
  ClipboardCheck,
  FileCheck2,
  ListTodo,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import {
  Link,
} from "react-router-dom";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../../auth/context/AuthContext";
import {
  obtenerEmpresasSgsst,
  obtenerEvaluaciones,
  obtenerPlanesAccion,
} from "../api/sgsst.api";
import type {
  EvaluacionResumen,
  PlanAccion,
} from "../types/sgsst.types";
import type { Company } from "../../../types/domain";

function statusLabel(
  status: EvaluacionResumen["estado"]
): string {
  const labels = {
    BORRADOR: "Borrador",
    EN_PROGRESO: "En progreso",
    COMPLETADA: "Completada",
    CERRADA: "Cerrada",
  };

  return labels[status];
}

function statusClass(
  status: EvaluacionResumen["estado"]
): string {
  if (status === "CERRADA") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "COMPLETADA") {
    return "border-blue-500/20 bg-blue-500/10 text-blue-300";
  }

  if (status === "EN_PROGRESO") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }

  return "border-neutral-700 bg-neutral-800 text-neutral-300";
}

export default function SgsstDashboard() {
  const { token, user } = useAuth();

  const [empresas, setEmpresas] = useState<Company[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<
    EvaluacionResumen[]
  >([]);
  const [planes, setPlanes] = useState<PlanAccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const puedeGestionar =
    user?.role === "PROFESSIONAL" ||
    user?.role === "ADMIN" ||
    user?.role === "OWNER" ||
    user?.role === "SUPERADMIN";

  useEffect(() => {
    let active = true;

    const cargar = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        const [
          empresasData,
          evaluacionesData,
          planesData,
        ] = await Promise.all([
          obtenerEmpresasSgsst(token),
          obtenerEvaluaciones(token),
          obtenerPlanesAccion(token),
        ]);

        if (!active) return;

        setEmpresas(empresasData);
        setEvaluaciones(evaluacionesData);
        setPlanes(planesData);
      } catch (requestError) {
        if (!active) return;

        setError(
          requestError instanceof Error
            ? requestError.message
            : "No fue posible cargar el módulo SG-SST."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void cargar();

    return () => {
      active = false;
    };
  }, [token]);

  const resumen = useMemo(() => {
    const activas = evaluaciones.filter(
      (evaluacion) =>
        evaluacion.estado === "EN_PROGRESO"
    ).length;

    const completadas = evaluaciones.filter(
      (evaluacion) =>
        evaluacion.estado === "COMPLETADA" ||
        evaluacion.estado === "CERRADA"
    ).length;

    const planesPendientes = planes.filter(
      (plan) =>
        plan.estado === "PENDIENTE" ||
        plan.estado === "EN_PROGRESO" ||
        plan.estado === "BLOQUEADA"
    ).length;

    const vencidos = planes.filter((plan) => {
      if (
        !plan.fechaLimite ||
        plan.estado === "COMPLETADA" ||
        plan.estado === "CANCELADA"
      ) {
        return false;
      }

      return (
        new Date(plan.fechaLimite).getTime() <
        new Date().setHours(0, 0, 0, 0)
      );
    }).length;

    return {
      activas,
      completadas,
      planesPendientes,
      vencidos,
    };
  }, [evaluaciones, planes]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-cyan-500/10 via-[#111111] to-[#0d0d0d] p-5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
              <ShieldCheck size={23} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Gestión de la supermatriz SG-SST
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-400">
              Configura el perfil aplicable de cada empresa,
              inicia evaluaciones y realiza el seguimiento de
              requisitos, calificaciones y planes de acción.
            </p>
          </div>

          <Link
            to="/dashboard/sgsst/evaluaciones"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-black transition hover:bg-cyan-300"
          >
            Ver evaluaciones
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          <AlertTriangle
            size={19}
            className="mt-0.5 shrink-0"
          />
          <span>{error}</span>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Empresas disponibles",
            value: empresas.length,
            icon: Building2,
          },
          {
            label: "Evaluaciones activas",
            value: resumen.activas,
            icon: ClipboardCheck,
          },
          {
            label: "Evaluaciones finalizadas",
            value: resumen.completadas,
            icon: FileCheck2,
          },
          {
            label: "Planes pendientes",
            value: resumen.planesPendientes,
            icon: ListTodo,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="rounded-2xl border border-neutral-800 bg-[#111111] p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-cyan-400">
                  <Icon size={20} />
                </div>

                <span className="text-3xl font-bold text-white">
                  {item.value}
                </span>
              </div>

              <p className="mt-4 text-sm text-neutral-400">
                {item.label}
              </p>
            </article>
          );
        })}
      </section>

      {resumen.vencidos > 0 && (
        <Link
          to="/dashboard/sgsst/planes-accion"
          className="flex items-center justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-100 transition hover:bg-amber-500/15"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle
              size={20}
              className="shrink-0"
            />
            <span className="text-sm">
              Hay {resumen.vencidos} plan(es) de acción
              con fecha límite vencida.
            </span>
          </div>

          <ArrowRight size={18} />
        </Link>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-neutral-800 bg-[#101010]">
          <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
            <div>
              <h2 className="font-semibold text-white">
                Empresas
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                Empresas visibles según tus permisos.
              </p>
            </div>
          </div>

          <div className="divide-y divide-neutral-800">
            {empresas.length === 0 ? (
              <p className="p-5 text-sm text-neutral-500">
                No tienes empresas disponibles.
              </p>
            ) : (
              empresas.slice(0, 6).map((empresa) => (
                <div
                  key={empresa.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {empresa.name}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      NIT {empresa.taxId}
                      {empresa.mainCity
                        ? ` · ${empresa.mainCity}`
                        : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {puedeGestionar && (
                      <Link
                        to={`/dashboard/sgsst/configuracion/${empresa.id}`}
                        className="rounded-xl border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
                      >
                        Configurar
                      </Link>
                    )}

                    <Link
                      to={`/dashboard/sgsst/evaluaciones?empresaId=${empresa.id}`}
                      className="rounded-xl bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/15"
                    >
                      Evaluaciones
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-800 bg-[#101010]">
          <div className="border-b border-neutral-800 px-5 py-4">
            <h2 className="font-semibold text-white">
              Evaluaciones recientes
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Últimos procesos registrados.
            </p>
          </div>

          <div className="divide-y divide-neutral-800">
            {evaluaciones.length === 0 ? (
              <p className="p-5 text-sm text-neutral-500">
                Todavía no existen evaluaciones.
              </p>
            ) : (
              evaluaciones.slice(0, 6).map(
                (evaluacion) => (
                  <Link
                    key={evaluacion.id}
                    to={`/dashboard/sgsst/evaluaciones/${evaluacion.id}`}
                    className="block p-5 transition hover:bg-neutral-900/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {evaluacion.nombre}
                        </p>
                        <p className="mt-1 truncate text-xs text-neutral-500">
                          {evaluacion.empresa.nombre} ·{" "}
                          {evaluacion.anioPeriodo}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusClass(
                          evaluacion.estado
                        )}`}
                      >
                        {statusLabel(
                          evaluacion.estado
                        )}
                      </span>
                    </div>
                  </Link>
                )
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
