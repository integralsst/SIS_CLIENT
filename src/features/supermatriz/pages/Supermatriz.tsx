import {
  FileClock,
  GitBranch,
  Layers3,
  RefreshCw,
  Rows3,
  Settings2,
  Workflow,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import AppSelect from "../../../components/ui/AppSelect";
import { useAuth } from "../../auth/context/AuthContext";
import HistoryPanel from "../components/HistoryPanel";
import ProcessManager from "../components/ProcessManager";
import StatusBadge from "../components/StatusBadge";
import StructureManager from "../components/StructureManager";
import TasksPanel from "../components/TasksPanel";
import VersionsManager from "../components/VersionsManager";
import { useSupermatrizAdmin } from "../hooks/useSupermatrizAdmin";
import type {
  SupermatrizTab,
} from "../types/supermatriz.types";

const ADMIN_ROLES =
  new Set([
    "ADMIN",
    "OWNER",
    "SUPERADMIN",
  ]);

const tabs: Array<{
  id: SupermatrizTab;
  label: string;
  icon: typeof Rows3;
}> = [
  {
    id: "filas",
    label: "Filas",
    icon: Rows3,
  },
  {
    id: "estructura",
    label: "Estructura",
    icon: GitBranch,
  },
  {
    id: "procesos",
    label: "Procesos",
    icon: Workflow,
  },
  {
    id: "versiones",
    label: "Versiones",
    icon: Layers3,
  },
  {
    id: "historial",
    label: "Historial",
    icon: FileClock,
  },
];

export default function Supermatriz() {
  const { user, token } =
    useAuth();

  const matrix =
    useSupermatrizAdmin(
      token
    );

  const [activeTab, setActiveTab] =
    useState<SupermatrizTab>(
      "filas"
    );

  const canAdminister =
    Boolean(
      user &&
        ADMIN_ROLES.has(
          user.role
        )
    );

  const canEdit =
    canAdminister &&
    matrix.canEditSelectedVersion;

  const selectedVersion =
    matrix.selectedVersion;

  const metrics = useMemo(
    () => [
      {
        label: "Ciclos PHVA",
        value:
          matrix.catalogs
            .ciclosPhva.length,
      },
      {
        label: "Estándares",
        value:
          matrix.catalogs
            .estandares.length,
      },
      {
        label: "Aspectos",
        value:
          matrix.catalogs
            .aspectos.length,
      },
      {
        label: "Filas",
        value:
          matrix.tasks
            .paginacion.total,
      },
    ],
    [
      matrix.catalogs,
      matrix.tasks.paginacion
        .total,
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
    <div className="mx-auto max-w-[1800px] space-y-6">
      <header className="rounded-[2rem] border border-neutral-800/70 bg-[#111111] p-5 sm:p-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                <Settings2
                  size={21}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Supermatriz maestra
                </h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Administración versionada de la estructura que utilizarán todas las empresas.
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            <div className="min-w-0 sm:min-w-[320px]">
              <AppSelect
                value={
                  matrix.selectedVersionId ??
                  ""
                }
                onChange={(event) =>
                  matrix.setSelectedVersionId(
                    Number(
                      event.target.value
                    )
                  )
                }
              >
                {matrix.versions.map(
                  (version) => (
                    <option
                      key={
                        version.id
                      }
                      value={
                        version.id
                      }
                    >
                      {
                        version.nombre
                      }{" "}
                      ·{" "}
                      {
                        version.estado
                      }
                    </option>
                  )
                )}
              </AppSelect>
            </div>

            <button
              type="button"
              onClick={() =>
                void matrix.refreshAll()
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-[#0a0a0a] px-4 py-2.5 text-sm text-neutral-300 hover:text-white"
            >
              <RefreshCw
                size={16}
              />
              Actualizar
            </button>
          </div>
        </div>

        {selectedVersion && (
          <div className="mt-6 flex flex-col gap-4 border-t border-neutral-800 pt-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <StatusBadge
                status={
                  selectedVersion.estado
                }
              />
              <p className="truncate text-sm text-neutral-400">
                {selectedVersion.descripcion ??
                  "Sin descripción"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {metrics.map(
                (metric) => (
                  <div
                    key={
                      metric.label
                    }
                    className="rounded-xl border border-neutral-800 bg-[#0a0a0a] px-4 py-2 text-center"
                  >
                    <p className="text-lg font-bold text-white">
                      {
                        metric.value
                      }
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-neutral-600">
                      {
                        metric.label
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </header>

      {matrix.error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {matrix.error}
        </div>
      )}

      <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-neutral-800/70 bg-[#111111] p-2">
        {tabs.map((tab) => {
          const Icon =
            tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  tab.id
                )
              }
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab ===
                tab.id
                  ? "bg-cyan-500/10 text-cyan-300"
                  : "text-neutral-500 hover:bg-neutral-800/60 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {activeTab ===
        "versiones" ? (
        <VersionsManager
          versions={
            matrix.versions
          }
          selectedVersionId={
            selectedVersion?.id ??
            0
          }
          canAdminister={
            canAdminister
          }
          onSelect={
            matrix.setSelectedVersionId
          }
          onCreate={
            matrix.createVersion
          }
          onUpdate={
            matrix.updateVersion
          }
          onClone={
            matrix.cloneVersion
          }
          onPublish={
            matrix.publishVersion
          }
          onClose={
            matrix.closeVersion
          }
        />
      ) : !selectedVersion ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 px-6 py-20 text-center text-sm text-neutral-500">
          No existe una versión seleccionada. Abre la pestaña Versiones para crear una.
        </div>
      ) : (
        <>
          {activeTab ===
            "filas" && (
            <TasksPanel
              versionSupermatrizId={
                selectedVersion.id
              }
              catalogs={
                matrix.catalogs
              }
              filters={
                matrix.filters
              }
              result={
                matrix.tasks
              }
              loading={
                matrix.loadingTasks ||
                matrix.loadingCatalogs
              }
              canEdit={canEdit}
              onFiltersChange={
                matrix.updateFilters
              }
              onSave={
                matrix.saveTask
              }
              onDeactivate={
                matrix.deactivateTask
              }
            />
          )}

          {activeTab ===
            "estructura" && (
            <StructureManager
              versionSupermatrizId={
                selectedVersion.id
              }
              catalogs={
                matrix.catalogs
              }
              canEdit={canEdit}
              onSaveCycle={
                matrix.saveCycle
              }
              onSaveCategory={
                matrix.saveCategory
              }
              onSaveStandard={
                matrix.saveStandard
              }
              onSaveAspect={
                matrix.saveAspect
              }
              onDeactivateCycle={
                matrix.deactivateCycle
              }
              onDeactivateCategory={
                matrix.deactivateCategory
              }
              onDeactivateStandard={
                matrix.deactivateStandard
              }
              onDeactivateAspect={
                matrix.deactivateAspect
              }
            />
          )}

          {activeTab ===
            "procesos" && (
            <ProcessManager
              versionSupermatrizId={
                selectedVersion.id
              }
              catalogs={
                matrix.catalogs
              }
              canEdit={canEdit}
              onSaveProcess={
                matrix.saveProcess
              }
              onDeactivateProcess={
                matrix.deactivateProcess
              }
            />
          )}

          {activeTab ===
            "historial" && (
            <HistoryPanel
              history={
                matrix.history
              }
              loading={
                matrix.loadingHistory
              }
              onPageChange={
                matrix.loadHistory
              }
            />
          )}
        </>
      )}
    </div>
  );
}
