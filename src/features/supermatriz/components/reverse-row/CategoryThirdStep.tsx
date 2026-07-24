import AppSelect from "../../../../components/ui/AppSelect";
import type {
  AspectCatalog,
  MatrixCatalogs,
  Standard,
} from "../../types/supermatriz.types";
import type {
  BuilderCategoryDraft,
  BuilderEntityMode,
} from "../../types/supermatriz.types";
import {
  Field,
  InheritedCard,
  ModeSwitch,
  inputClass,
} from "./ReverseRowShared";

interface Props {
  catalogs: MatrixCatalogs;
  aspectMode: BuilderEntityMode;
  selectedAspect: AspectCatalog | null;
  standardMode: BuilderEntityMode;
  selectedStandard: Standard | null;
  mode: BuilderEntityMode;
  categoryId: string;
  draft: BuilderCategoryDraft;
  onModeChange: (mode: BuilderEntityMode) => void;
  onCategoryIdChange: (value: string) => void;
  onDraftChange: (
    patch: Partial<BuilderCategoryDraft>
  ) => void;
}

export default function CategoryThirdStep({
  catalogs,
  aspectMode,
  selectedAspect,
  standardMode,
  selectedStandard,
  mode,
  categoryId,
  draft,
  onModeChange,
  onCategoryIdChange,
  onDraftChange,
}: Props) {
  const inherited =
    aspectMode === "EXISTENTE"
      ? selectedAspect?.estandar
          .categoriaEstandar
      : standardMode === "EXISTENTE"
        ? selectedStandard?.categoriaEstandar
        : null;

  if (inherited) {
    return (
      <InheritedCard
        label="Categoría"
        value={inherited.nombre}
        detail={`Ya está definida por el estándar seleccionado. Ciclo PHVA: ${inherited.cicloPhva.nombre}.`}
      />
    );
  }

  const selected =
    catalogs.categoriasEstandar.find(
      (item) => item.id === Number(categoryId)
    ) ?? null;

  return (
    <section className="space-y-5">
      <ModeSwitch
        value={mode}
        onChange={onModeChange}
        existingLabel="Usar categoría existente"
        newLabel="Definir categoría nueva"
      />

      {mode === "EXISTENTE" ? (
        <div className="space-y-4">
          <Field
            label="Categoría existente *"
            help="Su ciclo PHVA se heredará automáticamente en el siguiente paso."
          >
            <AppSelect
              value={categoryId}
              onChange={(event) =>
                onCategoryIdChange(
                  event.target.value
                )
              }
            >
              <option value="">
                Selecciona una categoría
              </option>
              {catalogs.categoriasEstandar
                .filter(
                  (item) =>
                    item.estado === "ACTIVO"
                )
                .map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.cicloPhva.nombre} · {item.nombre}
                  </option>
                ))}
            </AppSelect>
          </Field>

          {selected && (
            <InheritedCard
              label="Categoría seleccionada"
              value={selected.nombre}
              detail={`Pertenece al ciclo ${selected.cicloPhva.nombre}.`}
            />
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 text-xs leading-5 text-neutral-400">
            La categoría se conservará como borrador hasta que definas el ciclo PHVA y completes la fila.
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Código">
              <input
                value={draft.codigo ?? ""}
                onChange={(event) =>
                  onDraftChange({
                    codigo:
                      event.target.value || null,
                  })
                }
                className={inputClass}
              />
            </Field>

            <Field label="Orden *">
              <input
                type="number"
                min={0}
                value={draft.orden}
                onChange={(event) =>
                  onDraftChange({
                    orden: Number(
                      event.target.value
                    ),
                  })
                }
                className={inputClass}
              />
            </Field>

            <Field
              label="Nombre de la categoría *"
              spanTwo
            >
              <input
                value={draft.nombre}
                onChange={(event) =>
                  onDraftChange({
                    nombre: event.target.value,
                  })
                }
                className={inputClass}
              />
            </Field>

            <Field
              label="Descripción"
              spanTwo
            >
              <textarea
                rows={3}
                value={draft.descripcion ?? ""}
                onChange={(event) =>
                  onDraftChange({
                    descripcion:
                      event.target.value || null,
                  })
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
                value={
                  draft.porcentajeEsperado ?? ""
                }
                onChange={(event) =>
                  onDraftChange({
                    porcentajeEsperado:
                      event.target.value
                        ? Number(
                            event.target.value
                          )
                        : null,
                  })
                }
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      )}
    </section>
  );
}
