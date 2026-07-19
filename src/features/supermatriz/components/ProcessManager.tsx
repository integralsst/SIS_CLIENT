import {
  Edit2,
  Eye,
  Link2,
  Plus,
  Rows3,
  Trash2,
} from "lucide-react";
import { useState } from "react";

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
  onShowRows: (process: ProcessCatalog) => void;
  onCreateRow: (process: ProcessCatalog) => void;
}

export default function ProcessManager({
  versionSupermatrizId,
  catalogs,
  canEdit,
  onSaveProcess,
  onDeactivateProcess,
  onShowRows,
  onCreateRow,
}: Props) {
  const [current, setCurrent] = useState<ProcessCatalog | null>(null);
  const [open, setOpen] = useState(false);

  async function deactivate(process: ProcessCatalog) {
    if (
      !window.confirm(
        `¿Deseas desactivar el proceso "${process.nombre}"?`
      )
    ) {
      return;
    }

    await onDeactivateProcess(process.id);
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 rounded-2xl border border-neutral-800/70 bg-[#111111] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            Procesos administrativos
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Primero creas el proceso. Después lo conectas con uno o varios aspectos desde las filas de la Supermatriz.
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

      <div className="grid gap-3 lg:grid-cols-3">
        <ExplanationCard
          number="1"
          title="Crear el proceso"
          text="Aquí defines el nombre, código y descripción. En este momento todavía puede tener 0 filas."
        />
        <ExplanationCard
          number="2"
          title="Crear una fila"
          text="La fila selecciona un aspecto y luego utiliza el proceso que acabas de crear."
        />
        <ExplanationCard
          number="3"
          title="El contador cambia solo"
          text="Cuando el proceso se use en una fila, la columna Filas pasa de 0 a 1, 2, 3 o más."
        />
      </div>

      {!canEdit && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          Esta versión es de solo lectura. Puedes consultar las filas relacionadas, pero debes clonar la versión para crear o modificar procesos.
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-neutral-800/70 bg-[#111111]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-800">
            <thead className="bg-[#0b0b0b]">
              <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="px-5 py-4">Código</th>
                <th className="px-5 py-4">Proceso</th>
                <th className="px-5 py-4">Filas relacionadas</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-800/70">
              {catalogs.procesos.map((process) => {
                const rows = process._count?.tareas ?? 0;

                return (
                  <tr key={process.id} className="text-sm">
                    <td className="px-5 py-4 font-mono text-xs text-cyan-400">
                      {process.codigo ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{process.nombre}</p>
                      <p className="mt-1 max-w-xl text-xs leading-5 text-neutral-500">
                        {process.descripcion ?? "Sin descripción"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => onShowRows(process)}
                        className="group flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#090909] px-3 py-2 text-left hover:border-cyan-500/20 hover:bg-cyan-500/5"
                        title="Ver las filas que utilizan este proceso"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-cyan-400 group-hover:bg-cyan-500/10">
                          <Rows3 size={15} />
                        </div>
                        <div>
                          <p className="font-bold text-white">{rows}</p>
                          <p className="text-[10px] text-neutral-600">
                            {rows === 1 ? "fila utiliza este proceso" : "filas utilizan este proceso"}
                          </p>
                        </div>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={process.estado} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onShowRows(process)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
                          title="Ver filas relacionadas"
                        >
                          <Eye size={15} />
                        </button>

                        {canEdit && process.estado === "ACTIVO" && (
                          <button
                            type="button"
                            onClick={() => onCreateRow(process)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                            title="Crear una fila utilizando este proceso"
                          >
                            <Link2 size={15} />
                          </button>
                        )}

                        {canEdit && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setCurrent(process);
                                setOpen(true);
                              }}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 text-neutral-400 hover:text-white"
                              title="Editar proceso"
                            >
                              <Edit2 size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() => void deactivate(process)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 text-red-400"
                              title="Desactivar proceso"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {catalogs.procesos.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-neutral-500">
            No hay procesos en esta versión.
          </div>
        )}
      </section>

      <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-4 text-xs leading-6 text-neutral-500">
        <strong className="text-neutral-300">Qué hace cada acción:</strong> el ojo muestra las filas relacionadas; el eslabón crea una fila con el proceso ya seleccionado; el lápiz modifica únicamente el nombre o descripción del proceso; la papelera lo desactiva cuando no tiene dependencias activas.
      </div>

      <CatalogEditorModal
        open={open}
        kind="proceso"
        current={current}
        versionSupermatrizId={versionSupermatrizId}
        catalogs={catalogs}
        onClose={() => {
          setOpen(false);
          setCurrent(null);
        }}
        onSaveCycle={async () => undefined}
        onSaveCategory={async () => undefined}
        onSaveStandard={async () => undefined}
        onSaveProcess={onSaveProcess}
      />
    </div>
  );
}

function ExplanationCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xs font-bold text-cyan-400">
          {number}
        </span>
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="mt-1 text-xs leading-5 text-neutral-500">{text}</p>
        </div>
      </div>
    </div>
  );
}
