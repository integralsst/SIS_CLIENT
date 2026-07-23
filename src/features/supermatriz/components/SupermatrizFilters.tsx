import {
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import AppSelect from "../../../components/ui/AppSelect";
import type {
  MatrixCatalogs,
  MatrixFilters,
} from "../types/supermatriz.types";

interface Props {
  catalogs: MatrixCatalogs;
  filters: MatrixFilters;
  onChange: (
    patch: Partial<MatrixFilters>
  ) => void;
}

const EMPTY_FILTERS = {
  cicloPhvaId: "",
  categoriaEstandarId: "",
  estandarId: "",
  procesoId: "",
  categoriaGestionId: "",
  grupoMinisterialId: "",
  estado: "ACTIVO" as const,
};

export default function SupermatrizFilters({
  catalogs,
  filters,
  onChange,
}: Props) {
  const [expanded, setExpanded] =
    useState(false);

  const categories = useMemo(
    () =>
      catalogs.categoriasEstandar.filter(
        (item) =>
          !filters.cicloPhvaId ||
          item.cicloPhvaId ===
            Number(filters.cicloPhvaId)
      ),
    [
      catalogs.categoriasEstandar,
      filters.cicloPhvaId,
    ]
  );

  const standards = useMemo(
    () =>
      catalogs.estandares.filter(
        (item) =>
          !filters.categoriaEstandarId ||
          item.categoriaEstandarId ===
            Number(
              filters.categoriaEstandarId
            )
      ),
    [
      catalogs.estandares,
      filters.categoriaEstandarId,
    ]
  );

  const activeFilterCount = [
    filters.cicloPhvaId,
    filters.categoriaEstandarId,
    filters.estandarId,
    filters.procesoId,
    filters.categoriaGestionId,
    filters.grupoMinisterialId,
    filters.estado === "INACTIVO"
      ? "INACTIVO"
      : "",
  ].filter(Boolean).length;

  function clearFilters() {
    onChange({
      ...EMPTY_FILTERS,
      pagina: 1,
    });
  }

  return (
    <section className="rounded-2xl border border-neutral-800/70 bg-[#111111] p-3 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
          <input
            type="search"
            value={filters.busqueda}
            onChange={(event) =>
              onChange({
                busqueda: event.target.value,
              })
            }
            placeholder="Buscar por proceso, aspecto, estándar, plan o ejecución…"
            className="w-full rounded-xl border border-neutral-800 bg-[#090909] py-3 pl-10 pr-10 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
          />
          {filters.busqueda && (
            <button
              type="button"
              onClick={() =>
                onChange({ busqueda: "" })
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-600 transition hover:bg-neutral-800 hover:text-white"
              aria-label="Limpiar búsqueda"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              setExpanded((current) => !current)
            }
            className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition lg:flex-none ${
              expanded || activeFilterCount > 0
                ? "border-cyan-500/25 bg-cyan-500/10 text-cyan-300"
                : "border-neutral-800 bg-[#090909] text-neutral-400 hover:text-white"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400 px-1.5 text-[10px] font-bold text-black">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-[#090909] px-3 text-sm text-neutral-500 transition hover:text-white"
              title="Restablecer filtros"
            >
              <RotateCcw size={15} />
              <span className="hidden sm:inline">
                Limpiar
              </span>
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-neutral-800/70 pt-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <Filter size={14} />
            Acota la matriz sin perder el contexto de cada fila
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <AppSelect
              value={filters.estado}
              onChange={(event) =>
                onChange({
                  estado:
                    event.target
                      .value as MatrixFilters["estado"],
                })
              }
            >
              <option value="ACTIVO">
                Filas activas
              </option>
              <option value="INACTIVO">
                Filas inactivas
              </option>
            </AppSelect>

            <AppSelect
              value={filters.cicloPhvaId}
              onChange={(event) =>
                onChange({
                  cicloPhvaId:
                    event.target.value,
                  categoriaEstandarId: "",
                  estandarId: "",
                })
              }
            >
              <option value="">
                Todos los ciclos PHVA
              </option>
              {catalogs.ciclosPhva.map(
                (cycle) => (
                  <option
                    key={cycle.id}
                    value={cycle.id}
                  >
                    {cycle.nombre}
                  </option>
                )
              )}
            </AppSelect>

            <AppSelect
              value={
                filters.categoriaEstandarId
              }
              onChange={(event) =>
                onChange({
                  categoriaEstandarId:
                    event.target.value,
                  estandarId: "",
                })
              }
            >
              <option value="">
                Todas las categorías
              </option>
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.nombre}
                </option>
              ))}
            </AppSelect>

            <AppSelect
              value={filters.estandarId}
              onChange={(event) =>
                onChange({
                  estandarId:
                    event.target.value,
                })
              }
            >
              <option value="">
                Todos los estándares
              </option>
              {standards.map((standard) => (
                <option
                  key={standard.id}
                  value={standard.id}
                >
                  {standard.codigo
                    ? `${standard.codigo} · `
                    : ""}
                  {standard.nombre}
                </option>
              ))}
            </AppSelect>

            <AppSelect
              value={filters.procesoId}
              onChange={(event) =>
                onChange({
                  procesoId:
                    event.target.value,
                })
              }
            >
              <option value="">
                Todos los procesos
              </option>
              {catalogs.procesos.map(
                (process) => (
                  <option
                    key={process.id}
                    value={process.id}
                  >
                    {process.nombre}
                  </option>
                )
              )}
            </AppSelect>

            <AppSelect
              value={
                filters.categoriaGestionId
              }
              onChange={(event) =>
                onChange({
                  categoriaGestionId:
                    event.target.value,
                })
              }
            >
              <option value="">
                Todas las gestiones
              </option>
              {catalogs.categoriasGestion.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.nombre}
                  </option>
                )
              )}
            </AppSelect>

            <AppSelect
              value={
                filters.grupoMinisterialId
              }
              onChange={(event) =>
                onChange({
                  grupoMinisterialId:
                    event.target.value,
                })
              }
            >
              <option value="">
                Todos los grupos 7/21/60
              </option>
              {catalogs.gruposMinisteriales.map(
                (group) => (
                  <option
                    key={group.id}
                    value={group.id}
                  >
                    {group.nombre}
                  </option>
                )
              )}
            </AppSelect>
          </div>
        </div>
      )}
    </section>
  );
}
