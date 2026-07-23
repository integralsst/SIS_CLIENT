import {
  ChevronDown,
  FilePlus2,
  GitBranch,
  Layers3,
  Plus,
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
  onDeactivateTask: (id: number) => Promise<unknown>;
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
  onDeactivateCycle: (id: number) => Promise<unknown>;
  onDeactivateCategory: (id: number) => Promise<unknown>;
  onDeactivateStandard: (id: number) => Promise<unknown>;
  onDeactivateAspect: (id: number) => Promise<unknown>;
  onDeactivateProcess: (id: number) => Promise<unknown>;
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
  const [taskModalOpen, setTaskModalOpen] =
    useState(false);
  const [processPresetId, setProcessPresetId] =
    useState<number | null>(null);
  const [deactivatingTaskId, setDeactivatingTaskId] =
    useState<number | null>(null);
  const [createMenuOpen, setCreateMenuOpen] =
    useState(false);
  const [catalogEditor, setCatalogEditor] =
    useState<CatalogEditorState>(CLOSED_CATALOG_EDITOR);
  const [aspectEditor, setAspectEditor] = useState<{
    open: boolean;
    current: AspectCatalog | null;
    initialStandardId: number | null;
  }>({
    open: false,
    current: null,
    initialStandardId: null,
  });

  useEffect(() => {
    if (!initialProcessId || !canEdit) return;

    openNewTask(initialProcessId);
    onInitialProcessConsumed?.();
  }, [initialProcessId, canEdit, onInitialProcessConsumed]);

  function openCatalog(
    kind: CatalogEditorKind,
    current: CatalogEditorRecord | null = null,
    initialParentId: number | null = null
  ) {
    setCreateMenuOpen(false);
    setCatalogEditor({
      open: true,
      kind,
      current,
      initialParentId,
    });
  }

  function openAspect(
    current: AspectCatalog | null = null,
    initialStandardId: number | null = null
  ) {
    setCreateMenuOpen(false);
    setAspectEditor({
      open: true,
      current,
      initialStandardId,
    });
  }

  function openNewTask(processId: number | null = null) {
    setCreateMenuOpen(false);
    setEditingTask(null);
    setProcessPresetId(processId);
    setTaskModalOpen(true);
  }

  function openEditTask(task: MatrixTask) {
    setViewingTask(null);
    setProcessPresetId(null);
    setEditingTask(task);
    setTaskModalOpen(true);
  }

  async function saveTask(payload: MatrixTaskPayload) {
    const wasEditing = Boolean(editingTask);
    const response = await onSaveTask(editingTask, payload);

    void showSuccessToast(
      wasEditing ? "Fila actualizada" : "Fila creada",
      "La tabla, los filtros y los contadores ya están sincronizados."
    );

    return response;
  }

  async function deactivateTask(task: MatrixTask) {
    const confirmation = await confirmAction({
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

    const confirmation = await confirmAction({
      icon: "warning",
      title: `¿Desactivar ${record.nombre}?`,
      text: "El registro se conservará en el historial. Si todavía tiene elementos activos relacionados, el backend impedirá la operación para proteger la estructura.",
      confirmText: "Sí, desactivar",
      cancelText: "Cancelar",
      danger: true,
    });

    if (!confirmation.isConfirmed) return false;

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
      "La estructura visible ya fue actualizada."
    );

    return true;
  }

  async function deactivateAspectCurrent() {
    const aspect = aspectEditor.current;
    if (!aspect) return;

    const confirmation = await confirmAction({
      icon: "warning",
      title: `¿Desactivar ${aspect.nombre}?`,
      text: "El aspecto y su configuración permanecerán en el historial. Si está siendo usado por filas activas, el backend protegerá la relación.",
      confirmText: "Sí, desactivar",
      cancelText: "Cancelar",
      danger: true,
    });

    if (!confirmation.isConfirmed) return false;

    await onDeactivateAspect(aspect.id);
    void showSuccessToast(
      "Aspecto desactivado",
      "La matriz se actualizó automáticamente."
    );

    return true;
  }

  const canCreateRow =
    catalogs.aspectos.some((item) => item.estado === "ACTIVO") &&
    catalogs.procesos.some((item) => item.estado === "ACTIVO");

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-neutral-800/70 bg-[#111111] p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
              <Rows3 size={19} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Matriz maestra editable
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-neutral-500">
                Todo se administra desde aquí. Crea la estructura con el botón <strong className="text-neutral-300">Crear</strong> o pulsa directamente una celda para editar lo que está conectado.
              </p>
            </div>
          </div>

          {canEdit && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => openNewTask()}
                disabled={!canCreateRow}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
                title={
                  canCreateRow
                    ? "Crear una fila completa"
                    : "Primero crea por lo menos un aspecto y un proceso"
                }
              >
                <Plus size={17} />
                Nueva fila
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setCreateMenuOpen((current) => !current)
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/15"
                >
                  <FilePlus2 size={17} />
                  Crear estructura
                  <ChevronDown
                    size={15}
                    className={`transition-transform ${
                      createMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {createMenuOpen && (
                  <CreateMenu
                    onCreateCycle={() => openCatalog("ciclo")}
                    onCreateCategory={() =>
                      openCatalog("categoria")
                    }
                    onCreateStandard={() =>
                      openCatalog("estandar")
                    }
                    onCreateAspect={() => openAspect()}
                    onCreateProcess={() =>
                      openCatalog("proceso")
                    }
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {!canEdit && (
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-300">
            Esta versión es de solo lectura. Puedes consultar toda la matriz, pero debes clonar la versión para crear o modificar registros.
          </div>
        )}
      </header>

      <SupermatrizFilters
        catalogs={catalogs}
        filters={filters}
        onChange={onFiltersChange}
      />

      <SupermatrizTable
        tasks={result.items}
        loading={loading}
        canEdit={canEdit}
        deactivatingTaskId={deactivatingTaskId}
        onView={setViewingTask}
        onEditTask={openEditTask}
        onDeactivate={(task) => void deactivateTask(task)}
        onEditCycle={(cycle) => openCatalog("ciclo", cycle)}
        onEditCategory={(category) =>
          openCatalog("categoria", category)
        }
        onEditStandard={(standard) =>
          openCatalog("estandar", standard)
        }
        onEditAspect={(aspect) => openAspect(aspect)}
        onEditProcess={(process) =>
          openCatalog("proceso", process)
        }
      />

      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-neutral-800/70 bg-[#111111] px-4 py-3 text-xs text-neutral-500 sm:flex-row">
        <span>
          Mostrando {result.items.length} de{" "}
          {result.paginacion.total} filas
        </span>

        <div className="flex items-center gap-3">
          <span>
            Página {result.paginacion.pagina} de{" "}
            {result.paginacion.totalPaginas}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={filters.pagina <= 1 || loading}
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
                  result.paginacion.totalPaginas || loading
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
      </div>

      <SupermatrizTaskModal
        open={taskModalOpen}
        task={editingTask}
        catalogs={catalogs}
        versionSupermatrizId={versionSupermatrizId}
        initialProcessId={processPresetId}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
          setProcessPresetId(null);
        }}
        onSave={saveTask}
      />

      <MatrixTaskDetailModal
        open={Boolean(viewingTask)}
        task={viewingTask}
        canEdit={canEdit}
        onClose={() => setViewingTask(null)}
        onEdit={openEditTask}
      />

      <CatalogEditorModal
        open={catalogEditor.open}
        kind={catalogEditor.kind}
        current={catalogEditor.current}
        initialParentId={catalogEditor.initialParentId}
        versionSupermatrizId={versionSupermatrizId}
        catalogs={catalogs}
        onClose={() => setCatalogEditor(CLOSED_CATALOG_EDITOR)}
        onDeactivate={
          catalogEditor.current
            ? deactivateCatalogCurrent
            : undefined
        }
        onSaveCycle={async (current, payload) => {
          const result = await onSaveCycle(current, payload);
          void showSuccessToast(
            current ? "Ciclo actualizado" : "Ciclo creado",
            "Ya está disponible en la matriz."
          );
          return result;
        }}
        onSaveCategory={async (current, payload) => {
          const result = await onSaveCategory(current, payload);
          void showSuccessToast(
            current
              ? "Categoría actualizada"
              : "Categoría creada",
            "Ya está conectada con su ciclo PHVA."
          );
          return result;
        }}
        onSaveStandard={async (current, payload) => {
          const result = await onSaveStandard(current, payload);
          void showSuccessToast(
            current
              ? "Estándar actualizado"
              : "Estándar creado",
            "Ya está disponible para crear aspectos."
          );
          return result;
        }}
        onSaveProcess={async (current, payload) => {
          const result = await onSaveProcess(current, payload);
          void showSuccessToast(
            current ? "Proceso actualizado" : "Proceso creado",
            "Ya puede seleccionarse en una fila de la matriz."
          );
          return result;
        }}
      />

      <AspectEditorModal
        open={aspectEditor.open}
        current={aspectEditor.current}
        initialStandardId={aspectEditor.initialStandardId}
        versionSupermatrizId={versionSupermatrizId}
        catalogs={catalogs}
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
        onSave={async (current, payload) => {
          const result = await onSaveAspect(current, payload);
          void showSuccessToast(
            current ? "Aspecto actualizado" : "Aspecto creado",
            "Su plan, periodicidad y reglas ya aparecen en la matriz."
          );
          return result;
        }}
      />
    </div>
  );
}

function CreateMenu({
  onCreateCycle,
  onCreateCategory,
  onCreateStandard,
  onCreateAspect,
  onCreateProcess,
}: {
  onCreateCycle: () => void;
  onCreateCategory: () => void;
  onCreateStandard: () => void;
  onCreateAspect: () => void;
  onCreateProcess: () => void;
}) {
  return (
    <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[310px] overflow-hidden rounded-2xl border border-neutral-700 bg-[#111111] p-2 shadow-2xl">
      <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
        Construye de arriba hacia abajo
      </p>
      <CreateOption
        number="1"
        icon={Layers3}
        title="Ciclo PHVA"
        description="Nivel superior: Planear, Hacer, Verificar o Actuar."
        onClick={onCreateCycle}
      />
      <CreateOption
        number="2"
        icon={GitBranch}
        title="Categoría del estándar"
        description="Agrupa estándares dentro de un ciclo."
        onClick={onCreateCategory}
      />
      <CreateOption
        number="3"
        icon={GitBranch}
        title="Estándar"
        description="Contiene aspectos y grupos 7/21/60."
        onClick={onCreateStandard}
      />
      <CreateOption
        number="4"
        icon={FilePlus2}
        title="Aspecto"
        description="Punto evaluable con plan, vigencia y evidencia."
        onClick={onCreateAspect}
      />
      <CreateOption
        number="5"
        icon={Workflow}
        title="Proceso"
        description="Se conecta con el aspecto por medio de una fila."
        onClick={onCreateProcess}
      />
    </div>
  );
}

function CreateOption({
  number,
  icon: Icon,
  title,
  description,
  onClick,
}: {
  number: string;
  icon: typeof Layers3;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left hover:bg-neutral-800/70"
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/15 bg-cyan-500/5 text-cyan-400">
        <Icon size={17} />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black text-black">
          {number}
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs leading-5 text-neutral-600">
          {description}
        </p>
      </div>
    </button>
  );
}
