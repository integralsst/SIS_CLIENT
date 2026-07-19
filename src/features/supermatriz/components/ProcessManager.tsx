import {
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useState,
} from "react";

import type {
  MatrixCatalogs,
  ProcessCatalog,
} from "../types/supermatriz.types";
import CatalogEditorModal from "./CatalogEditorModal";
import StatusBadge from "./StatusBadge";

interface Props {
  versionSupermatrizId: number;
  catalogs: MatrixCatalogs;
  canEdit: boolean;
  onSaveProcess: Parameters<
    typeof CatalogEditorModal
  >[0]["onSaveProcess"];
  onDeactivateProcess: (
    id: number
  ) => Promise<unknown>;
}

export default function ProcessManager({
  versionSupermatrizId,
  catalogs,
  canEdit,
  onSaveProcess,
  onDeactivateProcess,
}: Props) {
  const [
    current,
    setCurrent,
  ] = useState<
    ProcessCatalog | null
  >(null);

  const [open, setOpen] =
    useState(false);

  async function deactivate(
    process: ProcessCatalog
  ) {
    if (
      !window.confirm(
        `¿Deseas desactivar el proceso "${process.nombre}"?`
      )
    ) {
      return;
    }

    await onDeactivateProcess(
      process.id
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 rounded-2xl border border-neutral-800/70 bg-[#111111] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            Procesos administrativos
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Los procesos se versionan junto con la Supermatriz y reciben resultados administrativos, no calificación ministerial propia.
          </p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => {
              setCurrent(null);
              setOpen(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black"
          >
            <Plus size={17} />
            Nuevo proceso
          </button>
        )}
      </header>

      {!canEdit && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          Esta versión es de solo lectura. Clónala para modificar sus procesos.
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-neutral-800/70 bg-[#111111]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-800">
            <thead className="bg-[#0b0b0b]">
              <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="px-5 py-4">
                  Código
                </th>
                <th className="px-5 py-4">
                  Proceso
                </th>
                <th className="px-5 py-4">
                  Filas
                </th>
                <th className="px-5 py-4">
                  Estado
                </th>
                <th className="px-5 py-4 text-right">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-800/70">
              {catalogs.procesos.map(
                (process) => (
                  <tr
                    key={process.id}
                    className="text-sm"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-cyan-400">
                      {process.codigo ??
                        "—"}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">
                        {process.nombre}
                      </p>
                      <p className="mt-1 max-w-xl text-xs text-neutral-500">
                        {process.descripcion ??
                          "Sin descripción"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-neutral-400">
                      {process._count
                        ?.tareas ?? 0}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        status={
                          process.estado
                        }
                      />
                    </td>
                    <td className="px-5 py-4">
                      {canEdit && (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrent(
                                process
                              );
                              setOpen(
                                true
                              );
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 text-neutral-400 hover:text-white"
                            title="Editar"
                          >
                            <Edit2
                              size={
                                15
                              }
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void deactivate(
                                process
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 text-red-400"
                            title="Desactivar"
                          >
                            <Trash2
                              size={
                                15
                              }
                            />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {catalogs.procesos.length ===
          0 && (
          <div className="px-5 py-12 text-center text-sm text-neutral-500">
            No hay procesos en esta versión.
          </div>
        )}
      </section>

      <CatalogEditorModal
        open={open}
        kind="proceso"
        current={current}
        versionSupermatrizId={
          versionSupermatrizId
        }
        catalogs={catalogs}
        onClose={() => {
          setOpen(false);
          setCurrent(null);
        }}
        onSaveCycle={
          async () =>
            undefined
        }
        onSaveCategory={
          async () =>
            undefined
        }
        onSaveStandard={
          async () =>
            undefined
        }
        onSaveProcess={
          onSaveProcess
        }
      />
    </div>
  );
}
