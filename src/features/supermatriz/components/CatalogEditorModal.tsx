import {
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import AppModal from "../../../components/ui/AppModal";
import AppSelect from "../../../components/ui/AppSelect";

import type {
  CyclePayload,
  MatrixCatalogs,
  PhvaCycle,
  ProcessCatalog,
  ProcessPayload,
  RecordStatus,
  Standard,
  StandardCategory,
  StandardCategoryPayload,
  StandardPayload,
} from "../types/supermatriz.types";

export type CatalogEditorKind =
  | "ciclo"
  | "categoria"
  | "estandar"
  | "proceso";

export type CatalogEditorRecord =
  | PhvaCycle
  | StandardCategory
  | Standard
  | ProcessCatalog;

type CurrentRecord = CatalogEditorRecord | null;

interface Props {
  open: boolean;
  kind: CatalogEditorKind;
  current: CurrentRecord;
  versionSupermatrizId: number;
  catalogs: MatrixCatalogs;
  initialParentId?: number | null;
  onClose: () => void;
  onDeactivate?: () => Promise<unknown>;
  onSaveCycle: (
    current: PhvaCycle | null,
    payload: CyclePayload
  ) => Promise<unknown>;
  onSaveCategory: (
    current: StandardCategory | null,
    payload: StandardCategoryPayload
  ) => Promise<unknown>;
  onSaveStandard: (
    current: Standard | null,
    payload: StandardPayload
  ) => Promise<unknown>;
  onSaveProcess: (
    current: ProcessCatalog | null,
    payload: ProcessPayload
  ) => Promise<unknown>;
}

const inputClass =
  "w-full rounded-xl border border-neutral-800 bg-[#090909] px-3 py-2.5 text-sm text-white outline-none [color-scheme:dark] placeholder:text-neutral-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10";

const titles: Record<CatalogEditorKind, string> = {
  ciclo: "ciclo PHVA",
  categoria: "categoría del estándar",
  estandar: "estándar",
  proceso: "proceso",
};

const descriptions: Record<CatalogEditorKind, string> = {
  ciclo:
    "El ciclo es el nivel superior de la estructura. Normalmente corresponde a Planear, Hacer, Verificar o Actuar.",
  categoria:
    "La categoría agrupa estándares dentro de un ciclo PHVA y puede tener un porcentaje esperado.",
  estandar:
    "El estándar contiene uno o varios aspectos y define en qué grupos 7, 21 o 60 debe aparecer.",
  proceso:
    "El proceso se conecta con los aspectos por medio de las filas de la Supermatriz.",
};

interface FormState {
  code: string;
  name: string;
  description: string;
  order: string;
  percentage: string;
  parentId: string;
  ministerialGroupIds: number[];
  status: RecordStatus;
}

const EMPTY_FORM: FormState = {
  code: "",
  name: "",
  description: "",
  order: "1",
  percentage: "",
  parentId: "",
  ministerialGroupIds: [],
  status: "ACTIVO",
};

export default function CatalogEditorModal({
  open,
  kind,
  current,
  versionSupermatrizId,
  catalogs,
  initialParentId = null,
  onClose,
  onDeactivate,
  onSaveCycle,
  onSaveCategory,
  onSaveStandard,
  onSaveProcess,
}: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestedOrder = useMemo(() => {
    const orders =
      kind === "ciclo"
        ? catalogs.ciclosPhva.map((item) => item.orden)
        : kind === "categoria"
          ? catalogs.categoriasEstandar
              .filter(
                (item) =>
                  !initialParentId ||
                  item.cicloPhvaId === initialParentId
              )
              .map((item) => item.orden)
          : kind === "estandar"
            ? catalogs.estandares
                .filter(
                  (item) =>
                    !initialParentId ||
                    item.categoriaEstandarId ===
                      initialParentId
                )
                .map((item) => item.orden)
            : [];

    return Math.max(0, ...orders) + 1;
  }, [
    catalogs.categoriasEstandar,
    catalogs.ciclosPhva,
    catalogs.estandares,
    initialParentId,
    kind,
  ]);

  useEffect(() => {
    if (!open) return;

    const next: FormState = {
      ...EMPTY_FORM,
      code: current?.codigo ?? "",
      name: current?.nombre ?? "",
      description:
        current && "descripcion" in current
          ? current.descripcion ?? ""
          : "",
      order:
        current && "orden" in current
          ? String(current.orden)
          : String(suggestedOrder),
      status: current?.estado ?? "ACTIVO",
    };

    if (kind === "ciclo") {
      const cycle = current as PhvaCycle | null;
      next.percentage = String(
        cycle?.porcentajeEsperado ?? ""
      );
    }

    if (kind === "categoria") {
      const category = current as StandardCategory | null;
      next.parentId = category
        ? String(category.cicloPhvaId)
        : initialParentId
          ? String(initialParentId)
          : "";
      next.percentage = String(
        category?.porcentajeEsperado ?? ""
      );
    }

    if (kind === "estandar") {
      const standard = current as Standard | null;
      next.parentId = standard
        ? String(standard.categoriaEstandarId)
        : initialParentId
          ? String(initialParentId)
          : "";
      next.percentage = String(
        standard?.calificacionMinisterialEsperada ?? 0.5
      );
      next.ministerialGroupIds =
        standard?.gruposMinisteriales.map(
          (item) => item.grupoMinisterialId
        ) ?? [];
    }

    setForm(next);
    setSaving(false);
    setDeactivating(false);
    setError(null);
  }, [
    open,
    current,
    initialParentId,
    kind,
    suggestedOrder,
  ]);

  function patch(patchValue: Partial<FormState>) {
    setForm((currentForm) => ({
      ...currentForm,
      ...patchValue,
    }));
    setError(null);
  }

  function toggleGroup(id: number) {
    patch({
      ministerialGroupIds:
        form.ministerialGroupIds.includes(id)
          ? form.ministerialGroupIds.filter(
              (item) => item !== id
            )
          : [...form.ministerialGroupIds, id],
    });
  }

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Escribe un nombre para continuar.");
      return;
    }

    if (
      (kind === "categoria" || kind === "estandar") &&
      !form.parentId
    ) {
      setError(
        kind === "categoria"
          ? "Selecciona el ciclo PHVA al que pertenecerá la categoría."
          : "Selecciona la categoría que contendrá el estándar."
      );
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (kind === "ciclo") {
        await onSaveCycle(current as PhvaCycle | null, {
          versionSupermatrizId,
          codigo: form.code.trim().toUpperCase(),
          nombre: form.name.trim(),
          orden: Number(form.order),
          porcentajeEsperado: form.percentage
            ? Number(form.percentage)
            : null,
          estado: form.status,
        });
      }

      if (kind === "categoria") {
        await onSaveCategory(
          current as StandardCategory | null,
          {
            versionSupermatrizId,
            cicloPhvaId: Number(form.parentId),
            codigo: form.code.trim() || null,
            nombre: form.name.trim(),
            descripcion:
              form.description.trim() || null,
            orden: Number(form.order),
            porcentajeEsperado: form.percentage
              ? Number(form.percentage)
              : null,
            estado: form.status,
          }
        );
      }

      if (kind === "estandar") {
        await onSaveStandard(current as Standard | null, {
          versionSupermatrizId,
          categoriaEstandarId: Number(form.parentId),
          codigo: form.code.trim() || null,
          nombre: form.name.trim(),
          descripcion:
            form.description.trim() || null,
          orden: Number(form.order),
          calificacionMinisterialEsperada:
            form.percentage
              ? Number(form.percentage)
              : null,
          estado: form.status,
          grupoMinisterialIds:
            form.ministerialGroupIds,
        });
      }

      if (kind === "proceso") {
        await onSaveProcess(
          current as ProcessCatalog | null,
          {
            versionSupermatrizId,
            codigo: form.code.trim() || null,
            nombre: form.name.trim(),
            descripcion:
              form.description.trim() || null,
            estado: form.status,
          }
        );
      }

      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible guardar el registro."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deactivateCurrent() {
    if (!onDeactivate || !current) return;

    setDeactivating(true);
    setError(null);

    try {
      const result = await onDeactivate();
      if (result === false) return;
      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible desactivar el registro."
      );
    } finally {
      setDeactivating(false);
    }
  }

  const title = `${current ? "Editar" : "Crear"} ${titles[kind]}`;
  const busy = saving || deactivating;

  return (
    <AppModal
      open={open}
      title={title}
      description={descriptions[kind]}
      onClose={onClose}
      busy={busy}
      size="lg"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {current && onDeactivate && (
              <button
                type="button"
                onClick={() => void deactivateCurrent()}
                disabled={busy}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 disabled:opacity-50"
              >
                {deactivating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Desactivar
              </button>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-xl border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-300 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              form="catalog-editor-form"
              disabled={busy}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50"
            >
              {saving && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Guardar
            </button>
          </div>
        </div>
      }
    >
      <form
        id="catalog-editor-form"
        onSubmit={submit}
        className="space-y-5"
      >
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4 text-xs leading-5 text-neutral-400">
          <strong className="text-cyan-300">
            Conexión automática:
          </strong>{" "}
          al guardar, el registro quedará disponible inmediatamente en los selectores y en las celdas de la matriz.
        </div>

        {(kind === "categoria" || kind === "estandar") && (
          <Field
            label={
              kind === "categoria"
                ? "Ciclo PHVA *"
                : "Categoría del estándar *"
            }
            help={
              kind === "categoria"
                ? "La categoría se mostrará dentro de este ciclo."
                : "El estándar se mostrará dentro de esta categoría."
            }
          >
            <AppSelect
              required
              value={form.parentId}
              onChange={(event) =>
                patch({ parentId: event.target.value })
              }
            >
              <option value="">
                Selecciona una opción
              </option>

              {kind === "categoria"
                ? catalogs.ciclosPhva
                    .filter((item) => item.estado === "ACTIVO")
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.codigo} · {item.nombre}
                      </option>
                    ))
                : catalogs.categoriasEstandar
                    .filter((item) => item.estado === "ACTIVO")
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.cicloPhva.nombre} · {item.nombre}
                      </option>
                    ))}
            </AppSelect>
          </Field>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={`Código${kind === "ciclo" ? " *" : ""}`}
            help="Identificador corto que ayuda a ubicar el registro en la matriz."
          >
            <input
              required={kind === "ciclo"}
              value={form.code}
              onChange={(event) =>
                patch({ code: event.target.value })
              }
              placeholder={
                kind === "ciclo"
                  ? "PLANEAR"
                  : "Ej. 111 o PR-01"
              }
              className={inputClass}
            />
          </Field>

          <Field label="Nombre *">
            <input
              required
              value={form.name}
              onChange={(event) =>
                patch({ name: event.target.value })
              }
              className={inputClass}
            />
          </Field>
        </div>

        {kind !== "ciclo" && (
          <Field
            label="Descripción"
            help="Explícalo en lenguaje sencillo. Esta ayuda aparecerá cuando el usuario consulte el registro."
          >
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) =>
                patch({ description: event.target.value })
              }
              className={`${inputClass} resize-y`}
            />
          </Field>
        )}

        {kind !== "proceso" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Orden *"
              help="Define la posición visual dentro de su nivel."
            >
              <input
                required
                type="number"
                min={0}
                value={form.order}
                onChange={(event) =>
                  patch({ order: event.target.value })
                }
                className={inputClass}
              />
            </Field>

            <Field
              label={
                kind === "estandar"
                  ? "Calificación ministerial"
                  : "Porcentaje esperado"
              }
              help={
                kind === "estandar"
                  ? "Normalmente 0,5 según la estructura ministerial."
                  : "Valor de referencia para reportes y distribución PHVA."
              }
            >
              <input
                type="number"
                min={0}
                max={kind === "estandar" ? 1 : 100}
                step="0.01"
                value={form.percentage}
                onChange={(event) =>
                  patch({ percentage: event.target.value })
                }
                className={inputClass}
              />
            </Field>
          </div>
        )}

        {kind === "estandar" && (
          <fieldset className="rounded-xl border border-neutral-800 bg-[#0b0b0b] p-4">
            <legend className="px-2 text-xs font-semibold text-neutral-400">
              ¿En qué reportes aparece?
            </legend>

            <p className="mb-3 text-xs leading-5 text-neutral-600">
              Marca 7, 21 y/o 60. Esta clasificación pertenece al estándar, no a la empresa.
            </p>

            <div className="grid gap-2 sm:grid-cols-3">
              {catalogs.gruposMinisteriales.map((group) => {
                const checked =
                  form.ministerialGroupIds.includes(group.id);

                return (
                  <label
                    key={group.id}
                    className={`cursor-pointer rounded-xl border px-3 py-3 text-xs transition-colors ${
                      checked
                        ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-200"
                        : "border-neutral-800 text-neutral-400 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleGroup(group.id)}
                      />
                      <span className="font-semibold">
                        {group.nombre}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>

            {form.ministerialGroupIds.length === 0 && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs leading-5 text-amber-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                El estándar se guardará, pero no aparecerá en los filtros 7, 21 o 60 hasta que selecciones por lo menos un grupo.
              </div>
            )}
          </fieldset>
        )}

        <Field label="Estado">
          <AppSelect
            value={form.status}
            onChange={(event) =>
              patch({
                status:
                  event.target.value as RecordStatus,
              })
            }
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </AppSelect>
        </Field>
      </form>
    </AppModal>
  );
}

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-300">
        {label}
      </span>
      {children}
      {help && (
        <span className="mt-1.5 block text-[11px] leading-5 text-neutral-600">
          {help}
        </span>
      )}
    </label>
  );
}
