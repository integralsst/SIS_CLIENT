import {
  Edit2,
  Link2,
  Plus,
  Rows3,
  Trash2,
} from "lucide-react";
import type { ReactNode } from "react";
import type {
  ProcessCatalog,
} from "../../types/supermatriz.types";

interface Props {
  processes: ProcessCatalog[];
  canEdit: boolean;
  search: string;
  onCreate: () => void;
  onEdit: (process: ProcessCatalog) => void;
  onDeactivate: (process: ProcessCatalog) => void;
  onCreateRow: (process: ProcessCatalog) => void;
  onShowRows: (process: ProcessCatalog) => void;
}

export default function ProcessesWorkspace({
  processes,
  canEdit,
  search,
  onCreate,
  onEdit,
  onDeactivate,
  onCreateRow,
  onShowRows,
}: Props) {
  const normalized = search.trim().toLowerCase();
  const filtered = processes.filter((process) =>
    [process.codigo ?? "", process.nombre, process.descripcion ?? ""]
      .some((value) => value.toLowerCase().includes(normalized))
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-800/80 bg-[#111111]">
      <header className="flex items-center justify-between gap-3 border-b border-neutral-800/70 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Procesos</h3>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-neutral-600">
            {filtered.length} registro{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={onCreate}
            className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-black"
          >
            <Plus size={14} />
            Nuevo
          </button>
        )}
      </header>

      <div className="max-h-[680px] divide-y divide-neutral-800/60 overflow-y-auto">
        {filtered.map((process) => (
          <article key={process.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-5 text-white">
                  {process.codigo ? `${process.codigo} · ` : ""}{process.nombre}
                </p>
                {process.descripcion && (
                  <p className="mt-1 text-xs leading-5 text-neutral-600">
                    {process.descripcion}
                  </p>
                )}
                <p className="mt-2 text-[10px] uppercase tracking-wider text-neutral-600">
                  {process._count?.tareas ?? 0} fila{(process._count?.tareas ?? 0) === 1 ? "" : "s"}
                </p>
              </div>

              {canEdit && (
                <div className="flex shrink-0 gap-1">
                  <IconButton label="Editar proceso" onClick={() => onEdit(process)}><Edit2 size={14} /></IconButton>
                  <IconButton label="Desactivar proceso" onClick={() => onDeactivate(process)} danger><Trash2 size={14} /></IconButton>
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onShowRows(process)}
                className="flex items-center gap-2 rounded-lg border border-neutral-800 px-3 py-2 text-xs text-neutral-400 hover:text-white"
              >
                <Rows3 size={14} />
                Ver filas
              </button>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => onCreateRow(process)}
                  className="flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-300"
                >
                  <Link2 size={14} />
                  Crear fila
                </button>
              )}
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="px-4 py-14 text-center text-sm text-neutral-600">
            No se encontraron procesos.
          </div>
        )}
      </div>
    </section>
  );
}

function IconButton({
  label,
  onClick,
  children,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
        danger
          ? "border-red-500/15 bg-red-500/5 text-red-400 hover:bg-red-500/15"
          : "border-neutral-800 bg-[#090909] text-neutral-500 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
