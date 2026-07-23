import type {
  MatrixCatalogs,
  PhvaCycle,
  Standard,
  StandardCategory,
} from "../../types/supermatriz.types";
import {
  PathPreview,
  SelectionBlock,
} from "./GuidedRowShared";
import type {
  GuidedRowCatalogActions,
  InlineEditorKind,
} from "./guidedRow.types";
import {
  CategoryQuickForm,
  CycleQuickForm,
  StandardQuickForm,
} from "./QuickHierarchyForms";

interface Props {
  catalogs: MatrixCatalogs;
  cycleId: string;
  categoryId: string;
  standardId: string;
  categories: StandardCategory[];
  standards: Standard[];
  selectedCycle: PhvaCycle | null;
  selectedCategory: StandardCategory | null;
  selectedStandard: Standard | null;
  editorKind: InlineEditorKind | null;
  editingExisting: boolean;
  versionSupermatrizId: number;
  onCycleChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStandardChange: (value: string) => void;
  onOpenEditor: (
    kind: InlineEditorKind,
    edit?: boolean
  ) => void;
  onCloseEditor: () => void;
  onCycleSaved: (value: string) => void;
  onCategorySaved: (value: string) => void;
  onStandardSaved: (value: string) => void;
  onSaveCycle: GuidedRowCatalogActions["onSaveCycle"];
  onSaveCategory: GuidedRowCatalogActions["onSaveCategory"];
  onSaveStandard: GuidedRowCatalogActions["onSaveStandard"];
}

export default function RouteStep({
  catalogs,
  cycleId,
  categoryId,
  standardId,
  categories,
  standards,
  selectedCycle,
  selectedCategory,
  selectedStandard,
  editorKind,
  editingExisting,
  versionSupermatrizId,
  onCycleChange,
  onCategoryChange,
  onStandardChange,
  onOpenEditor,
  onCloseEditor,
  onCycleSaved,
  onCategorySaved,
  onStandardSaved,
  onSaveCycle,
  onSaveCategory,
  onSaveStandard,
}: Props) {
  return (
    <div className="space-y-4">
      <SelectionBlock
        number="1"
        title="Ciclo PHVA"
        explanation="Nivel superior: Planear, Hacer, Verificar o Actuar."
        value={cycleId}
        onChange={onCycleChange}
        onCreate={() =>
          onOpenEditor("ciclo")
        }
        onEdit={
          selectedCycle
            ? () =>
                onOpenEditor(
                  "ciclo",
                  true
                )
            : undefined
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
          .map((cycle) => (
            <option
              key={cycle.id}
              value={cycle.id}
            >
              {cycle.codigo} · {cycle.nombre}
            </option>
          ))}
      </SelectionBlock>

      {editorKind === "ciclo" && (
        <CycleQuickForm
          current={
            editingExisting
              ? selectedCycle
              : null
          }
          versionSupermatrizId={
            versionSupermatrizId
          }
          suggestedOrder={
            Math.max(
              0,
              ...catalogs.ciclosPhva.map(
                (item) => item.orden
              )
            ) + 1
          }
          onCancel={onCloseEditor}
          onSave={onSaveCycle}
          onSaved={(id) => {
            onCycleSaved(String(id));
            onCloseEditor();
          }}
        />
      )}

      <SelectionBlock
        number="2"
        title="Categoría del estándar"
        explanation="Agrupa estándares dentro del ciclo seleccionado."
        value={categoryId}
        onChange={onCategoryChange}
        disabled={!cycleId}
        onCreate={
          cycleId
            ? () =>
                onOpenEditor("categoria")
            : undefined
        }
        onEdit={
          selectedCategory
            ? () =>
                onOpenEditor(
                  "categoria",
                  true
                )
            : undefined
        }
      >
        <option value="">
          {cycleId
            ? "Selecciona una categoría"
            : "Primero selecciona el ciclo"}
        </option>
        {categories.map((category) => (
          <option
            key={category.id}
            value={category.id}
          >
            {category.codigo
              ? `${category.codigo} · `
              : ""}
            {category.nombre}
          </option>
        ))}
      </SelectionBlock>

      {editorKind === "categoria" &&
        selectedCycle && (
          <CategoryQuickForm
            current={
              editingExisting
                ? selectedCategory
                : null
            }
            cycle={selectedCycle}
            versionSupermatrizId={
              versionSupermatrizId
            }
            suggestedOrder={
              Math.max(
                0,
                ...categories.map(
                  (item) => item.orden
                )
              ) + 1
            }
            onCancel={onCloseEditor}
            onSave={onSaveCategory}
            onSaved={(id) => {
              onCategorySaved(String(id));
              onCloseEditor();
            }}
          />
        )}

      <SelectionBlock
        number="3"
        title="Estándar"
        explanation="El estándar contendrá el aspecto que se evaluará."
        value={standardId}
        onChange={onStandardChange}
        disabled={!categoryId}
        onCreate={
          categoryId
            ? () =>
                onOpenEditor("estandar")
            : undefined
        }
        onEdit={
          selectedStandard
            ? () =>
                onOpenEditor(
                  "estandar",
                  true
                )
            : undefined
        }
      >
        <option value="">
          {categoryId
            ? "Selecciona un estándar"
            : "Primero selecciona la categoría"}
        </option>
        {standards.map((standard) => (
          <option
            key={standard.id}
            value={standard.id}
          >
            {standard.codigo
              ? `${standard.codigo} · `
              : ""}
            {standard.nombre}
          </option>
        ))}
      </SelectionBlock>

      {editorKind === "estandar" &&
        selectedCategory && (
          <StandardQuickForm
            current={
              editingExisting
                ? selectedStandard
                : null
            }
            category={selectedCategory}
            catalogs={catalogs}
            versionSupermatrizId={
              versionSupermatrizId
            }
            suggestedOrder={
              Math.max(
                0,
                ...standards.map(
                  (item) => item.orden
                )
              ) + 1
            }
            onCancel={onCloseEditor}
            onSave={onSaveStandard}
            onSaved={(id) => {
              onStandardSaved(String(id));
              onCloseEditor();
            }}
          />
        )}

      {selectedCycle &&
        selectedCategory &&
        selectedStandard && (
          <PathPreview
            items={[
              selectedCycle.nombre,
              selectedCategory.nombre,
              selectedStandard.nombre,
            ]}
          />
        )}
    </div>
  );
}
