import AppSelect from "../../../../components/ui/AppSelect";
import type {
  MatrixCatalogs,
} from "../../types/supermatriz.types";
import type {
  BuilderEntityMode,
  BuilderProcessDraft,
} from "../../types/supermatriz.types";
import {
  Field,
  ModeSwitch,
  inputClass,
} from "./ReverseRowShared";

interface Props {
  catalogs: MatrixCatalogs;
  mode: BuilderEntityMode;
  processId: string;
  draft: BuilderProcessDraft;
  onModeChange: (mode: BuilderEntityMode) => void;
  onProcessIdChange: (value: string) => void;
  onDraftChange: (
    patch: Partial<BuilderProcessDraft>
  ) => void;
}

export default function ProcessFifthStep({
  catalogs,
  mode,
  processId,
  draft,
  onModeChange,
  onProcessIdChange,
  onDraftChange,
}: Props) {
  const selected =
    catalogs.procesos.find(
      (item) => item.id === Number(processId)
    ) ?? null;

  return (
    <section className="space-y-5">
      <ModeSwitch
        value={mode}
        onChange={onModeChange}
        existingLabel="Usar proceso existente"
        newLabel="Definir proceso nuevo"
      />

      {mode === "EXISTENTE" ? (
        <div className="space-y-4">
          <Field
            label="Proceso existente *"
            help="Un proceso puede usarse en distintas filas y estándares. No recibe calificación ministerial propia."
          >
            <AppSelect
              value={processId}
              onChange={(event) =>
                onProcessIdChange(
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
            <div className="rounded-2xl border border-violet-500/15 bg-violet-500/[0.045] p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
                Proceso seleccionado
              </p>
              <h3 className="mt-2 text-sm font-semibold text-white">
                {selected.nombre}
              </h3>
              <p className="mt-2 text-xs leading-5 text-neutral-500">
                {selected.descripcion ||
                  "Sin descripción adicional."}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
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

            <Field
              label="Nombre del proceso *"
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
          </div>
        </div>
      )}
    </section>
  );
}
