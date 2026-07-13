import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ListTodo,
  Loader2,
  Search,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../../auth/context/AuthContext";
import {
  obtenerPlanesAccion,
} from "../api/sgsst.api";
import type {
  EstadoAccion,
  PlanAccion,
} from "../types/sgsst.types";

function estadoLabel(
  estado: EstadoAccion
): string {
  const labels: Record<EstadoAccion, string> = {
    PENDIENTE: "Pendiente",
    EN_PROGRESO: "En progreso",
    BLOQUEADA: "Bloqueada",
    COMPLETADA: "Completada",
    CANCELADA: "Cancelada",
  };

  return labels[estado];
}

function estadoClass(
  estado: EstadoAccion
): string {
  const classes: Record<EstadoAccion, string> = {
    PENDIENTE:
      "border-neutral-700 bg-neutral-800 text-neutral-300",
    EN_PROGRESO:
      "border-amber-500/20 bg-amber-500/10 text-amber-300",
    BLOQUEADA:
      "border-red-500/20 bg-red-500/10 text-red-300",
    COMPLETADA:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    CANCELADA:
      "border-neutral-700 bg-neutral-900 text-neutral-500",
  };

  return classes[estado];
}

export default function ActionPlans() {
  const { token } = useAuth();

  const [planes, setPlanes] =
    useState<PlanAccion[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const cargar = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        const data = await obtenerPlanesAccion(
          token,
          {
            estado: estado || undefined,
          }
        );

        if (active) {
          setPlanes(data);
        }
      } catch (requestError) {
        if (!active) return;

        setError(
          requestError instanceof Error
            ? requestError.message
            : "No fue posible consultar los planes de acción."
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
  }, [token, estado]);

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();

    if (!term) return planes;

    return planes.filter((plan) =>
      [
        plan.descripcion,
        plan.empresa.nombre,
        plan.empresa.nit,
        plan.requisito.codigo,
        plan.requisito.descripcion,
        plan.requisito.estandar.nombre,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [planes, busqueda]);

  const vencidos = useMemo(
    () =>
      planes.filter((plan) => {
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
      }).length,
    [planes]
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Planes de acción
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-neutral-400">
          Consulta las acciones de mejoramiento
          asociadas a los requisitos de la supermatriz.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          <AlertTriangle
            size={19}
            className="mt-0.5 shrink-0"
          />
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-neutral-800 bg-[#101010] p-5">
          <ListTodo className="h-5 w-5 text-cyan-400" />
          <p className="mt-4 text-3xl font-bold text-white">
            {planes.length}
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Total de planes
          </p>
        </article>

        <article className="rounded-2xl border border-neutral-800 bg-[#101010] p-5">
          <Clock3 className="h-5 w-5 text-amber-400" />
          <p className="mt-4 text-3xl font-bold text-white">
            {
              planes.filter(
                (plan) =>
                  plan.estado ===
                    "PENDIENTE" ||
                  plan.estado ===
                    "EN_PROGRESO"
              ).length
            }
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Pendientes o en progreso
          </p>
        </article>

        <article className="rounded-2xl border border-neutral-800 bg-[#101010] p-5">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <p className="mt-4 text-3xl font-bold text-white">
            {vencidos}
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Vencidos
          </p>
        </article>
      </section>

      <section className="grid gap-3 rounded-2xl border border-neutral-800 bg-[#101010] p-4 md:grid-cols-[1fr_220px]">
        <label className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />

          <input
            value={busqueda}
            onChange={(event) =>
              setBusqueda(event.target.value)
            }
            placeholder="Buscar plan, empresa o requisito..."
            className="h-11 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] pl-10 pr-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-cyan-500"
          />
        </label>

        <select
          value={estado}
          onChange={(event) =>
            setEstado(event.target.value)
          }
          className="h-11 rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none focus:border-cyan-500"
        >
          <option value="">
            Todos los estados
          </option>
          <option value="PENDIENTE">
            Pendiente
          </option>
          <option value="EN_PROGRESO">
            En progreso
          </option>
          <option value="BLOQUEADA">
            Bloqueada
          </option>
          <option value="COMPLETADA">
            Completada
          </option>
          <option value="CANCELADA">
            Cancelada
          </option>
        </select>
      </section>

      {filtrados.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-neutral-700 bg-[#101010] p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-neutral-600" />
          <p className="mt-4 text-sm text-neutral-400">
            No hay planes de acción para mostrar.
          </p>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {filtrados.map((plan) => {
            const estaVencido =
              Boolean(plan.fechaLimite) &&
              plan.estado !== "COMPLETADA" &&
              plan.estado !== "CANCELADA" &&
              new Date(
                plan.fechaLimite as string
              ).getTime() <
                new Date().setHours(
                  0,
                  0,
                  0,
                  0
                );

            return (
              <article
                key={plan.id}
                className="rounded-3xl border border-neutral-800 bg-[#101010] p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs font-semibold text-cyan-300">
                      {plan.requisito.codigo}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {plan.empresa.nombre}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${estadoClass(
                      plan.estado
                    )}`}
                  >
                    {estadoLabel(plan.estado)}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-neutral-300">
                  {plan.descripcion}
                </p>

                <p className="mt-3 line-clamp-2 text-xs leading-5 text-neutral-500">
                  {plan.requisito.descripcion}
                </p>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">
                      Avance
                    </span>
                    <span className="font-medium text-white">
                      {plan.porcentajeAvance}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{
                        width: `${Math.min(
                          plan.porcentajeAvance,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span
                    className={
                      estaVencido
                        ? "font-medium text-red-300"
                        : "text-neutral-500"
                    }
                  >
                    Fecha límite:{" "}
                    {plan.fechaLimite?.slice(
                      0,
                      10
                    ) ?? "Sin definir"}
                  </span>

                  <span className="text-neutral-500">
                    Prioridad: {plan.prioridad}
                  </span>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
