import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  Loader2,
  Plus,
  Search,
  Settings2,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useAuth } from "../../auth/context/AuthContext";
import {
  crearEvaluacion,
  obtenerConfiguracionesEmpresa,
  obtenerEmpresasSgsst,
  obtenerEvaluaciones,
} from "../api/sgsst.api";
import type {
  ConfiguracionSgsstEmpresa,
  EstadoEvaluacion,
  EvaluacionResumen,
} from "../types/sgsst.types";
import type { Company } from "../../../types/domain";

function estadoLabel(
  estado: EstadoEvaluacion
): string {
  const labels: Record<
    EstadoEvaluacion,
    string
  > = {
    BORRADOR: "Borrador",
    EN_PROGRESO: "En progreso",
    COMPLETADA: "Completada",
    CERRADA: "Cerrada",
  };

  return labels[estado];
}

function estadoClass(
  estado: EstadoEvaluacion
): string {
  const classes: Record<
    EstadoEvaluacion,
    string
  > = {
    BORRADOR:
      "border-neutral-700 bg-neutral-800 text-neutral-300",
    EN_PROGRESO:
      "border-amber-500/20 bg-amber-500/10 text-amber-300",
    COMPLETADA:
      "border-blue-500/20 bg-blue-500/10 text-blue-300",
    CERRADA:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  };

  return classes[estado];
}

export default function Evaluations() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] =
    useSearchParams();

  const empresaInicial =
    searchParams.get("empresaId") ?? "";

  const [empresas, setEmpresas] =
    useState<Company[]>([]);
  const [evaluaciones, setEvaluaciones] =
    useState<EvaluacionResumen[]>([]);
  const [
    configuracionesEmpresa,
    setConfiguracionesEmpresa,
  ] = useState<ConfiguracionSgsstEmpresa[]>(
    []
  );

  const [empresaFiltro, setEmpresaFiltro] =
    useState(empresaInicial);
  const [estadoFiltro, setEstadoFiltro] =
    useState("");
  const [busqueda, setBusqueda] = useState("");

  const [showCreate, setShowCreate] =
    useState(false);
  const [empresaId, setEmpresaId] =
    useState(empresaInicial);
  const [
    configuracionSgsstEmpresaId,
    setConfiguracionSgsstEmpresaId,
  ] = useState("");
  const [nombre, setNombre] = useState(
    `Evaluación SG-SST ${new Date().getFullYear()}`
  );
  const [anioPeriodo, setAnioPeriodo] =
    useState(new Date().getFullYear());
  const [notas, setNotas] = useState("");

  const [loading, setLoading] = useState(true);
  const [
    loadingConfigurations,
    setLoadingConfigurations,
  ] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const puedeCrear =
    user?.role === "PROFESSIONAL" ||
    user?.role === "ADMIN" ||
    user?.role === "OWNER" ||
    user?.role === "SUPERADMIN";

  const cargarEvaluaciones = async () => {
    if (!token) return;

    const data = await obtenerEvaluaciones(
      token,
      {
        empresaId:
          empresaFiltro || undefined,
        estado:
          estadoFiltro || undefined,
      }
    );

    setEvaluaciones(data);
  };

  useEffect(() => {
    let active = true;

    const cargar = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        const [empresasData, evaluacionesData] =
          await Promise.all([
            obtenerEmpresasSgsst(token),
            obtenerEvaluaciones(token, {
              empresaId:
                empresaInicial || undefined,
            }),
          ]);

        if (!active) return;

        setEmpresas(empresasData);
        setEvaluaciones(evaluacionesData);
      } catch (requestError) {
        if (!active) return;

        setError(
          requestError instanceof Error
            ? requestError.message
            : "No fue posible cargar las evaluaciones."
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
  }, [token, empresaInicial]);

  useEffect(() => {
    if (!token) return;

    const timeout = window.setTimeout(() => {
      setSearchParams((current) => {
        const next = new URLSearchParams(
          current
        );

        if (empresaFiltro) {
          next.set(
            "empresaId",
            empresaFiltro
          );
        } else {
          next.delete("empresaId");
        }

        return next;
      });

      void cargarEvaluaciones().catch(
        (requestError) => {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No fue posible aplicar los filtros."
          );
        }
      );
    }, 150);

    return () =>
      window.clearTimeout(timeout);
  }, [
    empresaFiltro,
    estadoFiltro,
    token,
  ]);

  useEffect(() => {
    let active = true;

    const cargarConfiguraciones = async () => {
      if (!token || !empresaId) {
        setConfiguracionesEmpresa([]);
        setConfiguracionSgsstEmpresaId("");
        return;
      }

      try {
        setLoadingConfigurations(true);

        const data =
          await obtenerConfiguracionesEmpresa(
            empresaId,
            token
          );

        if (!active) return;

        setConfiguracionesEmpresa(data);

        const activa = data.find(
          (configuracion) =>
            configuracion.activo
        );

        setConfiguracionSgsstEmpresaId(
          activa?.id ?? ""
        );
      } catch (requestError) {
        if (!active) return;

        setError(
          requestError instanceof Error
            ? requestError.message
            : "No fue posible consultar la configuración de la empresa."
        );
      } finally {
        if (active) {
          setLoadingConfigurations(false);
        }
      }
    };

    void cargarConfiguraciones();

    return () => {
      active = false;
    };
  }, [empresaId, token]);

  const evaluacionesFiltradas = useMemo(() => {
    const term = busqueda.trim().toLowerCase();

    if (!term) return evaluaciones;

    return evaluaciones.filter((evaluacion) =>
      [
        evaluacion.nombre,
        evaluacion.empresa.nombre,
        evaluacion.empresa.nit,
        String(evaluacion.anioPeriodo),
        evaluacion
          .configuracionSgsstEmpresa
          .perfilAplicabilidad.nombre,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [evaluaciones, busqueda]);

  const handleCreate = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (
      !token ||
      !empresaId ||
      !configuracionSgsstEmpresaId
    ) {
      setError(
        "Selecciona una empresa con configuración SG-SST activa."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const creada = await crearEvaluacion(
        {
          empresaId,
          configuracionSgsstEmpresaId,
          nombre,
          anioPeriodo,
          notas: notas || null,
        },
        token
      );

      setShowCreate(false);
      setEvaluaciones((current) => [
        creada,
        ...current,
      ]);

      navigate(
        `/dashboard/sgsst/evaluaciones/${creada.id}`
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible crear la evaluación."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Evaluaciones SG-SST
          </h1>

          <p className="mt-2 max-w-3xl text-sm text-neutral-400">
            Consulta las evaluaciones creadas para las
            empresas disponibles y abre la supermatriz
            para diligenciar sus requisitos.
          </p>
        </div>

        {puedeCrear && (
          <button
            type="button"
            onClick={() => {
              setEmpresaId(
                empresaFiltro ||
                  empresas[0]?.id ||
                  ""
              );
              setShowCreate(true);
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-black transition hover:bg-cyan-300"
          >
            <Plus size={18} />
            Nueva evaluación
          </button>
        )}
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

      <section className="grid gap-3 rounded-2xl border border-neutral-800 bg-[#101010] p-4 md:grid-cols-[1fr_220px_220px]">
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
            placeholder="Buscar evaluación o empresa..."
            className="h-11 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-cyan-500"
          />
        </label>

        <select
          value={empresaFiltro}
          onChange={(event) =>
            setEmpresaFiltro(
              event.target.value
            )
          }
          className="h-11 rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none focus:border-cyan-500"
        >
          <option value="">
            Todas las empresas
          </option>

          {empresas.map((empresa) => (
            <option
              key={empresa.id}
              value={empresa.id}
            >
              {empresa.name}
            </option>
          ))}
        </select>

        <select
          value={estadoFiltro}
          onChange={(event) =>
            setEstadoFiltro(
              event.target.value
            )
          }
          className="h-11 rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none focus:border-cyan-500"
        >
          <option value="">
            Todos los estados
          </option>
          <option value="BORRADOR">
            Borrador
          </option>
          <option value="EN_PROGRESO">
            En progreso
          </option>
          <option value="COMPLETADA">
            Completada
          </option>
          <option value="CERRADA">
            Cerrada
          </option>
        </select>
      </section>

      {evaluacionesFiltradas.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-neutral-700 bg-[#101010] p-8 text-center">
          <ClipboardCheck className="mx-auto h-10 w-10 text-neutral-600" />
          <h2 className="mt-4 font-semibold text-white">
            No hay evaluaciones
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Configura una empresa y crea su primera
            evaluación SG-SST.
          </p>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {evaluacionesFiltradas.map(
            (evaluacion) => (
              <article
                key={evaluacion.id}
                className="rounded-3xl border border-neutral-800 bg-[#101010] p-5 transition hover:border-neutral-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-white">
                      {evaluacion.nombre}
                    </p>
                    <p className="mt-1 truncate text-sm text-neutral-400">
                      {evaluacion.empresa.nombre}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      NIT {evaluacion.empresa.nit}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${estadoClass(
                      evaluacion.estado
                    )}`}
                  >
                    {estadoLabel(
                      evaluacion.estado
                    )}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-neutral-800 bg-[#0b0b0b] p-3">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <CalendarDays size={15} />
                      <span className="text-xs">
                        Periodo
                      </span>
                    </div>
                    <p className="mt-2 font-semibold text-white">
                      {evaluacion.anioPeriodo}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-800 bg-[#0b0b0b] p-3">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <ClipboardCheck size={15} />
                      <span className="text-xs">
                        Requisitos
                      </span>
                    </div>
                    <p className="mt-2 font-semibold text-white">
                      {
                        evaluacion._count
                          .itemsEvaluacion
                      }
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-cyan-500/5 p-3 text-xs text-cyan-200">
                  {
                    evaluacion
                      .configuracionSgsstEmpresa
                      .perfilAplicabilidad.nombre
                  }
                </div>

                <Link
                  to={`/dashboard/sgsst/evaluaciones/${evaluacion.id}`}
                  className="mt-5 flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-700 text-sm font-medium text-neutral-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
                >
                  Abrir supermatriz
                  <ArrowRight size={17} />
                </Link>
              </article>
            )
          )}
        </section>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute inset-0"
            onClick={() =>
              !saving && setShowCreate(false)
            }
          />

          <form
            onSubmit={handleCreate}
            className="relative z-10 max-h-[100dvh] w-full overflow-y-auto rounded-t-3xl border border-neutral-800 bg-[#101010] shadow-2xl sm:max-w-2xl sm:rounded-3xl"
          >
            <div className="border-b border-neutral-800 p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-white">
                Nueva evaluación
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Los ítems se generarán automáticamente
                desde el perfil aplicable.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-neutral-300">
                  Empresa
                </span>

                <select
                  value={empresaId}
                  onChange={(event) =>
                    setEmpresaId(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none focus:border-cyan-500"
                  required
                >
                  <option value="">
                    Selecciona una empresa
                  </option>

                  {empresas.map((empresa) => (
                    <option
                      key={empresa.id}
                      value={empresa.id}
                    >
                      {empresa.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-neutral-300">
                  Configuración activa
                </span>

                <select
                  value={
                    configuracionSgsstEmpresaId
                  }
                  onChange={(event) =>
                    setConfiguracionSgsstEmpresaId(
                      event.target.value
                    )
                  }
                  disabled={
                    loadingConfigurations
                  }
                  className="h-11 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none focus:border-cyan-500 disabled:opacity-60"
                  required
                >
                  <option value="">
                    {loadingConfigurations
                      ? "Consultando..."
                      : "Selecciona una configuración"}
                  </option>

                  {configuracionesEmpresa
                    .filter(
                      (configuracion) =>
                        configuracion.activo
                    )
                    .map((configuracion) => (
                      <option
                        key={configuracion.id}
                        value={configuracion.id}
                      >
                        {
                          configuracion
                            .perfilAplicabilidad
                            .nombre
                        }{" "}
                        ·{" "}
                        {
                          configuracion.marco
                            .version
                        }
                      </option>
                    ))}
                </select>

                {empresaId &&
                  !loadingConfigurations &&
                  !configuracionesEmpresa.some(
                    (item) => item.activo
                  ) && (
                    <Link
                      to={`/dashboard/sgsst/configuracion/${empresaId}`}
                      className="inline-flex items-center gap-2 text-xs font-medium text-cyan-400"
                    >
                      <Settings2 size={14} />
                      Configurar esta empresa
                    </Link>
                  )}
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-neutral-300">
                  Nombre
                </span>

                <input
                  value={nombre}
                  onChange={(event) =>
                    setNombre(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none focus:border-cyan-500"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-neutral-300">
                  Año
                </span>

                <input
                  type="number"
                  min={2000}
                  max={2200}
                  value={anioPeriodo}
                  onChange={(event) =>
                    setAnioPeriodo(
                      Number(event.target.value)
                    )
                  }
                  className="h-11 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none focus:border-cyan-500"
                  required
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-neutral-300">
                  Notas
                </span>

                <textarea
                  value={notas}
                  onChange={(event) =>
                    setNotas(
                      event.target.value
                    )
                  }
                  rows={3}
                  className="w-full resize-y rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 py-3 text-sm text-white outline-none focus:border-cyan-500"
                />
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-neutral-800 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={() =>
                  setShowCreate(false)
                }
                disabled={saving}
                className="h-11 rounded-xl border border-neutral-700 px-5 text-sm font-medium text-neutral-300"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-black disabled:opacity-60"
              >
                {saving ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Plus size={18} />
                )}

                Crear evaluación
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
