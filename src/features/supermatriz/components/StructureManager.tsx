import {
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  AspectCatalog,
  MatrixCatalogs,
  PhvaCycle,
  Standard,
  StandardCategory,
} from "../types/supermatriz.types";
import AspectEditorModal from "./AspectEditorModal";
import CatalogEditorModal, {
  type CatalogEditorKind,
} from "./CatalogEditorModal";
import StatusBadge from "./StatusBadge";

interface Props {
  versionSupermatrizId: number;
  catalogs: MatrixCatalogs;
  canEdit: boolean;
  onSaveCycle: Parameters<
    typeof CatalogEditorModal
  >[0]["onSaveCycle"];
  onSaveCategory: Parameters<
    typeof CatalogEditorModal
  >[0]["onSaveCategory"];
  onSaveStandard: Parameters<
    typeof CatalogEditorModal
  >[0]["onSaveStandard"];
  onSaveAspect: Parameters<
    typeof AspectEditorModal
  >[0]["onSave"];
  onDeactivateCycle: (
    id: number
  ) => Promise<unknown>;
  onDeactivateCategory: (
    id: number
  ) => Promise<unknown>;
  onDeactivateStandard: (
    id: number
  ) => Promise<unknown>;
  onDeactivateAspect: (
    id: number
  ) => Promise<unknown>;
}

type EditorState =
  | {
      kind: CatalogEditorKind;
      current:
        | PhvaCycle
        | StandardCategory
        | Standard
        | null;
    }
  | null;

export default function StructureManager({
  versionSupermatrizId,
  catalogs,
  canEdit,
  onSaveCycle,
  onSaveCategory,
  onSaveStandard,
  onSaveAspect,
  onDeactivateCycle,
  onDeactivateCategory,
  onDeactivateStandard,
  onDeactivateAspect,
}: Props) {
  const [
    selectedCycleId,
    setSelectedCycleId,
  ] = useState<number | null>(
    catalogs.ciclosPhva[0]?.id ??
      null
  );
  const [
    selectedCategoryId,
    setSelectedCategoryId,
  ] = useState<number | null>(
    null
  );
  const [
    selectedStandardId,
    setSelectedStandardId,
  ] = useState<number | null>(
    null
  );

  const [editor, setEditor] =
    useState<EditorState>(null);
  const [
    aspectEditor,
    setAspectEditor,
  ] = useState<{
    open: boolean;
    current: AspectCatalog | null;
  }>({
    open: false,
    current: null,
  });

  const categories = useMemo(
    () =>
      catalogs.categoriasEstandar.filter(
        (item) =>
          selectedCycleId ===
            null ||
          item.cicloPhvaId ===
            selectedCycleId
      ),
    [
      catalogs.categoriasEstandar,
      selectedCycleId,
    ]
  );

  const standards = useMemo(
    () =>
      catalogs.estandares.filter(
        (item) =>
          selectedCategoryId ===
            null ||
          item.categoriaEstandarId ===
            selectedCategoryId
      ),
    [
      catalogs.estandares,
      selectedCategoryId,
    ]
  );

  const aspects = useMemo(
    () =>
      catalogs.aspectos.filter(
        (item) =>
          selectedStandardId ===
            null ||
          item.estandarId ===
            selectedStandardId
      ),
    [
      catalogs.aspectos,
      selectedStandardId,
    ]
  );

  const selectCycle = (
    id: number
  ) => {
    setSelectedCycleId(id);
    setSelectedCategoryId(
      null
    );
    setSelectedStandardId(
      null
    );
  };

  const selectCategory = (
    id: number
  ) => {
    setSelectedCategoryId(
      id
    );
    setSelectedStandardId(
      null
    );
  };

  const selectStandard = (
    id: number
  ) => {
    setSelectedStandardId(
      id
    );
  };

  async function deactivate(
    label: string,
    action: () => Promise<unknown>
  ) {
    if (
      !window.confirm(
        `¿Deseas desactivar ${label}? El registro no se borrará físicamente.`
      )
    ) {
      return;
    }

    await action();
  }

  return (
    <div className="space-y-5">
      {!canEdit && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          Esta versión está en modo de solo lectura. Clónala para realizar cambios.
        </div>
      )}

      <div className="grid min-h-[560px] gap-4 xl:grid-cols-4">
        <HierarchyColumn
          title="Ciclos PHVA"
          subtitle={`${catalogs.ciclosPhva.length} registros`}
          canAdd={canEdit}
          onAdd={() =>
            setEditor({
              kind: "ciclo",
              current: null,
            })
          }
        >
          {catalogs.ciclosPhva.map(
            (cycle) => (
              <HierarchyItem
                key={cycle.id}
                title={cycle.nombre}
                subtitle={`${cycle.codigo} · Orden ${cycle.orden}`}
                active={
                  selectedCycleId ===
                  cycle.id
                }
                status={cycle.estado}
                onClick={() =>
                  selectCycle(
                    cycle.id
                  )
                }
                canEdit={canEdit}
                onEdit={() =>
                  setEditor({
                    kind: "ciclo",
                    current: cycle,
                  })
                }
                onDeactivate={() =>
                  void deactivate(
                    `el ciclo ${cycle.nombre}`,
                    () =>
                      onDeactivateCycle(
                        cycle.id
                      )
                  )
                }
              />
            )
          )}
        </HierarchyColumn>

        <HierarchyColumn
          title="Categorías"
          subtitle={
            selectedCycleId
              ? `${categories.length} del ciclo`
              : `${categories.length} registros`
          }
          canAdd={canEdit}
          onAdd={() =>
            setEditor({
              kind:
                "categoria",
              current: null,
            })
          }
        >
          {categories.map(
            (category) => (
              <HierarchyItem
                key={
                  category.id
                }
                title={
                  category.nombre
                }
                subtitle={`${
                  category.codigo ??
                  "Sin código"
                } · Orden ${
                  category.orden
                }`}
                active={
                  selectedCategoryId ===
                  category.id
                }
                status={
                  category.estado
                }
                onClick={() =>
                  selectCategory(
                    category.id
                  )
                }
                canEdit={canEdit}
                onEdit={() =>
                  setEditor({
                    kind:
                      "categoria",
                    current:
                      category,
                  })
                }
                onDeactivate={() =>
                  void deactivate(
                    `la categoría ${category.nombre}`,
                    () =>
                      onDeactivateCategory(
                        category.id
                      )
                  )
                }
              />
            )
          )}
        </HierarchyColumn>

        <HierarchyColumn
          title="Estándares"
          subtitle={
            selectedCategoryId
              ? `${standards.length} de la categoría`
              : `${standards.length} registros`
          }
          canAdd={canEdit}
          onAdd={() =>
            setEditor({
              kind:
                "estandar",
              current: null,
            })
          }
        >
          {standards.map(
            (standard) => (
              <HierarchyItem
                key={
                  standard.id
                }
                title={
                  standard.nombre
                }
                subtitle={`${
                  standard.codigo ??
                  "Sin código"
                } · ${
                  standard
                    .gruposMinisteriales
                    .length
                } grupos`}
                active={
                  selectedStandardId ===
                  standard.id
                }
                status={
                  standard.estado
                }
                onClick={() =>
                  selectStandard(
                    standard.id
                  )
                }
                canEdit={canEdit}
                onEdit={() =>
                  setEditor({
                    kind:
                      "estandar",
                    current:
                      standard,
                  })
                }
                onDeactivate={() =>
                  void deactivate(
                    `el estándar ${standard.nombre}`,
                    () =>
                      onDeactivateStandard(
                        standard.id
                      )
                  )
                }
              />
            )
          )}
        </HierarchyColumn>

        <HierarchyColumn
          title="Aspectos"
          subtitle={
            selectedStandardId
              ? `${aspects.length} del estándar`
              : `${aspects.length} registros`
          }
          canAdd={canEdit}
          onAdd={() =>
            setAspectEditor({
              open: true,
              current: null,
            })
          }
        >
          {aspects.map(
            (aspect) => (
              <HierarchyItem
                key={
                  aspect.id
                }
                title={
                  aspect.nombre
                }
                subtitle={`${
                  aspect.codigo ??
                  "Sin código"
                } · Orden ${
                  aspect.orden
                }`}
                active={false}
                status={
                  aspect.estado
                }
                onClick={() =>
                  setAspectEditor(
                    {
                      open: true,
                      current:
                        aspect,
                    }
                  )
                }
                canEdit={canEdit}
                onEdit={() =>
                  setAspectEditor(
                    {
                      open: true,
                      current:
                        aspect,
                    }
                  )
                }
                onDeactivate={() =>
                  void deactivate(
                    `el aspecto ${aspect.nombre}`,
                    () =>
                      onDeactivateAspect(
                        aspect.id
                      )
                  )
                }
              />
            )
          )}
        </HierarchyColumn>
      </div>

      <CatalogEditorModal
        open={Boolean(editor)}
        kind={
          editor?.kind ??
          "ciclo"
        }
        current={
          editor?.current ??
          null
        }
        versionSupermatrizId={
          versionSupermatrizId
        }
        catalogs={catalogs}
        onClose={() =>
          setEditor(null)
        }
        onSaveCycle={
          onSaveCycle
        }
        onSaveCategory={
          onSaveCategory
        }
        onSaveStandard={
          onSaveStandard
        }
        onSaveProcess={
          async () =>
            undefined
        }
      />

      <AspectEditorModal
        open={
          aspectEditor.open
        }
        current={
          aspectEditor.current
        }
        versionSupermatrizId={
          versionSupermatrizId
        }
        catalogs={catalogs}
        onClose={() =>
          setAspectEditor({
            open: false,
            current: null,
          })
        }
        onSave={onSaveAspect}
      />
    </div>
  );
}

function HierarchyColumn({
  title,
  subtitle,
  canAdd,
  onAdd,
  children,
}: {
  title: string;
  subtitle: string;
  canAdd: boolean;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-neutral-800/70 bg-[#111111]">
      <header className="flex items-center justify-between gap-3 border-b border-neutral-800/70 px-4 py-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-white">
            {title}
          </h3>
          <p className="mt-0.5 text-[11px] text-neutral-500">
            {subtitle}
          </p>
        </div>

        {canAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
            title={`Crear ${title.toLowerCase()}`}
          >
            <Plus size={16} />
          </button>
        )}
      </header>

      <div className="max-h-[650px] space-y-2 overflow-y-auto p-3">
        {children}
      </div>
    </section>
  );
}

function HierarchyItem({
  title,
  subtitle,
  status,
  active,
  onClick,
  canEdit,
  onEdit,
  onDeactivate,
}: {
  title: string;
  subtitle: string;
  status: "ACTIVO" | "INACTIVO";
  active: boolean;
  onClick: () => void;
  canEdit: boolean;
  onEdit: () => void;
  onDeactivate: () => void;
}) {
  return (
    <article
      className={`rounded-xl border p-3 transition-colors ${
        active
          ? "border-cyan-500/30 bg-cyan-500/10"
          : "border-neutral-800 bg-[#0a0a0a] hover:border-neutral-700"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium text-neutral-200">
            {title}
          </p>
          <StatusBadge
            status={status}
          />
        </div>
        <p className="mt-2 line-clamp-2 text-[11px] text-neutral-500">
          {subtitle}
        </p>
      </button>

      {canEdit && (
        <div className="mt-3 flex gap-2 border-t border-neutral-800 pt-3">
          <button
            type="button"
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-800 px-2 py-2 text-[11px] text-neutral-300 hover:text-white"
          >
            <Edit2 size={13} />
            Editar
          </button>
          <button
            type="button"
            onClick={
              onDeactivate
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 text-red-400"
            title="Desactivar"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </article>
  );
}
