import {
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  useEffect,
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

const EMPTY_ADVANCED_FILTERS = {
  cicloPhvaId: "",
  categoriaEstandarId: "",
  estandarId: "",
  procesoId: "",
  categoriaGestionId: "",
  grupoMinisterialId: "",
} satisfies Partial<MatrixFilters>;

export default function SupermatrizFilters({
  catalogs,
  filters,
  onChange,
}: Props) {
  const [advancedOpen, setAdvancedOpen] =
    useState(false);
  const [search, setSearch] = useState(
    filters.busqueda
  );

  useEffect(() => {
    setSearch(filters.busqueda);
  }, [filters.busqueda]);

  useEffect(() => {
    if (search === filters.busqueda) return;

    const timer = window.setTimeout(() => {
      onChange({ busqueda: search });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search, filters.busqueda, onChange]);

  const standardCategories = useMemo(
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
            Number(filters.categoriaEstandarId)
      ),
    [
      catalogs.estandares,
      filters.categoriaEstandarId,
    ]
  );

  const activeAdvancedCount = [
    filters.cicloPhvaId,
    filters.categoriaEstandarId,
    filters.estandarId,
    filters.procesoId,
    filters.categoriaGestionId,
    filters.grupoMinisterialId,
  ].filter(Boolean).length;

  function clearAll() {
    setSearch("");
    onChange({
      ...EMPTY_ADVANCED_FILTERS,
      busqueda: "",
      estado: "ACTIVO",
      pagina: 1,
    });
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-800/70 bg-[#111111]">
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Buscar en toda la matriz: proceso, aspecto, estándar, plan, ejecución…"
            className="w-full rounded-xl border border-neutral-800 bg-[#090909] py-2.5 pl-10 pr-10 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-500 hover:bg-neutral-800 hover:text-white"
              title="Limpiar búsqueda"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="min-w-[150px]">
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
              Solo activas
            </option>
            <option value="INACTIVO">
              Solo inactivas
            </option>
          </AppSelect>
        </div>

        <button
          type="button"
          onClick={() =>
            setAdvancedOpen((current) => !current)
          }
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
            advancedOpen || activeAdvancedCount > 0
              ? "border-cyan-500/25 bg-cyan-500/10 text-cyan-300"
              : "border-neutral-800 bg-[#090909] text-neutral-400 hover:text-white"
          }`}
        >
          <SlidersHorizontal size={16} />
          Filtros
          {activeAdvancedCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400 px-1.5 text-[10px] font-bold text-black">
              {activeAdvancedCount}
            </span>
          )}
          <ChevronDown
            size={15}
            className={`transition-transform ${
              advancedOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {(search ||
          activeAdvancedCount > 0 ||
          filters.estado !== "ACTIVO") && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 px-4 py-2.5 text-sm text-neutral-500 hover:bg-neutral-800 hover:text-white"
          >
            <RotateCcw size={15} />
            Limpiar
          </button>
        )}
      </div>

      {advancedOpen && (
        <div className="border-t border-neutral-800/70 bg-[#0c0c0c] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">
                Filtros avanzados
              </p>
              <p className="mt-0.5 text-xs text-neutral-600">
                Las opciones se encadenan igual que la estructura de la matriz.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <AppSelect
              value={filters.cicloPhvaId}
              onChange={(event) =>
                onChange({
                  cicloPhvaId: event.target.value,
                  categoriaEstandarId: "",
                  estandarId: "",
                })
              }
            >
              <option value="">
                Todos los ciclos PHVA
              </option>
              {catalogs.ciclosPhva.map((cycle) => (
                <option
                  key={cycle.id}
                  value={cycle.id}
                >
                  {cycle.nombre}
                </option>
              ))}
            </AppSelect>

            <AppSelect
              value={filters.categoriaEstandarId}
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
              {standardCategories.map((category) => (
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
                  estandarId: event.target.value,
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
                    ? `${standard.codigo}. `
                    : ""}
                  {standard.nombre}
                </option>
              ))}
            </AppSelect>

            <AppSelect
              value={filters.procesoId}
              onChange={(event) =>
                onChange({
                  procesoId: event.target.value,
                })
              }
            >
              <option value="">
                Todos los procesos
              </option>
              {catalogs.procesos.map((process) => (
                <option
                  key={process.id}
                  value={process.id}
                >
                  {process.nombre}
                </option>
              ))}
            </AppSelect>

            <AppSelect
              value={filters.categoriaGestionId}
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
              value={filters.grupoMinisterialId}
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
