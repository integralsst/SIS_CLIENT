import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { Loader2 } from "lucide-react";

import AppModal from "../../../components/ui/AppModal";
import AppSelect from "../../../components/ui/AppSelect";
import type {
  MatrixCatalogs,
  MatrixTask,
  MatrixTaskPayload,
  RecordStatus,
} from "../types/supermatriz.types";

interface Props {
  open: boolean;
  task: MatrixTask | null;
  catalogs: MatrixCatalogs;
  defaultVersionId: string;
  onClose: () => void;
  onSave: (payload: MatrixTaskPayload) => Promise<void>;
}

interface FormState {
  versionSupermatrizId: string;
  aspectoId: string;
  procesoId: string;
  codigo: string;
  orden: string;
  ejecucion: string;
  fundamentosSoportes: string;
  responsableActividad: string;
  metasEstandar: string;
  recursosAdministrativos: string;
  estado: RecordStatus;
  categoriaGestionIds: number[];
}

const inputClass =
  "w-full rounded-xl border border-neutral-800 bg-[#090909] px-3 py-2.5 text-sm text-white outline-none transition-all [color-scheme:dark] placeholder:text-neutral-600 hover:border-neutral-700 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10";

function createEmptyForm(defaultVersionId: string): FormState {
  return {
    versionSupermatrizId: defaultVersionId,
    aspectoId: "",
    procesoId: "",
    codigo: "",
    orden: "1",
    ejecucion: "",
    fundamentosSoportes: "",
    responsableActividad: "",
    metasEstandar: "",
    recursosAdministrativos: "",
    estado: "ACTIVO",
    categoriaGestionIds: [],
  };
}

export default function SupermatrizTaskModal({
  open,
  task,
  catalogs,
  defaultVersionId,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<FormState>(() =>
    createEmptyForm(defaultVersionId)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    if (task) {
      setForm({
        versionSupermatrizId: String(task.versionSupermatrizId),
        aspectoId: String(task.aspectoId),
        procesoId: String(task.procesoId),
        codigo: task.codigo ?? "",
        orden: String(task.orden),
        ejecucion: task.ejecucion ?? "",
        fundamentosSoportes: task.fundamentosSoportes ?? "",
        responsableActividad: task.responsableActividad ?? "",
        metasEstandar: task.metasEstandar ?? "",
        recursosAdministrativos: task.recursosAdministrativos ?? "",
        estado: task.estado,
        categoriaGestionIds: task.categoriasGestion.map(
          (item) => item.categoriaGestionId
        ),
      });
    } else {
      setForm(createEmptyForm(defaultVersionId));
    }

    setError(null);
  }, [open, task, defaultVersionId]);

  const selectedAspect = useMemo(
    () =>
      catalogs.aspectos.find(
        (item) => item.id === Number(form.aspectoId)
      ) ?? null,
    [catalogs.aspectos, form.aspectoId]
  );

  const update = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleCategory = (id: number) => {
    setForm((current) => ({
      ...current,
      categoriaGestionIds: current.categoriaGestionIds.includes(id)
        ? current.categoriaGestionIds.filter((item) => item !== id)
        : [...current.categoriaGestionIds, id],
    }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await onSave({
        versionSupermatrizId: Number(form.versionSupermatrizId),
        aspectoId: Number(form.aspectoId),
        procesoId: Number(form.procesoId),
        codigo: form.codigo.trim() || null,
        orden: Number(form.orden),
        ejecucion: form.ejecucion.trim() || null,
        fundamentosSoportes:
          form.fundamentosSoportes.trim() || null,
        responsableActividad:
          form.responsableActividad.trim() || null,
        metasEstandar: form.metasEstandar.trim() || null,
        recursosAdministrativos:
          form.recursosAdministrativos.trim() || null,
        estado: form.estado,
        categoriaGestionIds: form.categoriaGestionIds,
      });
      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible guardar la fila."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppModal
      open={open}
      title={task ? "Editar fila de la Supermatriz" : "Nueva fila de la Supermatriz"}
      description="La identidad funcional combina versión, aspecto y proceso."
      onClose={onClose}
      busy={saving}
      size="2xl"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-300 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="supermatriz-task-form"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {task ? "Guardar cambios" : "Crear fila"}
          </button>
        </div>
      }
    >
      <form
        id="supermatriz-task-form"
        onSubmit={submit}
        className="space-y-7"
      >
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <section>
          <h3 className="mb-4 text-sm font-bold text-white">
            Relación maestra
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Versión *">
              <AppSelect
                required
                value={form.versionSupermatrizId}
                onChange={(event) =>
                  update("versionSupermatrizId", event.target.value)
                }
              >
                <option value="">Selecciona una versión</option>
                {catalogs.versiones
                  .filter((version) => version.estado !== "CERRADA")
                  .map((version) => (
                    <option key={version.id} value={version.id}>
                      {version.nombre} · {version.estado}
                    </option>
                  ))}
              </AppSelect>
            </Field>

            <Field label="Proceso *">
              <AppSelect
                required
                value={form.procesoId}
                onChange={(event) => update("procesoId", event.target.value)}
              >
                <option value="">Selecciona un proceso</option>
                {catalogs.procesos.map((process) => (
                  <option key={process.id} value={process.id}>
                    {process.nombre}
                  </option>
                ))}
              </AppSelect>
            </Field>

            <Field label="Aspecto *" spanTwo>
              <AppSelect
                required
                value={form.aspectoId}
                onChange={(event) => update("aspectoId", event.target.value)}
              >
                <option value="">Selecciona un aspecto</option>
                {catalogs.aspectos.map((aspect) => (
                  <option key={aspect.id} value={aspect.id}>
                    {aspect.codigo ? `${aspect.codigo}. ` : ""}
                    {aspect.nombre} — {aspect.estandar.nombre}
                  </option>
                ))}
              </AppSelect>
            </Field>

            {selectedAspect && (
              <div className="md:col-span-2 rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">
                  Plan de acción asociado
                </p>
                <p className="mt-2 text-xs leading-6 text-neutral-300">
                  {selectedAspect.planAccionEspecifico?.descripcion ??
                    "Este aspecto todavía no tiene plan de acción."}
                </p>
              </div>
            )}

            <Field label="Código">
              <input
                value={form.codigo}
                onChange={(event) => update("codigo", event.target.value)}
                placeholder="Ej. SM-000001"
                className={inputClass}
              />
            </Field>

            <Field label="Orden visual *">
              <input
                required
                type="number"
                min="0"
                value={form.orden}
                onChange={(event) => update("orden", event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-sm font-bold text-white">
            Categorías de gestión
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {catalogs.categoriasGestion.map((category) => {
              const active = form.categoriaGestionIds.includes(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={`rounded-xl border px-4 py-3 text-left text-xs transition-colors ${
                    active
                      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                      : "border-neutral-800 bg-[#090909] text-neutral-400"
                  }`}
                >
                  {category.nombre}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-sm font-bold text-white">
            Información operativa
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Responsable sugerido" spanTwo>
              <input
                value={form.responsableActividad}
                onChange={(event) =>
                  update("responsableActividad", event.target.value)
                }
                className={inputClass}
              />
            </Field>
            <Field label="Ejecución" spanTwo>
              <textarea
                rows={3}
                value={form.ejecucion}
                onChange={(event) => update("ejecucion", event.target.value)}
                className={`${inputClass} resize-y`}
              />
            </Field>
            <Field label="Fundamentos y soportes" spanTwo>
              <textarea
                rows={3}
                value={form.fundamentosSoportes}
                onChange={(event) =>
                  update("fundamentosSoportes", event.target.value)
                }
                className={`${inputClass} resize-y`}
              />
            </Field>
            <Field label="Metas del estándar">
              <textarea
                rows={4}
                value={form.metasEstandar}
                onChange={(event) =>
                  update("metasEstandar", event.target.value)
                }
                className={`${inputClass} resize-y`}
              />
            </Field>
            <Field label="Recursos administrativos">
              <textarea
                rows={4}
                value={form.recursosAdministrativos}
                onChange={(event) =>
                  update("recursosAdministrativos", event.target.value)
                }
                className={`${inputClass} resize-y`}
              />
            </Field>
            {task && (
              <Field label="Estado" spanTwo>
                <AppSelect
                  value={form.estado}
                  onChange={(event) =>
                    update("estado", event.target.value as RecordStatus)
                  }
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </AppSelect>
              </Field>
            )}
          </div>
        </section>
      </form>
    </AppModal>
  );
}

function Field({
  label,
  children,
  spanTwo = false,
}: {
  label: string;
  children: React.ReactNode;
  spanTwo?: boolean;
}) {
  return (
    <label className={spanTwo ? "md:col-span-2" : ""}>
      <span className="mb-1.5 block text-xs font-medium text-neutral-400">
        {label}
      </span>
      {children}
    </label>
  );
}
