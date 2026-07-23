import {
  useState,
  type FormEvent,
} from "react";

import type {
  MatrixCatalogs,
  PhvaCycle,
  Standard,
  StandardCategory,
} from "../../types/supermatriz.types";
import {
  Field,
  inputClass,
  QuickEditorShell,
} from "./GuidedRowShared";
import type {
  GuidedRowCatalogActions,
} from "./guidedRow.types";
import {
  errorText,
  readId,
} from "./guidedRow.utils";

export function CycleQuickForm({
  current,
  versionSupermatrizId,
  suggestedOrder,
  onCancel,
  onSave,
  onSaved,
}: {
  current: PhvaCycle | null;
  versionSupermatrizId: number;
  suggestedOrder: number;
  onCancel: () => void;
  onSave: GuidedRowCatalogActions["onSaveCycle"];
  onSaved: (id: number) => void;
}) {
  const [code, setCode] = useState(
    current?.codigo ?? ""
  );
  const [name, setName] = useState(
    current?.nombre ?? ""
  );
  const [order, setOrder] = useState(
    String(current?.orden ?? suggestedOrder)
  );
  const [percentage, setPercentage] =
    useState(
      String(
        current?.porcentajeEsperado ?? ""
      )
    );
  const [saving, setSaving] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const result = await onSave(current, {
        versionSupermatrizId,
        codigo: code.trim().toUpperCase(),
        nombre: name.trim(),
        orden: Number(order),
        porcentajeEsperado:
          percentage
            ? Number(percentage)
            : null,
        estado: current?.estado ?? "ACTIVO",
      });
      onSaved(
        current?.id ?? readId(result)
      );
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <QuickEditorShell
      title={
        current
          ? "Editar ciclo PHVA"
          : "Crear ciclo PHVA"
      }
      description="Define el nivel superior de la ruta."
      saving={saving}
      error={error}
      onCancel={onCancel}
      onSubmit={submit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Código *">
          <input
            required
            value={code}
            onChange={(event) =>
              setCode(event.target.value)
            }
            placeholder="PLANEAR"
            className={inputClass}
          />
        </Field>
        <Field label="Nombre *">
          <input
            required
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Planear"
            className={inputClass}
          />
        </Field>
        <Field label="Orden *">
          <input
            required
            type="number"
            min={0}
            value={order}
            onChange={(event) =>
              setOrder(event.target.value)
            }
            className={inputClass}
          />
        </Field>
        <Field label="Porcentaje esperado">
          <input
            type="number"
            min={0}
            max={100}
            step="0.01"
            value={percentage}
            onChange={(event) =>
              setPercentage(event.target.value)
            }
            className={inputClass}
          />
        </Field>
      </div>
    </QuickEditorShell>
  );
}

export function CategoryQuickForm({
  current,
  cycle,
  versionSupermatrizId,
  suggestedOrder,
  onCancel,
  onSave,
  onSaved,
}: {
  current: StandardCategory | null;
  cycle: PhvaCycle;
  versionSupermatrizId: number;
  suggestedOrder: number;
  onCancel: () => void;
  onSave: GuidedRowCatalogActions["onSaveCategory"];
  onSaved: (id: number) => void;
}) {
  const [code, setCode] = useState(
    current?.codigo ?? ""
  );
  const [name, setName] = useState(
    current?.nombre ?? ""
  );
  const [description, setDescription] =
    useState(current?.descripcion ?? "");
  const [order, setOrder] = useState(
    String(current?.orden ?? suggestedOrder)
  );
  const [percentage, setPercentage] =
    useState(
      String(
        current?.porcentajeEsperado ?? ""
      )
    );
  const [saving, setSaving] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const result = await onSave(current, {
        versionSupermatrizId,
        cicloPhvaId: cycle.id,
        codigo: code.trim() || null,
        nombre: name.trim(),
        descripcion:
          description.trim() || null,
        orden: Number(order),
        porcentajeEsperado:
          percentage
            ? Number(percentage)
            : null,
        estado: current?.estado ?? "ACTIVO",
      });
      onSaved(
        current?.id ?? readId(result)
      );
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <QuickEditorShell
      title={
        current
          ? "Editar categoría"
          : "Crear categoría"
      }
      description={`Quedará conectada al ciclo ${cycle.nombre}.`}
      saving={saving}
      error={error}
      onCancel={onCancel}
      onSubmit={submit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Código">
          <input
            value={code}
            onChange={(event) =>
              setCode(event.target.value)
            }
            className={inputClass}
          />
        </Field>
        <Field label="Orden *">
          <input
            required
            type="number"
            min={0}
            value={order}
            onChange={(event) =>
              setOrder(event.target.value)
            }
            className={inputClass}
          />
        </Field>
        <Field label="Nombre *" spanTwo>
          <input
            required
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className={inputClass}
          />
        </Field>
        <Field
          label="Descripción"
          spanTwo
        >
          <textarea
            rows={2}
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            className={`${inputClass} resize-y`}
          />
        </Field>
        <Field label="Porcentaje esperado">
          <input
            type="number"
            min={0}
            max={100}
            step="0.01"
            value={percentage}
            onChange={(event) =>
              setPercentage(event.target.value)
            }
            className={inputClass}
          />
        </Field>
      </div>
    </QuickEditorShell>
  );
}

export function StandardQuickForm({
  current,
  category,
  catalogs,
  versionSupermatrizId,
  suggestedOrder,
  onCancel,
  onSave,
  onSaved,
}: {
  current: Standard | null;
  category: StandardCategory;
  catalogs: MatrixCatalogs;
  versionSupermatrizId: number;
  suggestedOrder: number;
  onCancel: () => void;
  onSave: GuidedRowCatalogActions["onSaveStandard"];
  onSaved: (id: number) => void;
}) {
  const [code, setCode] = useState(
    current?.codigo ?? ""
  );
  const [name, setName] = useState(
    current?.nombre ?? ""
  );
  const [description, setDescription] =
    useState(current?.descripcion ?? "");
  const [order, setOrder] = useState(
    String(current?.orden ?? suggestedOrder)
  );
  const [score, setScore] = useState(
    String(
      current
        ?.calificacionMinisterialEsperada ??
        "0.5"
    )
  );
  const [groupIds, setGroupIds] =
    useState<number[]>(
      current?.gruposMinisteriales.map(
        (item) =>
          item.grupoMinisterialId
      ) ?? []
    );
  const [saving, setSaving] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const result = await onSave(current, {
        versionSupermatrizId,
        categoriaEstandarId:
          category.id,
        codigo: code.trim() || null,
        nombre: name.trim(),
        descripcion:
          description.trim() || null,
        orden: Number(order),
        calificacionMinisterialEsperada:
          score ? Number(score) : null,
        estado: current?.estado ?? "ACTIVO",
        grupoMinisterialIds: groupIds,
      });
      onSaved(
        current?.id ?? readId(result)
      );
    } catch (requestError) {
      setError(errorText(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <QuickEditorShell
      title={
        current
          ? "Editar estándar"
          : "Crear estándar"
      }
      description={`Quedará dentro de la categoría ${category.nombre}.`}
      saving={saving}
      error={error}
      onCancel={onCancel}
      onSubmit={submit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Código">
          <input
            value={code}
            onChange={(event) =>
              setCode(event.target.value)
            }
            className={inputClass}
          />
        </Field>
        <Field label="Orden *">
          <input
            required
            type="number"
            min={0}
            value={order}
            onChange={(event) =>
              setOrder(event.target.value)
            }
            className={inputClass}
          />
        </Field>
        <Field label="Nombre *" spanTwo>
          <input
            required
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className={inputClass}
          />
        </Field>
        <Field
          label="Descripción"
          spanTwo
        >
          <textarea
            rows={2}
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            className={`${inputClass} resize-y`}
          />
        </Field>
        <Field label="Calificación ministerial">
          <input
            type="number"
            min={0}
            max={100}
            step="0.01"
            value={score}
            onChange={(event) =>
              setScore(event.target.value)
            }
            className={inputClass}
          />
        </Field>
        <Field
          label="Grupos 7 / 21 / 60"
          spanTwo
        >
          <div className="grid gap-2 sm:grid-cols-3">
            {catalogs.gruposMinisteriales.map(
              (group) => {
                const checked =
                  groupIds.includes(group.id);
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() =>
                      setGroupIds((currentIds) =>
                        currentIds.includes(
                          group.id
                        )
                          ? currentIds.filter(
                              (id) =>
                                id !== group.id
                            )
                          : [
                              ...currentIds,
                              group.id,
                            ]
                      )
                    }
                    className={`rounded-xl border px-3 py-2 text-xs transition ${
                      checked
                        ? "border-violet-500/25 bg-violet-500/10 text-violet-300"
                        : "border-neutral-800 text-neutral-500"
                    }`}
                  >
                    {group.nombre}
                  </button>
                );
              }
            )}
          </div>
        </Field>
      </div>
    </QuickEditorShell>
  );
}
