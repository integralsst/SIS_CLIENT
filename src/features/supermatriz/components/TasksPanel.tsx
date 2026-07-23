import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  Layers3,
  Plus,
  Route,
  Rows3,
  Workflow,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  confirmAction,
  errorMessage,
  showErrorAlert,
  showSuccessToast,
} from "../../../lib/stack44-alerts";
import type {
  AspectCatalog,
  AspectPayload,
  CyclePayload,
  MatrixCatalogs,
  MatrixFilters,
  MatrixTask,
  MatrixTaskListResponse,
  MatrixTaskPayload,
  PhvaCycle,
  ProcessCatalog,
  ProcessPayload,
  Standard,
  StandardCategory,
  StandardCategoryPayload,
  StandardPayload,
} from "../types/supermatriz.types";
import AspectEditorModal from "./AspectEditorModal";
import CatalogEditorModal, {
  type CatalogEditorKind,
  type CatalogEditorRecord,
} from "./CatalogEditorModal";
import MatrixTaskDetailModal from "./MatrixTaskDetailModal";
import SupermatrizFilters from "./SupermatrizFilters";
import SupermatrizTable from "./SupermatrizTable";
import SupermatrizTaskModal from "./SupermatrizTaskModal";

interface Props {
  versionSupermatrizId: number;
  catalogs: MatrixCatalogs;
  filters: MatrixFilters;
  result: MatrixTaskListResponse;
  loading: boolean;
  canEdit: boolean;
  initialProcessId?: number | null;
  onInitialProcessConsumed?: () => void;
  onFiltersChange: (
    patch: Partial<MatrixFilters>
  ) => void;
  onSaveTask: (
    current: MatrixTask | null,
    payload: MatrixTaskPayload
  ) => Promise<unknown>;
  onDeactivateTask: (
    id: number
  ) => Promise<unknown>;
  onSaveCycle: (
    current: PhvaCycle | null,
    payload: CyclePayload
  ) => Promise<unknown>;
  onSaveCategory: (
    current: StandardCategory | null,
    payload: StandardCategoryPayload
  ) => Promise<unknown>;
  onSaveStandard: (
    current: Standard | null,
    payload: StandardPayload
  ) => Promise<unknown>;
  onSaveAspect: (
    current: AspectCatalog | null,
    payload: AspectPayload
  ) => Promise<unknown>;
  onSaveProcess: (
    current: ProcessCatalog | null,
    payload: ProcessPayload
  ) => Promise<unknown>;
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
  onDeactivateProcess: (
    id: number
  ) => Promise<unknown>;
}

interface CatalogEditorState {
  open: boolean;
  kind: CatalogEditorKind;
  current: CatalogEditorRecord | null;
  initialParentId: number | null;
}

const CLOSED_CATALOG_EDITOR: CatalogEditorState = {
  open: false,
  kind: "ciclo",
  current: null,
  initialParentId: null,
};

const guideSteps = [
  {
    number: "1",
    title: "Ciclo PHVA",
    text: "Nivel superior",
    icon: Route,
  },
  {
    number: "2",
    title: "Categoría",
    text: "Agrupa estándares",
    icon: Layers3,
  },
  {
    number: "3",
    title: "Estándar",
    text: "Contiene aspectos",
    icon: FileText,
  },
  {
    number: "4",
    title: "Aspecto",
    text: "Punto evaluable",
    icon: ClipboardCheck,
  },
  {
    number: "5",
    title: "Proceso",
    text: "Forma de trabajo",
    icon: Workflow,
  },
  {
    number: "6",
    title: "Fila",
    text: "Une y ejecuta",
    icon: Rows3,
  },
];

export default function TasksPanel({
  versionSupermatrizId,
  catalogs,
  filters,
  result,
  loading,
  canEdit,
  initialProcessId = null,
  onInitialProcessConsumed,
  onFiltersChange,
  onSaveTask,
  onDeactivateTask,
  onSaveCycle,
  onSaveCategory,
  onSaveStandard,
  onSaveAspect,
  onSaveProcess,
  onDeactivateCycle,
  onDeactivateCategory,
  onDeactivateStandard,
  onDeactivateAspect,
  onDeactivateProcess,
}: Props) {
  const [editingTask, setEditingTask] =
    useState<MatrixTask | null>(null);
  const [viewingTask, setViewingTask] =
    useState<MatrixTask | null>(null);
  const [wizardOpen, setWizardOpen] =
    useState(false);
  const [processPresetId, setProcessPresetId] =
    useState<number | null>(null);
  const [deactivatingTaskId, setDeactivatingTaskId] =
    useState<number | null>(null);
  const [catalogEditor, setCatalogEditor] =
    useState<CatalogEditorState>(
      CLOSED_CATALOG_EDITOR
    );
  const [aspectEditor, setAspectEditor] =
    useState<{
      open: boolean;
      current: AspectCatalog | null;
      initialStandardId: number | null;
    }>({
      open: false,
      current: null,
      initialStandardId: null,
    });

  useEffect(() => {
    if (!initialProcessId || !canEdit) {
      return;
    }

    openNewTask(initialProcessId);
    onInitialProcessConsumed?.();
  }, [
    initialProcessId,
    canEdit,
    onInitialProcessConsumed,
  ]);

  function openNewTask(
    processId: number | null = null
  ) {
    setEditingTask(null);
    setProcessPresetId(processId);
    setWizardOpen(true);
  }

  function openEditTask(task: MatrixTask) {
    setViewingTask(null);
    setEditingTask(task);
    setProcessPresetId(null);
    setWizardOpen(true);
  }

  function openCatalogEditor(
    kind: CatalogEditorKind,
    current: CatalogEditorRecord,
    initialParentId: number | null = null
  ) {
    setCatalogEditor({
      open: true,
      kind,
      current,
      initialParentId,
    });
  }

  function openAspectEditor(
    current: AspectCatalog
  ) {
    setAspectEditor({
      open: true,
      current,
      initialStandardId:
        current.estandarId,
    });
  }

  async function saveTask(
    payload: MatrixTaskPayload
  ) {
    const wasEditing =
      Boolean(editingTask);
    const response = await onSaveTask(
      editingTask,
      payload
    );

    void showSuccessToast(
      wasEditing
        ? "Fila actualizada"
        : "Fila creada",
      wasEditing
        ? "Los cambios ya aparecen en la matriz."
        : "La estructura y la operación quedaron conectadas correctamente."
    );

    return response;
  }

  async function deactivateTask(
    task: MatrixTask
  ) {
    const confirmation =
      await confirmAction({
        icon: "warning",
        title: "¿Desactivar esta fila?",
        text: `La fila “${task.codigo ?? `#${task.id}`}” dejará de utilizarse, pero permanecerá en el historial de la versión.`,
        confirmText: "Sí, desactivar",
        cancelText: "Cancelar",
        danger: true,
      });

    if (!confirmation.isConfirmed) return;

    setDeactivatingTaskId(task.id);

    try {
      await onDeactivateTask(task.id);
      setViewingTask(null);
      void showSuccessToast(
        "Fila desactivada",
        "La matriz y los contadores se actualizaron automáticamente."
      );
    } catch (error) {
      await showErrorAlert(
        "No se pudo desactivar la fila",
        errorMessage(error)
      );
    } finally {
      setDeactivatingTaskId(null);
    }
  }

  async function deactivateCatalogCurrent() {
    const record = catalogEditor.current;
    if (!record) return;

    const confirmation =
      await confirmAction({
        icon: "warning",
        title: `¿Desactivar ${record.nombre}?`,
        text: "El backend protegerá la operación si todavía existen elementos activos que dependen de este registro.",
        confirmText: "Sí, desactivar",
        cancelText: "Cancelar",
        danger: true,
      });

    if (!confirmation.isConfirmed) {
      return false;
    }

    switch (catalogEditor.kind) {
      case "ciclo":
        await onDeactivateCycle(record.id);
        break;
      case "categoria":
        await onDeactivateCategory(record.id);
        break;
      case "estandar":
        await onDeactivateStandard(record.id);
        break;
      case "proceso":
        await onDeactivateProcess(record.id);
        break;
    }

    void showSuccessToast(
      "Registro desactivado",
      "La matriz se actualizó automáticamente."
    );

    return true;
  }

  async function deactivateAspectCurrent() {
    const aspect = aspectEditor.current;
    if (!aspect) return;

    const confirmation =
      await confirmAction({
        icon: "warning",
        title: `¿Desactivar ${aspect.nombre}?`,
        text: "Si el aspecto está siendo utilizado por filas activas, el backend impedirá la operación para proteger la relación.",
        confirmText: "Sí, desactivar",
        cancelText: "Cancelar",
        danger: true,
      });

    if (!confirmation.isConfirmed) {
      return false;
    }

    await onDeactivateAspect(aspect.id);
    void showSuccessToast(
      "Aspecto desactivado",
      "La matriz se actualizó automáticamente."
    );

    return true;
  }

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-neutral-800/70 bg-[#111111] p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
              <Rows3 size={19} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Constructor de la Supermatriz
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral-500">
                Cada tarjeta representa una fila completa. El asistente te guía para crear la ruta, el aspecto, el proceso y la ejecución sin saltar entre pestañas.
              </p>
            </div>
          </div>

          {canEdit && (
            <button
              type="button"
              onClick={() => openNewTask()}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-black transition hover:bg-neutral-200"
            >
              <Plus size={17} />
              Construir nueva fila
            </button>
          )}
        </div>
      </header>

      {!canEdit && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          La versión seleccionada es de solo lectura. Puedes consultar cada fila, pero debes clonar la versión para modificarla.
        </div>
      )}

      <StructureGuide />

      <SupermatrizFilters
        catalogs={catalogs}
        filters={filters}
        onChange={onFiltersChange}
      />

      <SupermatrizTable
        tasks={result.items}
        loading={loading}
        canEdit={canEdit}
        deactivatingTaskId={
          deactivatingTaskId
        }
        onView={setViewingTask}
        onEdit={openEditTask}
        onDeactivate={(task) =>
          void deactivateTask(task)
        }
        onEditCycle={(cycle) =>
          openCatalogEditor(
            "ciclo",
            cycle
          )
        }
        onEditCategory={(category) =>
          openCatalogEditor(
            "categoria",
            category,
            category.cicloPhvaId
          )
        }
        onEditStandard={(standard) =>
          openCatalogEditor(
            "estandar",
            standard,
            standard.categoriaEstandarId
          )
        }
        onEditAspect={openAspectEditor}
        onEditProcess={(process) =>
          openCatalogEditor(
            "proceso",
            process
          )
        }
      />

      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-neutral-800/70 bg-[#111111] px-4 py-3 text-xs text-neutral-500 sm:flex-row">
        <span>
          Mostrando {result.items.length} de{" "}
          {result.paginacion.total} filas
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={
              filters.pagina <= 1 || loading
            }
            onClick={() =>
              onFiltersChange({
                pagina: filters.pagina - 1,
              })
            }
            className="rounded-lg border border-neutral-800 px-3 py-2 disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={
              filters.pagina >=
                result.paginacion
                  .totalPaginas || loading
            }
            onClick={() =>
              onFiltersChange({
                pagina: filters.pagina + 1,
              })
            }
            className="rounded-lg border border-neutral-800 px-3 py-2 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>

      <SupermatrizTaskModal
        open={wizardOpen}
        task={editingTask}
        catalogs={catalogs}
        versionSupermatrizId={
          versionSupermatrizId
        }
        initialProcessId={processPresetId}
        onClose={() => {
          setWizardOpen(false);
          setEditingTask(null);
          setProcessPresetId(null);
        }}
        onSaveTask={saveTask}
        onSaveCycle={onSaveCycle}
        onSaveCategory={onSaveCategory}
        onSaveStandard={onSaveStandard}
        onSaveAspect={onSaveAspect}
        onSaveProcess={onSaveProcess}
      />

      <MatrixTaskDetailModal
        open={Boolean(viewingTask)}
        task={viewingTask}
        canEdit={canEdit}
        onClose={() =>
          setViewingTask(null)
        }
        onEdit={openEditTask}
      />

      <CatalogEditorModal
        open={catalogEditor.open}
        kind={catalogEditor.kind}
        current={catalogEditor.current}
        versionSupermatrizId={
          versionSupermatrizId
        }
        catalogs={catalogs}
        initialParentId={
          catalogEditor.initialParentId
        }
        onClose={() =>
          setCatalogEditor(
            CLOSED_CATALOG_EDITOR
          )
        }
        onDeactivate={
          catalogEditor.current
            ? deactivateCatalogCurrent
            : undefined
        }
        onSaveCycle={onSaveCycle}
        onSaveCategory={onSaveCategory}
        onSaveStandard={onSaveStandard}
        onSaveProcess={onSaveProcess}
      />

      <AspectEditorModal
        open={aspectEditor.open}
        current={aspectEditor.current}
        versionSupermatrizId={
          versionSupermatrizId
        }
        catalogs={catalogs}
        initialStandardId={
          aspectEditor.initialStandardId
        }
        onClose={() =>
          setAspectEditor({
            open: false,
            current: null,
            initialStandardId: null,
          })
        }
        onDeactivate={
          aspectEditor.current
            ? deactivateAspectCurrent
            : undefined
        }
        onSave={onSaveAspect}
      />
    </div>
  );
}

function StructureGuide() {
  return (
    <section className="rounded-2xl border border-neutral-800/70 bg-[#0d0d0d] p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="xl:w-52">
          <p className="text-xs font-semibold text-white">
            Cómo se construye una fila
          </p>
          <p className="mt-1 text-[11px] leading-5 text-neutral-600">
            El asistente sigue este orden y evita relaciones incompletas.
          </p>
        </div>

        <div className="grid flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {guideSteps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="relative flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#090909] p-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Icon size={15} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-neutral-300">
                    {item.number}. {item.title}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-neutral-600">
                    {item.text}
                  </p>
                </div>
                {index <
                  guideSteps.length - 1 && (
                  <ArrowRight className="absolute -right-2.5 z-10 hidden h-4 w-4 rounded-full bg-[#0d0d0d] text-neutral-700 2xl:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
