import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Loader2,
} from "lucide-react";

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
  versionSupermatrizId: number;
  onClose: () => void;
  onSave: (
    payload: MatrixTaskPayload
  ) => Promise<unknown>;
}

const inputClass =
  "w-full rounded-xl border border-neutral-800 bg-[#090909] px-3 py-2.5 text-sm text-white outline-none [color-scheme:dark] placeholder:text-neutral-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10";

export default function SupermatrizTaskModal({
  open,
  task,
  catalogs,
  versionSupermatrizId,
  onClose,
  onSave,
}: Props) {
  const [
    aspectId,
    setAspectId,
  ] = useState("");
  const [
    processId,
    setProcessId,
  ] = useState("");
  const [code, setCode] =
    useState("");
  const [order, setOrder] =
    useState("1");
  const [
    execution,
    setExecution,
  ] = useState("");
  const [supports, setSupports] =
    useState("");
  const [
    responsible,
    setResponsible,
  ] = useState("");
  const [goal, setGoal] =
    useState("");
  const [resources, setResources] =
    useState("");
  const [status, setStatus] =
    useState<RecordStatus>("ACTIVO");
  const [
    managementCategoryIds,
    setManagementCategoryIds,
  ] = useState<number[]>([]);
  const [saving, setSaving] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setAspectId(
      task
        ? String(task.aspectoId)
        : ""
    );
    setProcessId(
      task
        ? String(task.procesoId)
        : ""
    );
    setCode(
      task?.codigo ?? ""
    );
    setOrder(
      String(task?.orden ?? 1)
    );
    setExecution(
      task?.ejecucion ?? ""
    );
    setSupports(
      task?.fundamentosSoportes ??
        ""
    );
    setResponsible(
      task?.responsableActividad ??
        ""
    );
    setGoal(
      task?.metasEstandar ??
        ""
    );
    setResources(
      task?.recursosAdministrativos ??
        ""
    );
    setStatus(
      task?.estado ?? "ACTIVO"
    );
    setManagementCategoryIds(
      task?.categoriasGestion.map(
        (item) =>
          item.categoriaGestionId
      ) ?? []
    );
    setError(null);
  }, [open, task]);

  const selectedAspect =
    useMemo(
      () =>
        catalogs.aspectos.find(
          (item) =>
            item.id ===
            Number(aspectId)
        ) ?? null,
      [
        catalogs.aspectos,
        aspectId,
      ]
    );

  const toggleCategory = (
    id: number
  ) => {
    setManagementCategoryIds(
      (current) =>
        current.includes(id)
          ? current.filter(
              (item) =>
                item !== id
            )
          : [...current, id]
    );
  };

  const submit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await onSave({
        versionSupermatrizId,
        aspectoId:
          Number(aspectId),
        procesoId:
          Number(processId),
        codigo:
          code.trim() || null,
        orden: Number(order),
        ejecucion:
          execution.trim() ||
          null,
        fundamentosSoportes:
          supports.trim() ||
          null,
        responsableActividad:
          responsible.trim() ||
          null,
        metasEstandar:
          goal.trim() || null,
        recursosAdministrativos:
          resources.trim() ||
          null,
        estado: status,
        categoriaGestionIds:
          managementCategoryIds,
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
      title={
        task
          ? "Editar fila de la Supermatriz"
          : "Nueva fila de la Supermatriz"
      }
      description="La fila vincula un aspecto y un proceso de la misma versión borrador."
      onClose={onClose}
      busy={saving}
      size="2xl"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="supermatriz-task-form"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50"
          >
            {saving && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Guardar fila
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
            <Field label="Proceso *">
              <AppSelect
                required
                value={processId}
                onChange={(event) =>
                  setProcessId(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Selecciona un proceso
                </option>
                {catalogs.procesos
                  .filter(
                    (item) =>
                      item.estado ===
                      "ACTIVO"
                  )
                  .map(
                    (process) => (
                      <option
                        key={
                          process.id
                        }
                        value={
                          process.id
                        }
                      >
                        {
                          process.nombre
                        }
                      </option>
                    )
                  )}
              </AppSelect>
            </Field>

            <Field label="Aspecto *">
              <AppSelect
                required
                value={aspectId}
                onChange={(event) =>
                  setAspectId(
                    event.target.value
                  )
                }
              >
                <option value="">
                  Selecciona un aspecto
                </option>
                {catalogs.aspectos
                  .filter(
                    (item) =>
                      item.estado ===
                      "ACTIVO"
                  )
                  .map(
                    (aspect) => (
                      <option
                        key={
                          aspect.id
                        }
                        value={
                          aspect.id
                        }
                      >
                        {aspect.codigo
                          ? `${aspect.codigo}. `
                          : ""}
                        {
                          aspect.nombre
                        }
                      </option>
                    )
                  )}
              </AppSelect>
            </Field>

            {selectedAspect && (
              <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4 md:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">
                  Contexto automático
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {
                    selectedAspect
                      .estandar
                      .categoriaEstandar
                      .cicloPhva
                      .nombre
                  }{" "}
                  ·{" "}
                  {
                    selectedAspect
                      .estandar
                      .nombre
                  }
                </p>
                <p className="mt-2 text-xs text-neutral-400">
                  {
                    selectedAspect
                      .planAccionEspecifico
                      ?.descripcion
                  }
                </p>
              </div>
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-sm font-bold text-white">
            Datos de la fila
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Código">
              <input
                value={code}
                onChange={(event) =>
                  setCode(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </Field>

            <Field label="Orden *">
              <input
                required
                type="number"
                min={0}
                value={order}
                onChange={(event) =>
                  setOrder(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </Field>

            <Field
              label="Responsable sugerido"
              spanTwo
            >
              <input
                value={responsible}
                onChange={(event) =>
                  setResponsible(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </Field>

            <Field
              label="Ejecución"
              spanTwo
            >
              <textarea
                rows={3}
                value={execution}
                onChange={(event) =>
                  setExecution(
                    event.target.value
                  )
                }
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field
              label="Fundamentos y soportes"
              spanTwo
            >
              <textarea
                rows={3}
                value={supports}
                onChange={(event) =>
                  setSupports(
                    event.target.value
                  )
                }
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field
              label="Metas"
              spanTwo
            >
              <textarea
                rows={2}
                value={goal}
                onChange={(event) =>
                  setGoal(
                    event.target.value
                  )
                }
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field
              label="Recursos administrativos"
              spanTwo
            >
              <textarea
                rows={2}
                value={resources}
                onChange={(event) =>
                  setResources(
                    event.target.value
                  )
                }
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-sm font-bold text-white">
            Categorías de gestión
          </h3>
          <div className="grid gap-2 sm:grid-cols-3">
            {catalogs.categoriasGestion.map(
              (category) => (
                <label
                  key={
                    category.id
                  }
                  className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-[#0b0b0b] px-4 py-3 text-sm text-neutral-300"
                >
                  <input
                    type="checkbox"
                    checked={managementCategoryIds.includes(
                      category.id
                    )}
                    onChange={() =>
                      toggleCategory(
                        category.id
                      )
                    }
                  />
                  {
                    category.nombre
                  }
                </label>
              )
            )}
          </div>
        </section>

        <Field label="Estado">
          <AppSelect
            value={status}
            onChange={(event) =>
              setStatus(
                event.target
                  .value as RecordStatus
              )
            }
          >
            <option value="ACTIVO">
              Activo
            </option>
            <option value="INACTIVO">
              Inactivo
            </option>
          </AppSelect>
        </Field>
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
  children: ReactNode;
  spanTwo?: boolean;
}) {
  return (
    <label
      className={
        spanTwo
          ? "md:col-span-2"
          : ""
      }
    >
      <span className="mb-1.5 block text-xs font-medium text-neutral-400">
        {label}
      </span>
      {children}
    </label>
  );
}
