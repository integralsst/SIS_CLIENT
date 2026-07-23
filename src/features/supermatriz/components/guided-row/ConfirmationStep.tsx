import {
  Check,
  CheckCircle2,
  Layers3,
} from "lucide-react";

import type {
  AspectCatalog,
  MatrixCatalogs,
  PhvaCycle,
  ProcessCatalog,
  Standard,
  StandardCategory,
} from "../../types/supermatriz.types";
import {
  ReviewItem,
} from "./GuidedRowShared";

interface Props {
  catalogs: MatrixCatalogs;
  selectedIds: number[];
  selectedCycle: PhvaCycle | null;
  selectedCategory: StandardCategory | null;
  selectedStandard: Standard | null;
  selectedAspect: AspectCatalog | null;
  selectedProcess: ProcessCatalog | null;
  selectedManagementCategories: MatrixCatalogs["categoriasGestion"];
  execution: string;
  responsible: string;
  onToggle: (id: number) => void;
}

export default function ConfirmationStep({
  catalogs,
  selectedIds,
  selectedCycle,
  selectedCategory,
  selectedStandard,
  selectedAspect,
  selectedProcess,
  selectedManagementCategories,
  execution,
  responsible,
  onToggle,
}: Props) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-white">
          Categorías de gestión *
        </h3>
        <p className="mt-1 text-xs leading-5 text-neutral-500">
          Indica qué líneas de servicio o equipos pueden atender esta fila. Puedes seleccionar varias.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {catalogs.categoriasGestion
          .filter(
            (item) =>
              item.estado === "ACTIVO"
          )
          .map((category) => {
            const checked =
              selectedIds.includes(category.id);

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  onToggle(category.id)
                }
                className={`rounded-2xl border p-4 text-left transition ${
                  checked
                    ? "border-cyan-500/30 bg-cyan-500/10"
                    : "border-neutral-800 bg-[#090909] hover:border-neutral-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Layers3 size={16} />
                  </div>
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

      <section className="rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.035] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Conexión que se guardará
            </h3>
            <p className="mt-1 text-xs leading-5 text-neutral-500">
              La fila quedará vinculada al aspecto y al proceso seleccionados. El ciclo, la categoría y el estándar se obtienen automáticamente desde el aspecto.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <ReviewItem
            label="Ciclo PHVA"
            value={selectedCycle?.nombre}
          />
          <ReviewItem
            label="Categoría"
            value={selectedCategory?.nombre}
          />
          <ReviewItem
            label="Estándar"
            value={selectedStandard?.nombre}
          />
          <ReviewItem
            label="Aspecto"
            value={selectedAspect?.nombre}
          />
          <ReviewItem
            label="Proceso"
            value={selectedProcess?.nombre}
          />
          <ReviewItem
            label="Gestiones"
            value={
              selectedManagementCategories
                .map((item) => item.nombre)
                .join(", ") ||
              "Sin seleccionar"
            }
          />
          <ReviewItem
            label="Responsable sugerido"
            value={responsible}
          />
          <ReviewItem
            label="Ejecución"
            value={execution}
          />
        </div>
      </section>
    </section>
  );
}
