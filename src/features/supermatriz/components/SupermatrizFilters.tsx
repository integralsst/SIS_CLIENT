import {
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  useMemo,
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

export default function SupermatrizFilters({
  catalogs,
  filters,
  onChange,
}: Props) {
  const standardCategories =
    useMemo(
      () =>
        catalogs.categoriasEstandar.filter(
          (item) =>
            !filters.cicloPhvaId ||
            item.cicloPhvaId ===
              Number(
                filters.cicloPhvaId
              )
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

  return (
    <section className="rounded-2xl border border-neutral-800/70 bg-[#111111] p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
        <SlidersHorizontal
          size={17}
          className="text-cyan-400"
        />
        Filtros de la versión seleccionada
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative md:col-span-2 xl:col-span-2">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="search"
            value={
              filters.busqueda
            }
            onChange={(event) =>
              onChange({
                busqueda:
                  event.target.value,
              })
            }
            placeholder="Buscar código, proceso, aspecto, estándar o plan..."
            className="w-full rounded-xl border border-neutral-800 bg-[#090909] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
          />
        </div>

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
            Activas
          </option>
          <option value="INACTIVO">
            Inactivas
          </option>
        </AppSelect>

        <AppSelect
          value={
            filters.cicloPhvaId
          }
          onChange={(event) =>
            onChange({
              cicloPhvaId:
                event.target.value,
              categoriaEstandarId:
                "",
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
          {standardCategories.map(
            (category) => (
              <option
                key={
                  category.id
                }
                value={
                  category.id
                }
              >
                {
                  category.nombre
                }
              </option>
            )
          )}
        </AppSelect>

        <AppSelect
          value={
            filters.estandarId
          }
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
          {standards.map(
            (standard) => (
              <option
                key={
                  standard.id
                }
                value={
                  standard.id
                }
              >
                {standard.codigo
                  ? `${standard.codigo}. `
                  : ""}
                {
                  standard.nombre
                }
              </option>
            )
          )}
        </AppSelect>

        <AppSelect
          value={
            filters.procesoId
          }
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
                key={
                  category.id
                }
                value={
                  category.id
                }
              >
                {
                  category.nombre
                }
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
    </section>
  );
}
