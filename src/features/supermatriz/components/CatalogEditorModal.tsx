import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  Loader2,
} from "lucide-react";

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

type CurrentRecord =
  | PhvaCycle
  | StandardCategory
  | Standard
  | ProcessCatalog
  | null;

interface Props {
  open: boolean;
  kind: CatalogEditorKind;
  current: CurrentRecord;
  versionSupermatrizId: number;
  catalogs: MatrixCatalogs;
  onClose: () => void;
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

const titles: Record<
  CatalogEditorKind,
  string
> = {
  ciclo: "ciclo PHVA",
  categoria:
    "categoría del estándar",
  estandar: "estándar",
  proceso: "proceso",
};

export default function CatalogEditorModal({
  open,
  kind,
  current,
  versionSupermatrizId,
  catalogs,
  onClose,
  onSaveCycle,
  onSaveCategory,
  onSaveStandard,
  onSaveProcess,
}: Props) {
  const [code, setCode] =
    useState("");
  const [name, setName] =
    useState("");
  const [
    description,
    setDescription,
  ] = useState("");
  const [order, setOrder] =
    useState("1");
  const [
    percentage,
    setPercentage,
  ] = useState("");
  const [parentId, setParentId] =
    useState("");
  const [
    ministerialGroupIds,
    setMinisterialGroupIds,
  ] = useState<number[]>([]);
  const [status, setStatus] =
    useState<RecordStatus>("ACTIVO");
  const [saving, setSaving] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setCode(
      current?.codigo ?? ""
    );
    setName(
      current?.nombre ?? ""
    );
    setDescription(
      "descripcion" in
        (current ?? {})
        ? (current as {
            descripcion:
              | string
              | null;
          }).descripcion ?? ""
        : ""
    );
    setOrder(
      "orden" in (current ?? {})
        ? String(
            (
              current as {
                orden: number;
              }
            ).orden
          )
        : "1"
    );
    setStatus(
      current?.estado ??
        "ACTIVO"
    );

    if (kind === "ciclo") {
      setPercentage(
        String(
          (
            current as
              | PhvaCycle
              | null
          )?.porcentajeEsperado ??
            ""
        )
      );
      setParentId("");
      setMinisterialGroupIds(
        []
      );
    }

    if (kind === "categoria") {
      const category =
        current as
          | StandardCategory
          | null;

      setParentId(
        category
          ? String(
              category.cicloPhvaId
            )
          : ""
      );
      setPercentage(
        String(
          category?.porcentajeEsperado ??
            ""
        )
      );
      setMinisterialGroupIds(
        []
      );
    }

    if (kind === "estandar") {
      const standard =
        current as
          | Standard
          | null;

      setParentId(
        standard
          ? String(
              standard.categoriaEstandarId
            )
          : ""
      );
      setPercentage(
        String(
          standard?.calificacionMinisterialEsperada ??
            "0.5"
        )
      );
      setMinisterialGroupIds(
        standard?.gruposMinisteriales.map(
          (item) =>
            item.grupoMinisterialId
        ) ?? []
      );
    }

    if (kind === "proceso") {
      setParentId("");
      setPercentage("");
      setMinisterialGroupIds(
        []
      );
    }

    setError(null);
  }, [open, current, kind]);

  const toggleGroup = (
    id: number
  ) => {
    setMinisterialGroupIds(
      (currentIds) =>
        currentIds.includes(id)
          ? currentIds.filter(
              (item) =>
                item !== id
            )
          : [
              ...currentIds,
              id,
            ]
    );
  };

  const submit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (kind === "ciclo") {
        await onSaveCycle(
          current as PhvaCycle | null,
          {
            versionSupermatrizId,
            codigo:
              code.trim().toUpperCase(),
            nombre: name.trim(),
            orden: Number(order),
            porcentajeEsperado:
              percentage
                ? Number(
                    percentage
                  )
                : null,
            estado: status,
          }
        );
      }

      if (kind === "categoria") {
        await onSaveCategory(
          current as
            | StandardCategory
            | null,
          {
            versionSupermatrizId,
            cicloPhvaId:
              Number(parentId),
            codigo:
              code.trim() ||
              null,
            nombre: name.trim(),
            descripcion:
              description.trim() ||
              null,
            orden: Number(order),
            porcentajeEsperado:
              percentage
                ? Number(
                    percentage
                  )
                : null,
            estado: status,
          }
        );
      }

      if (kind === "estandar") {
        await onSaveStandard(
          current as
            | Standard
            | null,
          {
            versionSupermatrizId,
            categoriaEstandarId:
              Number(parentId),
            codigo:
              code.trim() ||
              null,
            nombre: name.trim(),
            descripcion:
              description.trim() ||
              null,
            orden: Number(order),
            calificacionMinisterialEsperada:
              percentage
                ? Number(
                    percentage
                  )
                : null,
            estado: status,
            grupoMinisterialIds:
              ministerialGroupIds,
          }
        );
      }

      if (kind === "proceso") {
        await onSaveProcess(
          current as
            | ProcessCatalog
            | null,
          {
            versionSupermatrizId,
            codigo:
              code.trim() ||
              null,
            nombre: name.trim(),
            descripcion:
              description.trim() ||
              null,
            estado: status,
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
  };

  const title = `${
    current ? "Editar" : "Nuevo"
  } ${titles[kind]}`;

  return (
    <AppModal
      open={open}
      title={title}
      description="Los cambios solo se permiten en versiones en estado BORRADOR."
      onClose={onClose}
      busy={saving}
      size="lg"
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
            form="catalog-editor-form"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50"
          >
            {saving && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Guardar
          </button>
        </div>
      }
    >
      <form
        id="catalog-editor-form"
        onSubmit={submit}
        className="space-y-4"
      >
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {(kind ===
          "categoria" ||
          kind ===
            "estandar") && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-neutral-400">
              {kind ===
              "categoria"
                ? "Ciclo PHVA *"
                : "Categoría del estándar *"}
            </span>

            <AppSelect
              required
              value={parentId}
              onChange={(event) =>
                setParentId(
                  event.target.value
                )
              }
            >
              <option value="">
                Selecciona una opción
              </option>

              {kind ===
              "categoria"
                ? catalogs.ciclosPhva.map(
                    (item) => (
                      <option
                        key={
                          item.id
                        }
                        value={
                          item.id
                        }
                      >
                        {
                          item.nombre
                        }
                      </option>
                    )
                  )
                : catalogs.categoriasEstandar.map(
                    (item) => (
                      <option
                        key={
                          item.id
                        }
                        value={
                          item.id
                        }
                      >
                        {
                          item
                            .cicloPhva
                            .nombre
                        }{" "}
                        ·{" "}
                        {
                          item.nombre
                        }
                      </option>
                    )
                  )}
            </AppSelect>
          </label>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-xs font-medium text-neutral-400">
              Código
              {kind ===
                "ciclo" &&
                " *"}
            </span>
            <input
              required={
                kind ===
                "ciclo"
              }
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
          </label>

          <label>
            <span className="mb-1.5 block text-xs font-medium text-neutral-400">
              Nombre *
            </span>
            <input
              required
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              className={
                inputClass
              }
            />
          </label>
        </div>

        {kind !== "ciclo" && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-neutral-400">
              Descripción
            </span>
            <textarea
              rows={3}
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              className={`${inputClass} resize-y`}
            />
          </label>
        )}

        {kind !== "proceso" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-xs font-medium text-neutral-400">
                Orden *
              </span>
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
            </label>

            <label>
              <span className="mb-1.5 block text-xs font-medium text-neutral-400">
                {kind ===
                "estandar"
                  ? "Calificación ministerial"
                  : "Porcentaje esperado"}
              </span>
              <input
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={percentage}
                onChange={(event) =>
                  setPercentage(
                    event.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </label>
          </div>
        )}

        {kind === "estandar" && (
          <fieldset className="rounded-xl border border-neutral-800 bg-[#0b0b0b] p-4">
            <legend className="px-2 text-xs font-semibold text-neutral-400">
              Grupos ministeriales
            </legend>

            <div className="grid gap-2 sm:grid-cols-3">
              {catalogs.gruposMinisteriales.map(
                (group) => (
                  <label
                    key={
                      group.id
                    }
                    className="flex items-center gap-2 rounded-lg border border-neutral-800 px-3 py-2 text-xs text-neutral-300"
                  >
                    <input
                      type="checkbox"
                      checked={ministerialGroupIds.includes(
                        group.id
                      )}
                      onChange={() =>
                        toggleGroup(
                          group.id
                        )
                      }
                    />
                    {
                      group.nombre
                    }
                  </label>
                )
              )}
            </div>
          </fieldset>
        )}

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-neutral-400">
            Estado
          </span>
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
        </label>
      </form>
    </AppModal>
  );
}
