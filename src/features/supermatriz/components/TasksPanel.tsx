import {
  Plus,
  Rows3,
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
  MatrixCatalogs,
  MatrixFilters,
  MatrixTask,
  MatrixTaskListResponse,
  MatrixTaskPayload,
} from "../types/supermatriz.types";
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
  onSave: (
    current: MatrixTask | null,
    payload: MatrixTaskPayload
  ) => Promise<unknown>;
  onDeactivate: (
    id: number
  ) => Promise<unknown>;
}

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
  onSave,
  onDeactivate,
}: Props) {
  const [editingTask, setEditingTask] = useState<MatrixTask | null>(null);
  const [viewingTask, setViewingTask] = useState<MatrixTask | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [processPresetId, setProcessPresetId] = useState<number | null>(null);
  const [deactivatingTaskId, setDeactivatingTaskId] = useState<number | null>(null);

  useEffect(() => {
    if (!initialProcessId || !canEdit) return;

    setEditingTask(null);
    setProcessPresetId(initialProcessId);
    setModalOpen(true);
    onInitialProcessConsumed?.();
  }, [initialProcessId, canEdit, onInitialProcessConsumed]);

  async function deactivate(task: MatrixTask) {
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
      await onDeactivate(task.id);
      setViewingTask(null);

      void showSuccessToast(
        "Fila desactivada",
        "La tabla y los contadores se actualizaron automáticamente."
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

  async function saveTask(payload: MatrixTaskPayload) {
    const wasEditing = Boolean(editingTask);
    const result = await onSave(editingTask, payload);

    void showSuccessToast(
      wasEditing ? "Fila actualizada" : "Fila creada",
      "La información y los contadores ya están actualizados."
    );

    return result;
  }

  function openNewTask(processId: number | null = null) {
    setEditingTask(null);
    setProcessPresetId(processId);
    setModalOpen(true);
  }

  function openEditTask(task: MatrixTask) {
    setViewingTask(null);
    setProcessPresetId(null);
    setEditingTask(task);
    setModalOpen(true);
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 rounded-2xl border border-neutral-800/70 bg-[#111111] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
            <Rows3 size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Filas de la Supermatriz
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Cada fila vincula un aspecto, un proceso y una o varias categorías de gestión.
            </p>
          </div>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => openNewTask()}
            disabled={
              catalogs.aspectos.length === 0 ||
              catalogs.procesos.length === 0
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={17} />
            Nueva fila
          </button>
        )}
      </header>

      {!canEdit && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          La versión seleccionada es de solo lectura. Puedes abrir el detalle completo de cada fila, pero debes clonar la versión para modificarla.
        </div>
      )}

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
        onEdit={openEditTask}
        onDeactivate={(task) => void deactivate(task)}
      />

      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-neutral-800/70 bg-[#111111] px-4 py-3 text-xs text-neutral-500 sm:flex-row">
        <span>
          Mostrando {result.items.length} de {result.paginacion.total} filas
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
              filters.pagina >= result.paginacion.totalPaginas || loading
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
        open={modalOpen}
        task={editingTask}
        catalogs={catalogs}
        versionSupermatrizId={versionSupermatrizId}
        initialProcessId={processPresetId}
        onClose={() => {
          setModalOpen(false);
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
    </div>
  );
}
