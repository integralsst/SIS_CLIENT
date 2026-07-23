import type {
  AspectCatalog,
  MatrixCatalogs,
} from "../../types/supermatriz.types";
import {
  SelectionBlock,
  SmallPill,
} from "./GuidedRowShared";
import type {
  GuidedRowCatalogActions,
} from "./guidedRow.types";
import {
  getAspectPeriodicity,
} from "./guidedRow.utils";
import QuickAspectForm from "./QuickAspectForm";

interface Props {
  catalogs: MatrixCatalogs;
  standardId: string;
  aspectId: string;
  aspects: AspectCatalog[];
  selectedAspect: AspectCatalog | null;
  editorOpen: boolean;
  editingExisting: boolean;
  versionSupermatrizId: number;
  onAspectChange: (value: string) => void;
  onOpenEditor: (edit: boolean) => void;
  onCloseEditor: () => void;
  onAspectSaved: (value: string) => void;
  onSaveAspect: GuidedRowCatalogActions["onSaveAspect"];
}

export default function AspectStep({
  catalogs,
  standardId,
  aspectId,
  aspects,
  selectedAspect,
  editorOpen,
  editingExisting,
  versionSupermatrizId,
  onAspectChange,
  onOpenEditor,
  onCloseEditor,
  onAspectSaved,
  onSaveAspect,
}: Props) {
  const selectedStandard =
    catalogs.estandares.find(
      (item) =>
        item.id === Number(standardId)
    ) ?? null;

  return (
    <div className="space-y-4">
      <SelectionBlock
        number="4"
        title="Aspecto evaluable"
        explanation="Es el punto exacto que se calificará en las empresas. Cada aspecto tiene un único plan de acción."
        value={aspectId}
        onChange={onAspectChange}
        onCreate={() => onOpenEditor(false)}
        onEdit={
          selectedAspect
            ? () => onOpenEditor(true)
            : undefined
        }
      >
        <option value="">
          Selecciona un aspecto
        </option>
        {aspects.map((aspect) => (
          <option
            key={aspect.id}
            value={aspect.id}
          >
            {aspect.codigo
              ? `${aspect.codigo} · `
              : ""}
            {aspect.nombre}
          </option>
        ))}
      </SelectionBlock>

      {editorOpen && selectedStandard && (
        <QuickAspectForm
          current={
            editingExisting
              ? selectedAspect
              : null
          }
          standard={selectedStandard}
          versionSupermatrizId={
            versionSupermatrizId
          }
          suggestedOrder={
            Math.max(
              0,
              ...aspects.map(
                (item) => item.orden
              )
            ) + 1
          }
          onCancel={onCloseEditor}
          onSave={onSaveAspect}
          onSaved={(id) => {
            onAspectSaved(String(id));
            onCloseEditor();
          }}
        />
      )}

      {selectedAspect && !editorOpen && (
        <section className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.045] p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Aspecto seleccionado
          </p>
          <h3 className="mt-2 text-sm font-semibold leading-6 text-white">
            {selectedAspect.nombre}
          </h3>
          <div className="mt-4 rounded-xl border border-amber-500/10 bg-black/20 p-4">
            <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-600">
              Plan de acción específico
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-300">
              {selectedAspect
                .planAccionEspecifico
                ?.descripcion ||
                "Sin plan de acción."}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
            <SmallPill
              text={getAspectPeriodicity(
                selectedAspect
              )}
            />
            {selectedAspect.configuracion
              ?.esEvergreen && (
              <SmallPill text="Evergreen" />
            )}
            {selectedAspect
              .configuracionEvidencia
              ?.requiereEvidencia && (
              <SmallPill text="Requiere evidencia" />
            )}
          </div>
        </section>
      )}
    </div>
  );
}
