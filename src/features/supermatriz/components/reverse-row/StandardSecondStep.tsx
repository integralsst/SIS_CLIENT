import AppSelect from "../../../../components/ui/AppSelect";
import type {
  AspectCatalog,
  MatrixCatalogs,
  Standard,
} from "../../types/supermatriz.types";
import type {
  BuilderEntityMode,
  BuilderStandardDraft,
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
  mode: BuilderEntityMode;
  standardId: string;
  draft: BuilderStandardDraft;
  onModeChange: (mode: BuilderEntityMode) => void;
  onStandardIdChange: (value: string) => void;
  onDraftChange: (
    patch: Partial<BuilderStandardDraft>
  ) => void;
}

export default function StandardSecondStep({
  catalogs,
  aspectMode,
  selectedAspect,
  mode,
  standardId,
  draft,
  onModeChange,
  onStandardIdChange,
  onDraftChange,
}: Props) {
  if (aspectMode === "EXISTENTE") {
    const inherited = selectedAspect?.estandar;

    return (
      <InheritedCard
        label="Estándar"
        value={
          inherited?.nombre ??
          "Selecciona primero un aspecto"
        }
        detail="El estándar ya está definido por el aspecto existente. No se creará ni modificará desde este flujo."
      />
    );
  }

  const selected =
    catalogs.estandares.find(
      (item) => item.id === Number(standardId)
    ) ?? null;

  return (
    <section className="space-y-5">
      <ModeSwitch
        value={mode}
        onChange={onModeChange}
        existingLabel="Usar estándar existente"
        newLabel="Definir estándar nuevo"
      />

      {mode === "EXISTENTE" ? (
        <div className="space-y-4">
          <Field
            label="Estándar existente *"
            help="Al seleccionarlo, su categoría y ciclo PHVA se heredarán automáticamente."
          >
            <AppSelect
              value={standardId}
              onChange={(event) =>
                onStandardIdChange(
                  event.target.value
                )
              }
            >
              <option value="">
                Selecciona un estándar
              </option>
              {catalogs.estandares
                .filter(
                  (item) =>
                    item.estado === "ACTIVO"
                )
                .map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.codigo
                      ? `${item.codigo} · `
                      : ""}
                    {item.nombre}
                  </option>
                ))}
            </AppSelect>
          </Field>

          {selected && (
            <StandardSummary standard={selected} />
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 text-xs leading-5 text-neutral-400">
            El estándar nuevo se guardará únicamente al finalizar la fila, después de resolver su categoría y ciclo PHVA.
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
                placeholder="Ej. 1.1.1"
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
              label="Nombre del estándar *"
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

            <Field label="Calificación ministerial">
              <input
                type="number"
                min={0}
                max={1}
                step="0.01"
                value={
                  draft.calificacionMinisterialEsperada ??
                  ""
                }
                onChange={(event) =>
                  onDraftChange({
                    calificacionMinisterialEsperada:
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

          <fieldset className="rounded-xl border border-neutral-800 bg-[#090909] p-4">
            <legend className="px-2 text-xs font-semibold text-neutral-300">
              Grupos ministeriales 7, 21 y 60
            </legend>
            <p className="mb-3 text-[11px] leading-5 text-neutral-600">
              Esta clasificación pertenece al estándar y se usa como filtro de reporte. No clasifica de manera fija a una empresa.
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {catalogs.gruposMinisteriales.map(
                (group) => {
                  const checked =
                    draft.grupoMinisterialIds.includes(
                      group.id
                    );
                  return (
                    <label
                      key={group.id}
                      className={`cursor-pointer rounded-xl border p-3 text-xs transition ${
                        checked
                          ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-200"
                          : "border-neutral-800 text-neutral-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            onDraftChange({
                              grupoMinisterialIds:
                                checked
                                  ? draft.grupoMinisterialIds.filter(
                                      (id) =>
                                        id !== group.id
                                    )
                                  : [
                                      ...draft.grupoMinisterialIds,
                                      group.id,
                                    ],
                            })
                          }
                        />
                        {group.nombre}
                      </div>
                    </label>
                  );
                }
              )}
            </div>
          </fieldset>
        </div>
      )}
    </section>
  );
}

function StandardSummary({
  standard,
}: {
  standard: Standard;
}) {
  return (
    <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.04] p-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
        Estándar seleccionado
      </p>
      <h3 className="mt-2 text-sm font-semibold leading-6 text-white">
        {standard.nombre}
      </h3>
      <p className="mt-2 text-xs leading-5 text-neutral-500">
        Categoría: {standard.categoriaEstandar.nombre} · Ciclo: {standard.categoriaEstandar.cicloPhva.nombre}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {standard.gruposMinisteriales.map(
          (item) => (
            <span
              key={item.grupoMinisterialId}
              className="rounded-full border border-violet-500/15 bg-violet-500/5 px-2.5 py-1 text-[10px] text-violet-300"
            >
              {item.grupoMinisterial.nombre}
            </span>
          )
        )}
      </div>
    </div>
  );
}
