import {
  Loader2,
} from "lucide-react";

import type {
  HistoryResponse,
} from "../types/supermatriz.types";

interface Props {
  history: HistoryResponse;
  loading: boolean;
  onPageChange: (
    page: number
  ) => void;
}

export default function HistoryPanel({
  history,
  loading,
  onPageChange,
}: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-800/70 bg-[#111111]">
      <header className="border-b border-neutral-800/70 px-5 py-4">
        <h2 className="text-lg font-bold text-white">
          Historial de cambios
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Registro de creación, modificación, desactivación, clonación, publicación y cierre.
        </p>
      </header>

      {loading ? (
        <div className="flex min-h-72 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-800">
              <thead className="bg-[#0b0b0b]">
                <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="px-5 py-4">
                    Fecha
                  </th>
                  <th className="px-5 py-4">
                    Acción
                  </th>
                  <th className="px-5 py-4">
                    Entidad
                  </th>
                  <th className="px-5 py-4">
                    Descripción
                  </th>
                  <th className="px-5 py-4">
                    Usuario
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-800/70">
                {history.items.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="text-sm"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-neutral-500">
                        {new Date(
                          item.createdAt
                        ).toLocaleString(
                          "es-CO"
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold text-cyan-300">
                          {
                            item.accion
                          }
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-neutral-400">
                        {
                          item.tipoEntidad
                        }
                        {item.entidadId
                          ? ` #${item.entidadId}`
                          : ""}
                      </td>
                      <td className="max-w-xl px-5 py-4 text-sm text-neutral-300">
                        {item.descripcion ??
                          "Sin descripción"}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs font-medium text-neutral-300">
                          {item.usuario
                            ?.nombre ??
                            "Sistema"}
                        </p>
                        <p className="mt-0.5 text-[10px] text-neutral-600">
                          {item.usuario
                            ?.correo ??
                            "Automático"}
                        </p>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {history.items.length ===
            0 && (
            <div className="px-6 py-16 text-center text-sm text-neutral-500">
              Esta versión todavía no tiene cambios registrados.
            </div>
          )}

          <footer className="flex items-center justify-between gap-3 border-t border-neutral-800/70 px-5 py-4 text-xs text-neutral-500">
            <span>
              Página{" "}
              {
                history
                  .paginacion
                  .pagina
              }{" "}
              de{" "}
              {
                history
                  .paginacion
                  .totalPaginas
              }
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={
                  history
                    .paginacion
                    .pagina <= 1
                }
                onClick={() =>
                  onPageChange(
                    history
                      .paginacion
                      .pagina -
                      1
                  )
                }
                className="rounded-lg border border-neutral-800 px-3 py-2 disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={
                  history
                    .paginacion
                    .pagina >=
                  history
                    .paginacion
                    .totalPaginas
                }
                onClick={() =>
                  onPageChange(
                    history
                      .paginacion
                      .pagina +
                      1
                  )
                }
                className="rounded-lg border border-neutral-800 px-3 py-2 disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}
