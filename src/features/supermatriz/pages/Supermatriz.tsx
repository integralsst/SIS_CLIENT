import {
  FileSpreadsheet,
  Layers3,
  Plus,
  RefreshCw,
  Rows3,
  Workflow,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "../../auth/context/AuthContext";
import SupermatrizFilters from "../components/SupermatrizFilters";
import SupermatrizTable from "../components/SupermatrizTable";
import SupermatrizTaskModal from "../components/SupermatrizTaskModal";
import VersionModal from "../components/VersionModal";
import { useSupermatriz } from "../hooks/useSupermatriz";
import type { MatrixTask } from "../types/supermatriz.types";

const editingRoles = new Set(["ADMIN", "OWNER", "SUPERADMIN"]);

export default function Supermatriz() {
  const { user, token } = useAuth();
  const matrix = useSupermatriz(token);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<MatrixTask | null>(null);

  if (!user) return null;

  const canEdit = editingRoles.has(user.role);
  const activeVersion = matrix.catalogs.versiones.find(
    (version) =>
      String(version.id) === matrix.filters.versionSupermatrizId
  );

  const openCreateTask = () => {
    setEditingTask(null);
    setTaskModalOpen(true);
  };

  const openEditTask = (task: MatrixTask) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleDeactivate = async (task: MatrixTask) => {
    const confirmed = window.confirm(
      `¿Desactivar la fila "${task.codigo ?? task.aspecto.nombre}"? El historial se conservará.`
    );

    if (!confirmed) return;

    try {
      await matrix.deactivateTask(task);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "No fue posible desactivar la fila."
      );
    }
  };

  return (
    <div className="mx-auto flex min-h-full min-w-0 max-w-[1700px] flex-col gap-5">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-500">
            <FileSpreadsheet size={15} />
            Estructura maestra SG-SST
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Supermatriz
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-400">
            Administra la relación entre ciclo PHVA, categoría, estándar,
            proceso, aspecto y plan de acción específico.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => void matrix.reload()}
            className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-[#111111] px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white"
          >
            <RefreshCw size={17} />
            Actualizar
          </button>

          {canEdit && (
            <>
              <button
                type="button"
                onClick={() => setVersionModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-300"
              >
                <Layers3 size={17} />
                Nueva versión
              </button>
              <button
                type="button"
                onClick={openCreateTask}
                disabled={matrix.catalogs.versiones.length === 0}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={17} />
                Nueva fila
              </button>
            </>
          )}
        </div>
      </header>

      {matrix.error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {matrix.error}
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<Layers3 size={18} />}
          label="Versión seleccionada"
          value={activeVersion?.nombre ?? "Todas"}
          secondary={activeVersion?.estado ?? "Sin filtro"}
        />
        <Metric
          icon={<Rows3 size={18} />}
          label="Filas encontradas"
          value={String(matrix.result.paginacion.total)}
          secondary={`Página ${matrix.result.paginacion.pagina} de ${matrix.result.paginacion.totalPaginas}`}
        />
        <Metric
          icon={<Workflow size={18} />}
          label="Procesos disponibles"
          value={String(matrix.catalogs.procesos.length)}
          secondary="Catálogo activo"
        />
        <Metric
          icon={<FileSpreadsheet size={18} />}
          label="Aspectos disponibles"
          value={String(matrix.catalogs.aspectos.length)}
          secondary="Con plan de acción"
        />
      </section>

      <SupermatrizFilters
        catalogs={matrix.catalogs}
        filters={matrix.filters}
        onChange={matrix.updateFilters}
      />

      <SupermatrizTable
        tasks={matrix.result.items}
        loading={matrix.loadingTasks || matrix.loadingCatalogs}
        canEdit={canEdit}
        onEdit={openEditTask}
        onDeactivate={(task) => void handleDeactivate(task)}
      />

      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-neutral-800/70 bg-[#111111] px-4 py-3 text-xs text-neutral-500 sm:flex-row">
        <span>
          Mostrando {matrix.result.items.length} de {matrix.result.paginacion.total} filas
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={matrix.filters.pagina <= 1}
            onClick={() =>
              matrix.updateFilters({ pagina: matrix.filters.pagina - 1 })
            }
            className="rounded-lg border border-neutral-800 px-3 py-2 disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={
              matrix.filters.pagina >=
              matrix.result.paginacion.totalPaginas
            }
            onClick={() =>
              matrix.updateFilters({ pagina: matrix.filters.pagina + 1 })
            }
            className="rounded-lg border border-neutral-800 px-3 py-2 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>

      <SupermatrizTaskModal
        open={taskModalOpen}
        task={editingTask}
        catalogs={matrix.catalogs}
        defaultVersionId={matrix.filters.versionSupermatrizId}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={(payload) => matrix.saveTask(editingTask, payload)}
      />

      <VersionModal
        open={versionModalOpen}
        onClose={() => setVersionModalOpen(false)}
        onSave={matrix.saveVersion}
      />
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  secondary,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondary: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-800/70 bg-[#111111] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-neutral-500">{label}</p>
          <p className="mt-2 truncate text-xl font-bold text-white">{value}</p>
          <p className="mt-1 text-[11px] text-neutral-600">{secondary}</p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-500/15 bg-cyan-500/10 text-cyan-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
