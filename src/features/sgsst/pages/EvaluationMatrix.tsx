import {
  AlertTriangle,
  ArrowLeft,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Filter,
  Loader2,
  Save,
  Search,
} from "lucide-react";
import {
  Link,
  useParams,
} from "react-router-dom";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../../auth/context/AuthContext";
import {
  actualizarItemEvaluacion,
  calcularEvaluacion,
  completarEvaluacion,
  guardarRespuestaEvaluacion,
  obtenerEvaluacion,
} from "../api/sgsst.api";
import type {
  EstadoAplicabilidad,
  EstadoCumplimiento,
  EvaluacionDetalle,
  ItemEvaluacion,
  ResumenCalificacion,
} from "../types/sgsst.types";

interface ItemDraft {
  estadoAplicabilidad: EstadoAplicabilidad;
  estadoCumplimiento: EstadoCumplimiento;
  observaciones: string;
  fechaLimite: string;
}

const complianceOptions: Array<{
  value: EstadoCumplimiento;
  label: string;
}> = [
  {
    value: "PENDIENTE",
    label: "Pendiente",
  },
  {
    value: "CUMPLE",
    label: "Cumple",
  },
  {
    value: "CUMPLE_PARCIAL",
    label: "Cumple parcialmente",
  },
  {
    value: "NO_CUMPLE",
    label: "No cumple",
  },
  {
    value: "NO_APLICA",
    label: "No aplica",
  },
];

const applicabilityOptions: Array<{
  value: EstadoAplicabilidad;
  label: string;
}> = [
  {
    value: "APLICA",
    label: "Aplica",
  },
  {
    value: "NO_APLICA",
    label: "No aplica",
  },
  {
    value: "PENDIENTE_REVISION",
    label: "Pendiente de revisión",
  },
];

function cumplimientoLabel(
  estado: EstadoCumplimiento
): string {
  return (
    complianceOptions.find(
      (option) => option.value === estado
    )?.label ?? estado
  );
}

function cumplimientoClass(
  estado: EstadoCumplimiento
): string {
  const classes: Record<
    EstadoCumplimiento,
    string
  > = {
    PENDIENTE:
      "border-neutral-700 bg-neutral-800 text-neutral-300",
    CUMPLE:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    CUMPLE_PARCIAL:
      "border-amber-500/20 bg-amber-500/10 text-amber-300",
    NO_CUMPLE:
      "border-red-500/20 bg-red-500/10 text-red-300",
    NO_APLICA:
      "border-blue-500/20 bg-blue-500/10 text-blue-300",
  };

  return classes[estado];
}

function evaluacionEstadoLabel(
  estado: EvaluacionDetalle["estado"]
): string {
  const labels = {
    BORRADOR: "Borrador",
    EN_PROGRESO: "En progreso",
    COMPLETADA: "Completada",
    CERRADA: "Cerrada",
  };

  return labels[estado];
}

function buildDrafts(
  items: ItemEvaluacion[],
  role: string | undefined
): Record<string, ItemDraft> {
  const preferredType =
    role === "PROFESSIONAL"
      ? "PROFESIONAL"
      : role === "CLIENT_ADMIN" ||
          role === "CLIENT_USER"
        ? "EMPRESA"
        : role === "ADMIN" ||
            role === "OWNER" ||
            role === "SUPERADMIN"
          ? "ADMINISTRACION"
          : null;

  return Object.fromEntries(
    items.map((item) => {
      const preferredResponse =
        preferredType
          ? item.respuestas.find(
              (response) =>
                response.tipoEvaluador ===
                preferredType
            )
          : undefined;

      return [
        item.id,
        {
          estadoAplicabilidad:
            item.estadoAplicabilidad,
          estadoCumplimiento:
            preferredResponse
              ?.estadoCumplimiento ??
            item.estadoCumplimiento,
          observaciones:
            preferredResponse
              ?.observaciones ??
            item.observaciones ??
            "",
          fechaLimite:
            item.fechaLimite?.slice(
              0,
              10
            ) ?? "",
        },
      ];
    })
  );
}

export default function EvaluationMatrix() {
  const { evaluacionId = "" } = useParams();
  const { token, user } = useAuth();

  const [evaluacion, setEvaluacion] =
    useState<EvaluacionDetalle | null>(null);
  const [drafts, setDrafts] = useState<
    Record<string, ItemDraft>
  >({});
  const [savingId, setSavingId] =
    useState<string | null>(null);
  const [calificando, setCalificando] =
    useState(false);
  const [completando, setCompletando] =
    useState(false);
  const [
    resumenCalificacion,
    setResumenCalificacion,
  ] = useState<ResumenCalificacion | null>(
    null
  );

  const [busqueda, setBusqueda] = useState("");
  const [cicloFiltro, setCicloFiltro] =
    useState("");
  const [
    cumplimientoFiltro,
    setCumplimientoFiltro,
  ] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const esInterno =
    user?.role === "ADMIN" ||
    user?.role === "OWNER" ||
    user?.role === "SUPERADMIN";

  const esProfesional =
    user?.role === "PROFESSIONAL";

  const esCliente =
    user?.role === "CLIENT_ADMIN" ||
    user?.role === "CLIENT_USER";

  const puedeGestionar =
    esInterno || esProfesional;

  const puedeResponder =
    puedeGestionar || esCliente;

  const bloqueada =
    evaluacion?.estado === "CERRADA";

  const cargarEvaluacion = useCallback(
    async (showLoader = true) => {
      if (!token || !evaluacionId) return;

      try {
        if (showLoader) {
          setLoading(true);
        }

        setError("");

        const data = await obtenerEvaluacion(
          evaluacionId,
          token
        );

        setEvaluacion(data);
        setDrafts(
          buildDrafts(
            data.itemsEvaluacion,
            user?.role
          )
        );
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No fue posible cargar la supermatriz."
        );
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [token, evaluacionId, user?.role]
  );

  useEffect(() => {
    void cargarEvaluacion();
  }, [cargarEvaluacion]);

  const ciclos = useMemo(() => {
    if (!evaluacion) return [];

    const values = new Map<
      string,
      string
    >();

    evaluacion.itemsEvaluacion.forEach(
      (item) => {
        const ciclo =
          item.requisito.estandar.categoria
            .cicloPhva;

        values.set(ciclo.id, ciclo.nombre);
      }
    );

    return [...values.entries()].map(
      ([id, nombre]) => ({
        id,
        nombre,
      })
    );
  }, [evaluacion]);

  const itemsFiltrados = useMemo(() => {
    if (!evaluacion) return [];

    const term = busqueda.trim().toLowerCase();

    return evaluacion.itemsEvaluacion.filter(
      (item) => {
        const draft = drafts[item.id];

        const matchesSearch =
          !term ||
          [
            item.requisito.codigo,
            item.requisito.descripcion,
            item.requisito.proceso?.nombre ??
              "",
            item.requisito.estandar.codigo,
            item.requisito.estandar.nombre,
            item.requisito.estandar.categoria
              .nombre,
          ]
            .join(" ")
            .toLowerCase()
            .includes(term);

        const matchesCycle =
          !cicloFiltro ||
          item.requisito.estandar.categoria
            .cicloPhva.id === cicloFiltro;

        const matchesCompliance =
          !cumplimientoFiltro ||
          (draft?.estadoCumplimiento ??
            item.estadoCumplimiento) ===
            cumplimientoFiltro;

        return (
          matchesSearch &&
          matchesCycle &&
          matchesCompliance
        );
      }
    );
  }, [
    evaluacion,
    drafts,
    busqueda,
    cicloFiltro,
    cumplimientoFiltro,
  ]);

  const resumenItems = useMemo(() => {
    if (!evaluacion) {
      return {
        total: 0,
        cumple: 0,
        parcial: 0,
        noCumple: 0,
        pendiente: 0,
        noAplica: 0,
      };
    }

    const estados =
      evaluacion.itemsEvaluacion.map(
        (item) =>
          drafts[item.id]
            ?.estadoCumplimiento ??
          item.estadoCumplimiento
      );

    return {
      total: estados.length,
      cumple: estados.filter(
        (estado) => estado === "CUMPLE"
      ).length,
      parcial: estados.filter(
        (estado) =>
          estado === "CUMPLE_PARCIAL"
      ).length,
      noCumple: estados.filter(
        (estado) =>
          estado === "NO_CUMPLE"
      ).length,
      pendiente: estados.filter(
        (estado) =>
          estado === "PENDIENTE"
      ).length,
      noAplica: estados.filter(
        (estado) =>
          estado === "NO_APLICA"
      ).length,
    };
  }, [evaluacion, drafts]);

  const updateDraft = (
    itemId: string,
    changes: Partial<ItemDraft>
  ) => {
    setDrafts((current) => ({
      ...current,
      [itemId]: {
        ...current[itemId],
        ...changes,
      },
    }));
  };

  const guardarItem = async (
    item: ItemEvaluacion
  ) => {
    if (
      !token ||
      !evaluacion ||
      bloqueada ||
      !puedeResponder
    ) {
      return;
    }

    const draft = drafts[item.id];

    if (!draft) return;

    try {
      setSavingId(item.id);
      setError("");
      setSuccess("");

      if (puedeGestionar) {
        await actualizarItemEvaluacion(
          evaluacion.id,
          item.id,
          {
            estadoAplicabilidad:
              draft.estadoAplicabilidad,
            estadoCumplimiento:
              draft.estadoCumplimiento,
            observaciones:
              draft.observaciones || null,
            fechaLimite:
              draft.fechaLimite || null,
          },
          token
        );
      } else {
        await guardarRespuestaEvaluacion(
          evaluacion.id,
          item.id,
          {
            estadoCumplimiento:
              draft.estadoCumplimiento,
            observaciones:
              draft.observaciones || null,
          },
          token
        );
      }

      await cargarEvaluacion(false);
      setSuccess(
        `Requisito ${item.requisito.codigo} guardado correctamente.`
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible guardar el requisito."
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleCalculate = async () => {
    if (!token || !evaluacion) return;

    try {
      setCalificando(true);
      setError("");
      setSuccess("");

      const result =
        await calcularEvaluacion(
          evaluacion.id,
          token
        );

      setResumenCalificacion(result);
      setSuccess(
        "La calificación fue calculada."
      );

      await cargarEvaluacion(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible calcular la evaluación."
      );
    } finally {
      setCalificando(false);
    }
  };

  const handleComplete = async () => {
    if (
      !token ||
      !evaluacion ||
      !puedeGestionar
    ) {
      return;
    }

    const confirmed = window.confirm(
      "¿Deseas marcar esta evaluación como completada?"
    );

    if (!confirmed) return;

    try {
      setCompletando(true);
      setError("");
      setSuccess("");

      const result =
        await completarEvaluacion(
          evaluacion.id,
          token
        );

      setResumenCalificacion(
        result.calificacion
      );
      setSuccess(
        "La evaluación fue completada correctamente."
      );

      await cargarEvaluacion(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible completar la evaluación."
      );
    } finally {
      setCompletando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!evaluacion) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        {error || "Evaluación no encontrada."}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-neutral-800 bg-[#101010] p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <Link
              to="/dashboard/sgsst/evaluaciones"
              className="mb-3 inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Volver a evaluaciones
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {evaluacion.nombre}
              </h1>

              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                {evaluacionEstadoLabel(
                  evaluacion.estado
                )}
              </span>
            </div>

            <p className="mt-2 text-sm text-neutral-400">
              {evaluacion.empresa.nombre} · NIT{" "}
              {evaluacion.empresa.nit} ·{" "}
              {evaluacion.anioPeriodo}
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              {
                evaluacion
                  .configuracionSgsstEmpresa
                  .perfilAplicabilidad.nombre
              }
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCalculate}
              disabled={calificando}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-700 px-4 text-sm font-medium text-neutral-200 transition hover:border-cyan-500/40 hover:text-cyan-300 disabled:opacity-60"
            >
              {calificando ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Calculator size={17} />
              )}
              Calcular
            </button>

            {puedeGestionar &&
              evaluacion.estado !==
                "COMPLETADA" &&
              evaluacion.estado !==
                "CERRADA" && (
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={completando}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-60"
                >
                  {completando ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <CheckCircle2
                      size={17}
                    />
                  )}
                  Completar
                </button>
              )}
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          <AlertTriangle
            size={19}
            className="mt-0.5 shrink-0"
          />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0"
          />
          {success}
        </div>
      )}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {[
          ["Total", resumenItems.total],
          ["Cumple", resumenItems.cumple],
          ["Parcial", resumenItems.parcial],
          ["No cumple", resumenItems.noCumple],
          ["Pendiente", resumenItems.pendiente],
          ["No aplica", resumenItems.noAplica],
        ].map(([label, value]) => (
          <article
            key={String(label)}
            className="rounded-2xl border border-neutral-800 bg-[#101010] p-4"
          >
            <p className="text-xs text-neutral-500">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold text-white">
              {value}
            </p>
          </article>
        ))}
      </section>

      {resumenCalificacion && (
        <section className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-cyan-200">
                Resultado calculado
              </p>
              <p className="mt-1 text-4xl font-bold text-white">
                {
                  resumenCalificacion.porcentaje
                }
                %
              </p>
            </div>

            <div className="text-sm text-cyan-100/80">
              {
                resumenCalificacion.puntajeObtenido
              }{" "}
              de{" "}
              {
                resumenCalificacion.puntajeMaximo
              }{" "}
              puntos ·{" "}
              {resumenCalificacion.pendientes}{" "}
              pendiente(s)
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-3 rounded-2xl border border-neutral-800 bg-[#101010] p-4 lg:grid-cols-[1fr_220px_220px]">
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
            placeholder="Buscar requisito, estándar o proceso..."
            className="h-11 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] pl-10 pr-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-cyan-500"
          />
        </label>

        <label className="relative">
          <Filter
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />

          <select
            value={cicloFiltro}
            onChange={(event) =>
              setCicloFiltro(
                event.target.value
              )
            }
            className="h-11 w-full appearance-none rounded-xl border border-neutral-700 bg-[#0b0b0b] pl-10 pr-8 text-sm text-white outline-none focus:border-cyan-500"
          >
            <option value="">
              Todos los ciclos
            </option>

            {ciclos.map((ciclo) => (
              <option
                key={ciclo.id}
                value={ciclo.id}
              >
                {ciclo.nombre}
              </option>
            ))}
          </select>

          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />
        </label>

        <select
          value={cumplimientoFiltro}
          onChange={(event) =>
            setCumplimientoFiltro(
              event.target.value
            )
          }
          className="h-11 rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none focus:border-cyan-500"
        >
          <option value="">
            Todos los estados
          </option>

          {complianceOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </section>

      <p className="text-xs text-neutral-500">
        Mostrando {itemsFiltrados.length} de{" "}
        {evaluacion.itemsEvaluacion.length}{" "}
        requisitos.
      </p>

      <section className="hidden overflow-hidden rounded-3xl border border-neutral-800 bg-[#101010] xl:block">
        <div className="overflow-x-auto">
          <table className="min-w-[1500px] table-fixed text-left">
            <thead className="border-b border-neutral-800 bg-[#0b0b0b] text-[11px] uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="w-28 px-4 py-4">
                  Código
                </th>
                <th className="w-36 px-4 py-4">
                  PHVA
                </th>
                <th className="w-52 px-4 py-4">
                  Estándar
                </th>
                <th className="w-[420px] px-4 py-4">
                  Requisito
                </th>
                <th className="w-48 px-4 py-4">
                  Aplicabilidad
                </th>
                <th className="w-52 px-4 py-4">
                  Cumplimiento
                </th>
                <th className="w-80 px-4 py-4">
                  Observaciones
                </th>
                <th className="w-44 px-4 py-4">
                  Fecha límite
                </th>
                <th className="w-32 px-4 py-4">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-800">
              {itemsFiltrados.map((item) => {
                const draft = drafts[item.id];

                return (
                  <tr
                    key={item.id}
                    className="align-top transition hover:bg-neutral-900/40"
                  >
                    <td className="px-4 py-4">
                      <span className="font-mono text-xs font-semibold text-cyan-300">
                        {item.requisito.codigo}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-xs text-neutral-300">
                      {
                        item.requisito.estandar
                          .categoria.cicloPhva
                          .nombre
                      }
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-xs font-medium text-white">
                        {
                          item.requisito.estandar
                            .codigo
                        }
                      </p>
                      <p className="mt-1 line-clamp-3 text-xs leading-5 text-neutral-500">
                        {
                          item.requisito.estandar
                            .nombre
                        }
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-sm leading-6 text-neutral-200">
                        {
                          item.requisito
                            .descripcion
                        }
                      </p>

                      <details className="mt-3 text-xs text-neutral-500">
                        <summary className="cursor-pointer font-medium text-cyan-400">
                          Ver información de apoyo
                        </summary>

                        <div className="mt-3 space-y-2 rounded-xl border border-neutral-800 bg-[#0b0b0b] p-3 leading-5">
                          <p>
                            <strong className="text-neutral-300">
                              Proceso:
                            </strong>{" "}
                            {item.requisito.proceso
                              ?.nombre ?? "Sin definir"}
                          </p>

                          <p>
                            <strong className="text-neutral-300">
                              Responsables:
                            </strong>{" "}
                            {item.requisito.rolesResponsables
                              .map(
                                (relation) =>
                                  relation
                                    .rolResponsable
                                    .nombre
                              )
                              .join(", ") ||
                              "Sin definir"}
                          </p>

                          <p>
                            <strong className="text-neutral-300">
                              Soportes:
                            </strong>{" "}
                            {item.requisito.evidenciasRequeridas
                              .map(
                                (evidencia) =>
                                  evidencia.nombre
                              )
                              .join(", ") ||
                              "Sin definir"}
                          </p>

                          {item.requisito
                            .plantillaAccion && (
                            <p>
                              <strong className="text-neutral-300">
                                Acción sugerida:
                              </strong>{" "}
                              {
                                item.requisito
                                  .plantillaAccion
                              }
                            </p>
                          )}
                        </div>
                      </details>
                    </td>

                    <td className="px-4 py-4">
                      {puedeGestionar &&
                      !bloqueada ? (
                        <select
                          value={
                            draft
                              ?.estadoAplicabilidad ??
                            item.estadoAplicabilidad
                          }
                          onChange={(event) =>
                            updateDraft(item.id, {
                              estadoAplicabilidad:
                                event.target
                                  .value as EstadoAplicabilidad,
                            })
                          }
                          className="h-10 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-xs text-white outline-none focus:border-cyan-500"
                        >
                          {applicabilityOptions.map(
                            (option) => (
                              <option
                                key={option.value}
                                value={
                                  option.value
                                }
                              >
                                {option.label}
                              </option>
                            )
                          )}
                        </select>
                      ) : (
                        <span className="text-xs text-neutral-300">
                          {
                            applicabilityOptions.find(
                              (option) =>
                                option.value ===
                                item.estadoAplicabilidad
                            )?.label
                          }
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {puedeResponder &&
                      !bloqueada ? (
                        <select
                          value={
                            draft
                              ?.estadoCumplimiento ??
                            item.estadoCumplimiento
                          }
                          onChange={(event) =>
                            updateDraft(item.id, {
                              estadoCumplimiento:
                                event.target
                                  .value as EstadoCumplimiento,
                            })
                          }
                          className="h-10 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-xs text-white outline-none focus:border-cyan-500"
                        >
                          {complianceOptions.map(
                            (option) => (
                              <option
                                key={option.value}
                                value={
                                  option.value
                                }
                              >
                                {option.label}
                              </option>
                            )
                          )}
                        </select>
                      ) : (
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${cumplimientoClass(
                            item.estadoCumplimiento
                          )}`}
                        >
                          {cumplimientoLabel(
                            item.estadoCumplimiento
                          )}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {puedeResponder &&
                      !bloqueada ? (
                        <textarea
                          value={
                            draft?.observaciones ??
                            ""
                          }
                          onChange={(event) =>
                            updateDraft(item.id, {
                              observaciones:
                                event.target
                                  .value,
                            })
                          }
                          rows={4}
                          placeholder="Registra el hallazgo o soporte..."
                          className="w-full resize-y rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 py-2 text-xs leading-5 text-white outline-none placeholder:text-neutral-600 focus:border-cyan-500"
                        />
                      ) : (
                        <p className="text-xs leading-5 text-neutral-400">
                          {item.observaciones ||
                            "Sin observaciones"}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {puedeGestionar &&
                      !bloqueada ? (
                        <input
                          type="date"
                          value={
                            draft?.fechaLimite ??
                            ""
                          }
                          onChange={(event) =>
                            updateDraft(item.id, {
                              fechaLimite:
                                event.target
                                  .value,
                            })
                          }
                          className="h-10 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-xs text-white outline-none focus:border-cyan-500"
                        />
                      ) : (
                        <span className="text-xs text-neutral-400">
                          {item.fechaLimite?.slice(
                            0,
                            10
                          ) ?? "—"}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {puedeResponder &&
                        !bloqueada && (
                          <button
                            type="button"
                            onClick={() =>
                              void guardarItem(
                                item
                              )
                            }
                            disabled={
                              savingId ===
                              item.id
                            }
                            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-3 text-xs font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-60"
                          >
                            {savingId ===
                            item.id ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Save
                                size={15}
                              />
                            )}
                            Guardar
                          </button>
                        )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4 xl:hidden">
        {itemsFiltrados.map((item) => {
          const draft = drafts[item.id];

          return (
            <article
              key={item.id}
              className="rounded-3xl border border-neutral-800 bg-[#101010] p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-semibold text-cyan-300">
                    {item.requisito.codigo}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {
                      item.requisito.estandar
                        .categoria.cicloPhva
                        .nombre
                    }{" "}
                    ·{" "}
                    {
                      item.requisito.estandar
                        .codigo
                    }
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${cumplimientoClass(
                    draft
                      ?.estadoCumplimiento ??
                      item.estadoCumplimiento
                  )}`}
                >
                  {cumplimientoLabel(
                    draft
                      ?.estadoCumplimiento ??
                      item.estadoCumplimiento
                  )}
                </span>
              </div>

              <h3 className="mt-4 text-sm font-medium leading-6 text-white">
                {item.requisito.descripcion}
              </h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {puedeGestionar &&
                !bloqueada ? (
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-neutral-400">
                      Aplicabilidad
                    </span>
                    <select
                      value={
                        draft
                          ?.estadoAplicabilidad ??
                        item.estadoAplicabilidad
                      }
                      onChange={(event) =>
                        updateDraft(item.id, {
                          estadoAplicabilidad:
                            event.target
                              .value as EstadoAplicabilidad,
                        })
                      }
                      className="h-11 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none focus:border-cyan-500"
                    >
                      {applicabilityOptions.map(
                        (option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        )
                      )}
                    </select>
                  </label>
                ) : null}

                {puedeResponder &&
                !bloqueada ? (
                  <label className="space-y-2">
                    <span className="text-xs font-medium text-neutral-400">
                      Cumplimiento
                    </span>
                    <select
                      value={
                        draft
                          ?.estadoCumplimiento ??
                        item.estadoCumplimiento
                      }
                      onChange={(event) =>
                        updateDraft(item.id, {
                          estadoCumplimiento:
                            event.target
                              .value as EstadoCumplimiento,
                        })
                      }
                      className="h-11 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none focus:border-cyan-500"
                    >
                      {complianceOptions.map(
                        (option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        )
                      )}
                    </select>
                  </label>
                ) : null}
              </div>

              {puedeResponder &&
              !bloqueada ? (
                <label className="mt-4 block space-y-2">
                  <span className="text-xs font-medium text-neutral-400">
                    Observaciones
                  </span>
                  <textarea
                    value={
                      draft?.observaciones ??
                      ""
                    }
                    onChange={(event) =>
                      updateDraft(item.id, {
                        observaciones:
                          event.target.value,
                      })
                    }
                    rows={4}
                    className="w-full resize-y rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 py-3 text-sm text-white outline-none focus:border-cyan-500"
                  />
                </label>
              ) : (
                <p className="mt-4 text-sm text-neutral-400">
                  {item.observaciones ||
                    "Sin observaciones"}
                </p>
              )}

              {puedeGestionar &&
                !bloqueada && (
                  <label className="mt-4 block space-y-2">
                    <span className="text-xs font-medium text-neutral-400">
                      Fecha límite
                    </span>
                    <input
                      type="date"
                      value={
                        draft?.fechaLimite ??
                        ""
                      }
                      onChange={(event) =>
                        updateDraft(item.id, {
                          fechaLimite:
                            event.target.value,
                        })
                      }
                      className="h-11 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none focus:border-cyan-500"
                    />
                  </label>
                )}

              <details className="mt-4 rounded-2xl border border-neutral-800 bg-[#0b0b0b] p-3">
                <summary className="cursor-pointer text-xs font-medium text-cyan-400">
                  Información de apoyo
                </summary>

                <div className="mt-3 space-y-2 text-xs leading-5 text-neutral-500">
                  <p>
                    <strong className="text-neutral-300">
                      Proceso:
                    </strong>{" "}
                    {item.requisito.proceso
                      ?.nombre ?? "Sin definir"}
                  </p>
                  <p>
                    <strong className="text-neutral-300">
                      Responsables:
                    </strong>{" "}
                    {item.requisito.rolesResponsables
                      .map(
                        (relation) =>
                          relation.rolResponsable
                            .nombre
                      )
                      .join(", ") ||
                      "Sin definir"}
                  </p>
                  <p>
                    <strong className="text-neutral-300">
                      Soportes:
                    </strong>{" "}
                    {item.requisito.evidenciasRequeridas
                      .map(
                        (evidencia) =>
                          evidencia.nombre
                      )
                      .join(", ") ||
                      "Sin definir"}
                  </p>
                </div>
              </details>

              {puedeResponder &&
                !bloqueada && (
                  <button
                    type="button"
                    onClick={() =>
                      void guardarItem(item)
                    }
                    disabled={
                      savingId === item.id
                    }
                    className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 text-sm font-semibold text-black disabled:opacity-60"
                  >
                    {savingId === item.id ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={17} />
                    )}
                    Guardar requisito
                  </button>
                )}
            </article>
          );
        })}
      </section>

      {itemsFiltrados.length === 0 && (
        <section className="rounded-3xl border border-dashed border-neutral-700 bg-[#101010] p-8 text-center">
          <ClipboardCheck className="mx-auto h-10 w-10 text-neutral-600" />
          <p className="mt-4 text-sm text-neutral-400">
            No hay requisitos que coincidan con
            los filtros seleccionados.
          </p>
        </section>
      )}
    </div>
  );
}
