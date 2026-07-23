import {
  FileClock,
  Layers3,
  Loader2,
  RefreshCw,
  Rows3,
  Settings2,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import AppSelect from "../../../components/ui/AppSelect";
import {
  errorMessage,
  showErrorAlert,
  showSuccessToast,
} from "../../../lib/stack44-alerts";
import { useAuth } from "../../auth/context/AuthContext";
import HistoryPanel from "../components/HistoryPanel";
import StatusBadge from "../components/StatusBadge";
import TasksPanel from "../components/TasksPanel";
import VersionsManager from "../components/VersionsManager";
import { useSupermatrizAdmin } from "../hooks/useSupermatrizAdmin";
import type {
  SupermatrizTab,
} from "../types/supermatriz.types";

const ADMIN_ROLES = new Set([
  "ADMIN",
  "OWNER",
  "PROPIETARIO",
  "SUPERADMIN",
]);

const tabs: Array<{
  id: SupermatrizTab;
  label: string;
  description: string;
  icon: typeof Rows3;
}> = [
  {
    id: "matriz",
    label: "Matriz maestra",
    description: "Crear y editar todo",
    icon: Rows3,
  },
  {
    id: "versiones",
    label: "Versiones",
    description: "Publicar, clonar o cerrar",
    icon: Layers3,
  },
  {
    id: "historial",
    label: "Historial",
    description: "Trazabilidad de cambios",
    icon: FileClock,
  },
];

export default function Supermatriz() {
  const { user, token } = useAuth();
  const matrix = useSupermatrizAdmin(token);
  const [activeTab, setActiveTab] =
    useState<SupermatrizTab>("matriz");

  const canAdminister = Boolean(
    user && ADMIN_ROLES.has(user.role)
  );

  const canEdit =
    canAdminister && matrix.canEditSelectedVersion;
  const selectedVersion = matrix.selectedVersion;

  const metrics = useMemo(
    () => [
      {
        label: "Ciclos",
        value: matrix.catalogs.ciclosPhva.length,
      },
      {
        label: "Estándares",
        value: matrix.catalogs.estandares.length,
      },
      {
        label: "Aspectos",
        value: matrix.catalogs.aspectos.length,
      },
      {
        label: "Procesos",
        value: matrix.catalogs.procesos.length,
      },
      {
        label: "Filas",
        value: matrix.tasks.paginacion.total,
      },
    ],
    [
      matrix.catalogs.aspectos.length,
      matrix.catalogs.ciclosPhva.length,
      matrix.catalogs.estandares.length,
      matrix.catalogs.procesos.length,
      matrix.tasks.paginacion.total,
    ]
  );

  if (
    matrix.loadingVersions &&
    matrix.versions.length === 0
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-[2200px] space-y-5">
      {(matrix.refreshing || matrix.mutating) && (
        <div className="sticky top-0 z-[70] flex items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-[#071013]/95 px-4 py-2 text-xs font-semibold text-cyan-300 shadow-xl backdrop-blur">
          <Loader2 className="h-4 w-4 animate-spin" />
          {matrix.refreshing
            ? "Actualizando la Supermatriz…"
            : "Guardando cambios y sincronizando la matriz…"}
        </div>
      )}

      <header className="rounded-[2rem] border border-neutral-800/70 bg-[#111111] p-5 sm:p-7">
        <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
              <Settings2 size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Supermatriz maestra
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-500">
                Una sola pantalla para administrar ciclos PHVA, categorías, estándares, aspectos, procesos y filas. La vista conserva la lógica visual del Excel, pero protege todas las relaciones del backend.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row 2xl:w-auto">
            <div className="min-w-0 sm:min-w-[340px]">
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                Versión seleccionada
              </label>
              <AppSelect
                value={matrix.selectedVersionId ?? ""}
                onChange={(event) =>
                  matrix.setSelectedVersionId(
                    Number(event.target.value)
                  )
                }
              >
                {matrix.versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.nombre} · {version.estado}
                  </option>
                ))}
              </AppSelect>
            </div>

            <button
              type="button"
              disabled={matrix.refreshing || matrix.mutating}
              onClick={async () => {
                try {
                  await matrix.refreshAll();
                  void showSuccessToast(
                    "Supermatriz actualizada",
                    "La información visible ya corresponde a los datos más recientes."
                  );
                } catch (requestError) {
                  await showErrorAlert(
                    "No se pudo actualizar",
                    errorMessage(requestError)
                  );
                }
              }}
              className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-[#0a0a0a] px-4 py-2.5 text-sm text-neutral-300 transition hover:text-white disabled:cursor-wait disabled:opacity-50"
            >
              {matrix.refreshing ? (
                <Loader2
                  size={16}
                  className="animate-spin text-cyan-400"
                />
              ) : (
                <RefreshCw size={16} />
              )}
              {matrix.refreshing
                ? "Actualizando…"
                : "Actualizar"}
            </button>
          </div>
        </div>

        {selectedVersion && (
          <div className="mt-6 grid gap-4 border-t border-neutral-800 pt-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <div className="flex min-w-0 items-start gap-3">
              <StatusBadge status={selectedVersion.estado} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-200">
                  {selectedVersion.nombre}
                </p>
                <p className="mt-1 text-sm leading-6 text-neutral-500">
                  {selectedVersion.descripcion ??
                    "Sin descripción"}
                </p>
                {selectedVersion.estado !== "BORRADOR" && (
                  <p className="mt-2 text-xs text-amber-300">
                    Esta versión está protegida. Clónala desde Versiones para modificarla.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="min-w-[92px] rounded-xl border border-neutral-800 bg-[#0a0a0a] px-3 py-2 text-center"
                >
                  <p className="text-lg font-bold text-white">
                    {metric.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-600">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {matrix.error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {matrix.error}
        </div>
      )}

      <nav className="grid gap-2 rounded-2xl border border-neutral-800/70 bg-[#111111] p-2 sm:grid-cols-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                active
                  ? "bg-cyan-500/10 text-cyan-200"
                  : "text-neutral-500 hover:bg-neutral-800/60 hover:text-white"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  active
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "bg-neutral-800 text-neutral-600"
                }`}
              >
                <Icon size={17} />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {tab.label}
                </p>
                <p className="mt-0.5 text-[10px] text-neutral-600">
                  {tab.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {activeTab === "versiones" ? (
        <VersionsManager
          versions={matrix.versions}
          selectedVersionId={selectedVersion?.id ?? 0}
          canAdminister={canAdminister}
          onSelect={matrix.setSelectedVersionId}
          onCreate={matrix.createVersion}
          onUpdate={matrix.updateVersion}
          onClone={matrix.cloneVersion}
          onPublish={matrix.publishVersion}
          onClose={matrix.closeVersion}
        />
      ) : !selectedVersion ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 px-6 py-20 text-center text-sm text-neutral-500">
          No existe una versión seleccionada. Abre Versiones para crear una.
        </div>
      ) : activeTab === "historial" ? (
        <HistoryPanel
          history={matrix.history}
          loading={matrix.loadingHistory}
          onPageChange={matrix.loadHistory}
        />
      ) : (
        <TasksPanel
          versionSupermatrizId={selectedVersion.id}
          catalogs={matrix.catalogs}
          filters={matrix.filters}
          result={matrix.tasks}
          loading={
            matrix.loadingTasks || matrix.loadingCatalogs
          }
          canEdit={canEdit}
          onFiltersChange={matrix.updateFilters}
          onSaveTask={matrix.saveTask}
          onDeactivateTask={matrix.deactivateTask}
          onSaveCycle={matrix.saveCycle}
          onSaveCategory={matrix.saveCategory}
          onSaveStandard={matrix.saveStandard}
          onSaveAspect={matrix.saveAspect}
          onSaveProcess={matrix.saveProcess}
          onDeactivateCycle={matrix.deactivateCycle}
          onDeactivateCategory={matrix.deactivateCategory}
          onDeactivateStandard={matrix.deactivateStandard}
          onDeactivateAspect={matrix.deactivateAspect}
          onDeactivateProcess={matrix.deactivateProcess}
        />
      )}
    </div>
  );
}
