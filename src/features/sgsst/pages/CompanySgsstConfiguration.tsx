import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Save,
  Settings2,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useAuth } from "../../auth/context/AuthContext";
import {
  crearConfiguracionEmpresa,
  obtenerConfiguracionesEmpresa,
  obtenerEmpresaSgsst,
  obtenerMarcosSgsst,
} from "../api/sgsst.api";
import type {
  ConfiguracionSgsstEmpresa,
  MarcoSgsst,
} from "../types/sgsst.types";
import type { Company } from "../../../types/domain";

function fechaActual(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function CompanySgsstConfiguration() {
  const { empresaId = "" } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [empresa, setEmpresa] =
    useState<Company | null>(null);
  const [marcos, setMarcos] =
    useState<MarcoSgsst[]>([]);
  const [configuraciones, setConfiguraciones] =
    useState<ConfiguracionSgsstEmpresa[]>([]);

  const [marcoId, setMarcoId] = useState("");
  const [
    perfilAplicabilidadId,
    setPerfilAplicabilidadId,
  ] = useState("");
  const [vigenteDesde, setVigenteDesde] =
    useState(fechaActual());
  const [vigenteHasta, setVigenteHasta] =
    useState("");
  const [notas, setNotas] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    const cargar = async () => {
      if (!token || !empresaId) return;

      try {
        setLoading(true);
        setError("");

        const [
          empresaData,
          marcosData,
          configuracionesData,
        ] = await Promise.all([
          obtenerEmpresaSgsst(empresaId, token),
          obtenerMarcosSgsst(token),
          obtenerConfiguracionesEmpresa(
            empresaId,
            token
          ),
        ]);

        if (!active) return;

        setEmpresa(empresaData);
        setMarcos(marcosData);
        setConfiguraciones(configuracionesData);

        const activa = configuracionesData.find(
          (configuracion) =>
            configuracion.activo
        );

        const marcoInicial =
          activa?.marcoId ??
          marcosData[0]?.id ??
          "";

        setMarcoId(marcoInicial);

        if (activa) {
          setPerfilAplicabilidadId(
            activa.perfilAplicabilidadId
          );
          setVigenteDesde(
            activa.vigenteDesde.slice(0, 10)
          );
          setVigenteHasta(
            activa.vigenteHasta?.slice(0, 10) ??
              ""
          );
          setNotas(activa.notas ?? "");
        }
      } catch (requestError) {
        if (!active) return;

        setError(
          requestError instanceof Error
            ? requestError.message
            : "No fue posible cargar la configuración."
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
  }, [token, empresaId]);

  const marcoSeleccionado = useMemo(
    () =>
      marcos.find(
        (marco) => marco.id === marcoId
      ) ?? null,
    [marcos, marcoId]
  );

  useEffect(() => {
    if (
      !marcoSeleccionado?.perfilesAplicabilidad?.some(
        (perfil) =>
          perfil.id === perfilAplicabilidadId
      )
    ) {
      setPerfilAplicabilidadId(
        marcoSeleccionado
          ?.perfilesAplicabilidad?.[0]?.id ??
          ""
      );
    }
  }, [
    marcoSeleccionado,
    perfilAplicabilidadId,
  ]);

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (
      !token ||
      !empresaId ||
      !marcoId ||
      !perfilAplicabilidadId
    ) {
      setError(
        "Selecciona el marco y el perfil de aplicabilidad."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const creada =
        await crearConfiguracionEmpresa(
          empresaId,
          {
            marcoId,
            perfilAplicabilidadId,
            vigenteDesde,
            vigenteHasta:
              vigenteHasta || null,
            notas: notas || null,
          },
          token
        );

      setConfiguraciones((current) => [
        creada,
        ...current.map((item) => ({
          ...item,
          activo: false,
        })),
      ]);

      setSuccess(
        "La configuración SG-SST quedó activa."
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible guardar la configuración."
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/dashboard/sgsst"
            className="mb-3 inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Volver al módulo SG-SST
          </Link>

          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Configuración SG-SST
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            {empresa?.name ?? "Empresa"} · NIT{" "}
            {empresa?.taxId ?? ""}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/dashboard/sgsst/evaluaciones?empresaId=${empresaId}`
            )
          }
          className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-700 px-4 text-sm font-medium text-neutral-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
        >
          Ver evaluaciones
        </button>
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

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0"
          />
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-neutral-800 bg-[#101010]"
      >
        <div className="flex items-center gap-3 border-b border-neutral-800 p-5 sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Settings2 size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Perfil aplicable
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Define qué catálogo y cantidad de
              estándares se aplicarán.
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <label className="space-y-2">
            <span className="text-sm font-medium text-neutral-300">
              Marco SG-SST
            </span>

            <select
              value={marcoId}
              onChange={(event) =>
                setMarcoId(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none transition focus:border-cyan-500"
              required
            >
              <option value="">
                Selecciona un marco
              </option>

              {marcos.map((marco) => (
                <option
                  key={marco.id}
                  value={marco.id}
                >
                  {marco.nombre} · {marco.version}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-neutral-300">
              Perfil de aplicabilidad
            </span>

            <select
              value={perfilAplicabilidadId}
              onChange={(event) =>
                setPerfilAplicabilidadId(
                  event.target.value
                )
              }
              className="h-11 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none transition focus:border-cyan-500"
              required
            >
              <option value="">
                Selecciona un perfil
              </option>

              {marcoSeleccionado
                ?.perfilesAplicabilidad?.map(
                  (perfil) => (
                    <option
                      key={perfil.id}
                      value={perfil.id}
                    >
                      {perfil.nombre}
                    </option>
                  )
                )}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-neutral-300">
              Vigente desde
            </span>

            <input
              type="date"
              value={vigenteDesde}
              onChange={(event) =>
                setVigenteDesde(
                  event.target.value
                )
              }
              className="h-11 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none transition focus:border-cyan-500"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-neutral-300">
              Vigente hasta
            </span>

            <input
              type="date"
              value={vigenteHasta}
              onChange={(event) =>
                setVigenteHasta(
                  event.target.value
                )
              }
              className="h-11 w-full rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 text-sm text-white outline-none transition focus:border-cyan-500"
            />
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-neutral-300">
              Notas
            </span>

            <textarea
              value={notas}
              onChange={(event) =>
                setNotas(event.target.value)
              }
              rows={4}
              placeholder="Observaciones sobre la configuración..."
              className="w-full resize-y rounded-xl border border-neutral-700 bg-[#0b0b0b] px-3 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-cyan-500"
            />
          </label>
        </div>

        <div className="flex justify-end border-t border-neutral-800 p-5 sm:p-6">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Save size={18} />
            )}

            Guardar configuración
          </button>
        </div>
      </form>

      <section className="rounded-3xl border border-neutral-800 bg-[#101010]">
        <div className="border-b border-neutral-800 p-5 sm:p-6">
          <h2 className="font-semibold text-white">
            Historial de configuraciones
          </h2>
        </div>

        <div className="divide-y divide-neutral-800">
          {configuraciones.length === 0 ? (
            <p className="p-5 text-sm text-neutral-500">
              No hay configuraciones registradas.
            </p>
          ) : (
            configuraciones.map((configuracion) => (
              <article
                key={configuracion.id}
                className="grid gap-3 p-5 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-white">
                      {
                        configuracion
                          .perfilAplicabilidad
                          .nombre
                      }
                    </p>

                    {configuracion.activo && (
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                        ACTIVA
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-neutral-500">
                    {configuracion.marco.nombre} ·
                    Desde{" "}
                    {configuracion.vigenteDesde.slice(
                      0,
                      10
                    )}
                  </p>
                </div>

                <p className="text-xs text-neutral-500">
                  {
                    configuracion._count
                      ?.evaluaciones
                  }{" "}
                  evaluación(es)
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
