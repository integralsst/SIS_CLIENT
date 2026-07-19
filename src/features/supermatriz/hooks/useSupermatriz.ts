import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  createMatrixTask,
  createMatrixVersion,
  deactivateMatrixTask,
  getMatrixCatalogs,
  getMatrixTasks,
  updateMatrixTask,
} from "../api/supermatriz.api";
import type {
  MatrixCatalogs,
  MatrixFilters,
  MatrixTask,
  MatrixTaskListResponse,
  MatrixTaskPayload,
  MatrixVersionPayload,
} from "../types/supermatriz.types";

const emptyCatalogs: MatrixCatalogs = {
  ciclosPhva: [],
  categoriasEstandar: [],
  estandares: [],
  procesos: [],
  aspectos: [],
  categoriasGestion: [],
  gruposMinisteriales: [],
  versiones: [],
};

const initialFilters: MatrixFilters = {
  versionSupermatrizId: "",
  cicloPhvaId: "",
  categoriaEstandarId: "",
  estandarId: "",
  procesoId: "",
  categoriaGestionId: "",
  grupoMinisterialId: "",
  estado: "ACTIVO",
  busqueda: "",
  pagina: 1,
  limite: 25,
};

const emptyResult: MatrixTaskListResponse = {
  items: [],
  paginacion: {
    pagina: 1,
    limite: 25,
    total: 0,
    totalPaginas: 1,
  },
};

export function useSupermatriz(token: string | null) {
  const [catalogs, setCatalogs] =
    useState<MatrixCatalogs>(emptyCatalogs);
  const [result, setResult] =
    useState<MatrixTaskListResponse>(emptyResult);
  const [filters, setFilters] =
    useState<MatrixFilters>(initialFilters);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCatalogs = useCallback(async () => {
    if (!token) return;

    setLoadingCatalogs(true);
    setError(null);

    try {
      const data = await getMatrixCatalogs(token);
      setCatalogs(data);

      setFilters((current) => {
        if (current.versionSupermatrizId || data.versiones.length === 0) {
          return current;
        }

        const preferred =
          data.versiones.find((version) => version.estado === "VIGENTE") ??
          data.versiones[0];

        return {
          ...current,
          versionSupermatrizId: String(preferred.id),
          pagina: 1,
        };
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible cargar los catálogos."
      );
    } finally {
      setLoadingCatalogs(false);
    }
  }, [token]);

  const loadTasks = useCallback(async () => {
    if (!token) return;

    setLoadingTasks(true);
    setError(null);

    try {
      setResult(await getMatrixTasks(token, filters));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible cargar la Supermatriz."
      );
    } finally {
      setLoadingTasks(false);
    }
  }, [token, filters]);

  useEffect(() => {
    void loadCatalogs();
  }, [loadCatalogs]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const updateFilters = (
    patch: Partial<MatrixFilters>
  ) => {
    setFilters((current) => ({
      ...current,
      ...patch,
      pagina: patch.pagina ?? 1,
    }));
  };

  const saveTask = async (
    task: MatrixTask | null,
    payload: MatrixTaskPayload
  ) => {
    if (!token) return;

    if (task) {
      await updateMatrixTask(token, task.id, payload);
    } else {
      await createMatrixTask(token, payload);
    }

    await Promise.all([loadCatalogs(), loadTasks()]);
  };

  const deactivateTask = async (task: MatrixTask) => {
    if (!token) return;
    await deactivateMatrixTask(token, task.id);
    await Promise.all([loadCatalogs(), loadTasks()]);
  };

  const saveVersion = async (payload: MatrixVersionPayload) => {
    if (!token) return;
    const version = await createMatrixVersion(token, payload);
    await loadCatalogs();
    setFilters((current) => ({
      ...current,
      versionSupermatrizId: String(version.id),
      pagina: 1,
    }));
  };

  return {
    catalogs,
    result,
    filters,
    loadingCatalogs,
    loadingTasks,
    error,
    updateFilters,
    reload: async () => {
      await Promise.all([loadCatalogs(), loadTasks()]);
    },
    saveTask,
    deactivateTask,
    saveVersion,
  };
}
