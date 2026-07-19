import {
  Edit2,
  Eye,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";

import type { MatrixTask } from "../types/supermatriz.types";
import StatusBadge from "./StatusBadge";

interface Props {
  tasks: MatrixTask[];
  loading: boolean;
  canEdit: boolean;
  onView: (task: MatrixTask) => void;
  onEdit: (task: MatrixTask) => void;
  onDeactivate: (task: MatrixTask) => void;
}

export default function SupermatrizTable({
  tasks,
  loading,
  canEdit,
  onView,
  onEdit,
  onDeactivate,
}: Props) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-neutral-800/70 bg-[#111111] shadow-xl">
      <div className="border-b border-neutral-800 bg-[#0a0a0a] px-5 py-3 text-xs text-neutral-500">
        <strong className="text-neutral-300">Consejo:</strong> usa el ícono de ojo para abrir la ficha completa de una fila. Allí encontrarás Ejecución, soportes, metas, recursos, periodicidad, evidencia y normativa.
      </div>

      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full min-w-[1500px] text-left text-sm">
          <thead className="border-b border-neutral-800 bg-[#0a0a0a]">
            <tr>
              {[
                "Orden",
                "Código",
                "PHVA / Categoría",
                "Estándar",
                "Proceso",
                "Aspecto",
                "Plan de acción",
                "Gestión",
                "Estado",
                "Acciones",
              ].map((label) => (
                <th
                  key={label}
                  className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-neutral-400 last:text-right"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-800/70">
            {loading ? (
              <tr>
                <td colSpan={10} className="px-6 py-16 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-500" />
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-16 text-center text-neutral-500">
                  No se encontraron filas con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="align-top transition-colors hover:bg-neutral-800/20"
                >
                  <td className="px-4 py-4 font-mono text-xs text-neutral-400">
                    {task.orden}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-cyan-400">
                    {task.codigo ?? `#${task.id}`}
                  </td>
                  <td className="max-w-[220px] px-4 py-4">
                    <p className="font-semibold text-white">
                      {task.aspecto.estandar.categoriaEstandar.cicloPhva.nombre}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      {task.aspecto.estandar.categoriaEstandar.nombre}
                    </p>
                  </td>
                  <td className="max-w-[250px] px-4 py-4">
                    <p className="line-clamp-3 text-xs leading-5 text-neutral-300">
                      {task.aspecto.estandar.codigo
                        ? `${task.aspecto.estandar.codigo}. `
                        : ""}
                      {task.aspecto.estandar.nombre}
                    </p>
                  </td>
                  <td className="max-w-[190px] px-4 py-4 text-xs leading-5 text-neutral-300">
                    {task.proceso.nombre}
                  </td>
                  <td className="max-w-[280px] px-4 py-4">
                    <button
                      type="button"
                      onClick={() => onView(task)}
                      className="text-left"
                      title="Abrir detalle completo"
                    >
                      <p className="line-clamp-4 text-xs leading-5 text-white hover:text-cyan-300">
                        {task.aspecto.codigo ? `${task.aspecto.codigo}. ` : ""}
                        {task.aspecto.nombre}
                      </p>
                    </button>
                  </td>
                  <td className="max-w-[300px] px-4 py-4">
                    <p className="line-clamp-4 text-xs leading-5 text-neutral-400">
                      {task.aspecto.planAccionEspecifico?.descripcion ??
                        "Sin plan de acción"}
                    </p>
                  </td>
                  <td className="max-w-[210px] px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {task.categoriasGestion.map((relation) => (
                        <span
                          key={relation.categoriaGestionId}
                          className="rounded-full border border-cyan-500/15 bg-cyan-500/10 px-2 py-1 text-[10px] font-medium text-cyan-300"
                        >
                          {relation.categoriaGestion.nombre}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={task.estado} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(task)}
                        className="rounded-lg p-2 text-cyan-500 transition-colors hover:bg-cyan-500/10 hover:text-cyan-300"
                        title="Ver detalle completo"
                      >
                        <Eye size={17} />
                      </button>

                      {canEdit && (
                        <>
                          <button
                            type="button"
                            onClick={() => onEdit(task)}
                            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
                            title="Editar fila"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeactivate(task)}
                            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                            title="Desactivar fila"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-neutral-800/70 xl:hidden">
        {loading ? (
          <div className="flex justify-center px-4 py-16">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-neutral-500">
            No se encontraron filas.
          </div>
        ) : (
          tasks.map((task) => (
            <article key={task.id} className="space-y-4 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-800 bg-[#090909] text-cyan-400">
                    <FileText size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-cyan-400">
                      {task.codigo ?? `#${task.id}`} · Orden {task.orden}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold leading-6 text-white">
                      {task.aspecto.nombre}
                    </h3>
                  </div>
                </div>
                <StatusBadge status={task.estado} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Info
                  label="Ciclo PHVA"
                  value={task.aspecto.estandar.categoriaEstandar.cicloPhva.nombre}
                />
                <Info label="Proceso" value={task.proceso.nombre} />
                <Info label="Estándar" value={task.aspecto.estandar.nombre} />
                <Info
                  label="Gestiones"
                  value={
                    task.categoriasGestion
                      .map((item) => item.categoriaGestion.nombre)
                      .join(", ") || "Sin categoría"
                  }
                />
              </div>

              <div className="rounded-xl border border-neutral-800 bg-[#0a0a0a] p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                  Plan de acción
                </p>
                <p className="mt-2 text-xs leading-5 text-neutral-300">
                  {task.aspecto.planAccionEspecifico?.descripcion ??
                    "Sin plan de acción"}
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onView(task)}
                  className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-300"
                >
                  <Eye size={15} />
                  Ver detalle
                </button>
                {canEdit && (
                  <>
                    <button
                      type="button"
                      onClick={() => onEdit(task)}
                      className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-medium text-neutral-300"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeactivate(task)}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-400"
                    >
                      Desactivar
                    </button>
                  </>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-neutral-800 bg-[#0a0a0a] p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
        {label}
      </p>
      <p className="mt-1 text-xs leading-5 text-neutral-300">{value}</p>
    </div>
  );
}
