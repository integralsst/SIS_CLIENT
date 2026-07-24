import {
  Check,
  ClipboardCheck,
  Layers3,
} from "lucide-react";

import AppSelect from "../../../../components/ui/AppSelect";
import type {
  MatrixCatalogs,
} from "../../types/supermatriz.types";
import type {
  BuilderTaskDraft,
} from "../../types/supermatriz.types";
import {
  ConnectionPath,
  Field,
  inputClass,
} from "./ReverseRowShared";

interface Props {
  catalogs: MatrixCatalogs;
  draft: BuilderTaskDraft;
  path: Array<{
    label: string;
    value: string;
  }>;
  onDraftChange: (
    patch: Partial<BuilderTaskDraft>
  ) => void;
}

export default function RowSixthStep({
  catalogs,
  draft,
  path,
  onDraftChange,
}: Props) {
  function toggleManagementCategory(
    id: number
  ) {
    onDraftChange({
      categoriaGestionIds:
        draft.categoriaGestionIds.includes(id)
          ? draft.categoriaGestionIds.filter(
              (item) => item !== id
            )
          : [
              ...draft.categoriaGestionIds,
              id,
            ],
    });
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.035] p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
            <ClipboardCheck size={18} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Ruta preparada para guardar
            </h3>
            <p className="mt-1 text-xs leading-5 text-neutral-500">
              Los elementos nuevos se crearán internamente en el orden técnico correcto: ciclo, categoría, estándar, aspecto, proceso y fila. Si algo falla, no quedarán registros parciales.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <ConnectionPath items={path} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Código de la fila"
          help="Es opcional, pero debe ser único dentro de la versión."
        >
          <input
            value={draft.codigo ?? ""}
            onChange={(event) =>
              onDraftChange({
                codigo:
                  event.target.value || null,
              })
            }
            placeholder="Ej. SM-001"
            className={inputClass}
          />
        </Field>

        <Field label="Orden de la fila *">
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
          label="Responsable sugerido"
          spanTwo
        >
          <input
            value={
              draft.responsableActividad ?? ""
            }
            onChange={(event) =>
              onDraftChange({
                responsableActividad:
                  event.target.value || null,
              })
            }
            placeholder="Ej. Profesional SST, Talento Humano o Gerencia"
            className={inputClass}
          />
        </Field>

        <Field
          label="Ejecución"
          help="Explica cómo se desarrolla la actividad en la práctica."
          spanTwo
        >
          <textarea
            rows={4}
            value={draft.ejecucion ?? ""}
            onChange={(event) =>
              onDraftChange({
                ejecucion:
                  event.target.value || null,
              })
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
            value={
              draft.fundamentosSoportes ?? ""
            }
            onChange={(event) =>
              onDraftChange({
                fundamentosSoportes:
                  event.target.value || null,
              })
            }
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field label="Meta esperada">
          <textarea
            rows={3}
            value={draft.metasEstandar ?? ""}
            onChange={(event) =>
              onDraftChange({
                metasEstandar:
                  event.target.value || null,
              })
            }
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field label="Recursos administrativos">
          <textarea
            rows={3}
            value={
              draft.recursosAdministrativos ??
              ""
            }
            onChange={(event) =>
              onDraftChange({
                recursosAdministrativos:
                  event.target.value || null,
              })
            }
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field label="Estado">
          <AppSelect
            value={draft.estado}
            onChange={(event) =>
              onDraftChange({
                estado:
                  event.target
                    .value as BuilderTaskDraft["estado"],
              })
            }
          >
            <option value="ACTIVO">
              Activa
            </option>
            <option value="INACTIVO">
              Inactiva
            </option>
          </AppSelect>
        </Field>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Layers3 className="h-4 w-4 text-cyan-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">
              Categorías de gestión *
            </h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              Selecciona al menos una. La fila puede pertenecer a varias.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {catalogs.categoriasGestion
            .filter(
              (item) =>
                item.estado === "ACTIVO"
            )
            .map((category) => {
              const checked =
                draft.categoriaGestionIds.includes(
                  category.id
                );

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    toggleManagementCategory(
                      category.id
                    )
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    checked
                      ? "border-cyan-500/30 bg-cyan-500/10"
                      : "border-neutral-800 bg-[#090909] hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                      <Layers3 size={16} />
                    </span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        checked
                          ? "border-cyan-400 bg-cyan-400 text-black"
                          : "border-neutral-700"
                      }`}
                    >
                      {checked && (
                        <Check size={12} />
                      )}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">
                    {category.nombre}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-neutral-600">
                    {category.descripcion ||
                      "Categoría de gestión de la Supermatriz."}
                  </p>
                </button>
              );
            })}
        </div>
      </div>
    </section>
  );
}
