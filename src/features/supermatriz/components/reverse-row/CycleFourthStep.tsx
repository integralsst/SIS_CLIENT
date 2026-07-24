import AppSelect from "../../../../components/ui/AppSelect";
import type {
  AspectCatalog,
  MatrixCatalogs,
  Standard,
  StandardCategory,
} from "../../types/supermatriz.types";
import type {
  BuilderCycleDraft,
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
  categoryMode: BuilderEntityMode;
  selectedCategory: StandardCategory | null;
  mode: BuilderEntityMode;
  cycleId: string;
  draft: BuilderCycleDraft;
  onModeChange: (mode: BuilderEntityMode) => void;
  onCycleIdChange: (value: string) => void;
  onDraftChange: (
    patch: Partial<BuilderCycleDraft>
  ) => void;
}

export default function CycleFourthStep({
  catalogs,
  aspectMode,
  selectedAspect,
  standardMode,
  selectedStandard,
  categoryMode,
  selectedCategory,
  mode,
  cycleId,
  draft,
  onModeChange,
  onCycleIdChange,
  onDraftChange,
}: Props) {
  const inherited =
    aspectMode === "EXISTENTE"
      ? selectedAspect?.estandar
          .categoriaEstandar.cicloPhva
      : standardMode === "EXISTENTE"
        ? selectedStandard?.categoriaEstandar
            .cicloPhva
        : categoryMode === "EXISTENTE"
          ? selectedCategory?.cicloPhva
          : null;

  if (inherited) {
    return (
      <InheritedCard
        label="Ciclo PHVA"
        value={`${inherited.codigo} · ${inherited.nombre}`}
        detail="El ciclo ya está definido por la ruta seleccionada."
      />
    );
  }

  const selected =
    catalogs.ciclosPhva.find(
      (item) => item.id === Number(cycleId)
    ) ?? null;

  return (
    <section className="space-y-5">
      <ModeSwitch
        value={mode}
        onChange={onModeChange}
        existingLabel="Usar ciclo existente"
        newLabel="Definir ciclo nuevo"
      />

      {mode === "EXISTENTE" ? (
        <div className="space-y-4">
          <Field label="Ciclo PHVA existente *">
            <AppSelect
              value={cycleId}
              onChange={(event) =>
                onCycleIdChange(
                  event.target.value
                )
              }
            >
              <option value="">
                Selecciona un ciclo PHVA
              </option>
              {catalogs.ciclosPhva
                .filter(
                  (item) =>
                    item.estado === "ACTIVO"
                )
                .map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.codigo} · {item.nombre}
                  </option>
                ))}
            </AppSelect>
          </Field>

          {selected && (
            <InheritedCard
              label="Ciclo seleccionado"
              value={`${selected.codigo} · ${selected.nombre}`}
              detail={`Orden ${selected.orden}.`}
            />
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Código *">
              <input
                value={draft.codigo}
                onChange={(event) =>
                  onDraftChange({
                    codigo:
                      event.target.value.toUpperCase(),
                  })
                }
                placeholder="PLANEAR"
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
              label="Nombre del ciclo *"
              spanTwo
            >
              <input
                value={draft.nombre}
                onChange={(event) =>
                  onDraftChange({
                    nombre: event.target.value,
                  })
                }
                placeholder="Planear"
                className={inputClass}
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
