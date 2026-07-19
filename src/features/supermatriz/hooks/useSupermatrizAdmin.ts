import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  cloneMatrixVersion,
  closeMatrixVersion,
  createAspect,
  createCycle,
  createMatrixTask,
  createMatrixVersion,
  createProcess,
  createStandard,
  createStandardCategory,
  deactivateAspect,
  deactivateCycle,
  deactivateMatrixTask,
  deactivateProcess,
  deactivateStandard,
  deactivateStandardCategory,
  getMatrixCatalogs,
  getMatrixHistory,
  getMatrixTasks,
  getMatrixVersions,
  publishMatrixVersion,
  updateAspect,
  updateCycle,
  updateMatrixTask,
  updateMatrixVersion,
  updateProcess,
  updateStandard,
  updateStandardCategory,
} from "../api/supermatriz.api";

import type {
  AspectCatalog,
  AspectPayload,
  CyclePayload,
  HistoryResponse,
  MatrixCatalogs,
  MatrixFilters,
  MatrixTask,
  MatrixTaskListResponse,
  MatrixTaskPayload,
  MatrixVersion,
  MatrixVersionPayload,
  PhvaCycle,
  ProcessCatalog,
  ProcessPayload,
  Standard,
  StandardCategory,
  StandardCategoryPayload,
  StandardPayload,
} from "../types/supermatriz.types";

const EMPTY_CATALOGS: MatrixCatalogs = {
  ciclosPhva: [],
  categoriasEstandar: [],
  estandares: [],
  procesos: [],
  aspectos: [],
  categoriasGestion: [],
  gruposMinisteriales: [],
  versiones: [],
};

const EMPTY_TASKS: MatrixTaskListResponse = {
  items: [],
  paginacion: {
    pagina: 1,
    limite: 25,
    total: 0,
    totalPaginas: 1,
  },
};

const EMPTY_HISTORY: HistoryResponse = {
  items: [],
  paginacion: {
    pagina: 1,
    limite: 25,
    total: 0,
    totalPaginas: 1,
  },
};

const VERSION_STORAGE_KEY =
  "stack44_supermatriz_version_id";

function initialFilters(
  versionId = ""
): MatrixFilters {
  return {
    versionSupermatrizId:
      versionId,
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
}

export function useSupermatrizAdmin(
  token: string | null
) {
  const [versions, setVersions] =
    useState<MatrixVersion[]>([]);

  const [
    selectedVersionId,
    setSelectedVersionIdState,
  ] = useState<number | null>(() => {
    const stored =
      localStorage.getItem(
        VERSION_STORAGE_KEY
      );

    const parsed = Number(stored);

    return Number.isInteger(parsed) &&
      parsed > 0
      ? parsed
      : null;
  });

  const [catalogs, setCatalogs] =
    useState<MatrixCatalogs>(
      EMPTY_CATALOGS
    );

  const [tasks, setTasks] =
    useState<MatrixTaskListResponse>(
      EMPTY_TASKS
    );

  const [history, setHistory] =
    useState<HistoryResponse>(
      EMPTY_HISTORY
    );

  const [filters, setFilters] =
    useState<MatrixFilters>(() =>
      initialFilters()
    );

  const [loadingVersions, setLoadingVersions] =
    useState(true);

  const [loadingCatalogs, setLoadingCatalogs] =
    useState(false);

  const [loadingTasks, setLoadingTasks] =
    useState(false);

  const [loadingHistory, setLoadingHistory] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const selectedVersion = useMemo(
    () =>
      versions.find(
        (version) =>
          version.id ===
          selectedVersionId
      ) ?? null,
    [versions, selectedVersionId]
  );

  const canEditSelectedVersion =
    selectedVersion?.estado ===
    "BORRADOR";

  const setSelectedVersionId =
    useCallback(
      (versionId: number) => {
        setSelectedVersionIdState(
          versionId
        );

        localStorage.setItem(
          VERSION_STORAGE_KEY,
          String(versionId)
        );

        setFilters(
          initialFilters(
            String(versionId)
          )
        );
      },
      []
    );

  const loadVersions =
    useCallback(async () => {
      if (!token) return;

      setLoadingVersions(true);
      setError(null);

      try {
        const result =
          await getMatrixVersions(
            token
          );

        setVersions(result);

        const selectedStillExists =
          result.some(
            (version) =>
              version.id ===
              selectedVersionId
          );

        if (!selectedStillExists) {
          const preferred =
            result.find(
              (version) =>
                version.estado ===
                "BORRADOR"
            ) ??
            result.find(
              (version) =>
                version.estado ===
                "VIGENTE"
            ) ??
            result[0];

          if (preferred) {
            setSelectedVersionId(
              preferred.id
            );
          }
        }
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No fue posible cargar las versiones."
        );
      } finally {
        setLoadingVersions(false);
      }
    }, [
      token,
      selectedVersionId,
      setSelectedVersionId,
    ]);

  const loadCatalogs =
    useCallback(async () => {
      if (
        !token ||
        !selectedVersionId
      ) {
        setCatalogs(
          EMPTY_CATALOGS
        );
        return;
      }

      setLoadingCatalogs(true);
      setError(null);

      try {
        const result =
          await getMatrixCatalogs(
            token,
            selectedVersionId,
            true
          );

        setCatalogs({
          ...result,
          versiones: versions,
        });
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No fue posible cargar la estructura."
        );
      } finally {
        setLoadingCatalogs(false);
      }
    }, [
      token,
      selectedVersionId,
      versions,
    ]);

  const loadTasks =
    useCallback(async () => {
      if (
        !token ||
        !selectedVersionId
      ) {
        setTasks(EMPTY_TASKS);
        return;
      }

      setLoadingTasks(true);
      setError(null);

      try {
        const result =
          await getMatrixTasks(
            token,
            {
              ...filters,
              versionSupermatrizId:
                String(
                  selectedVersionId
                ),
            }
          );

        setTasks(result);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No fue posible cargar las filas."
        );
      } finally {
        setLoadingTasks(false);
      }
    }, [
      token,
      selectedVersionId,
      filters,
    ]);

  const loadHistory =
    useCallback(
      async (page = 1) => {
        if (
          !token ||
          !selectedVersionId
        ) {
          setHistory(
            EMPTY_HISTORY
          );
          return;
        }

        setLoadingHistory(true);
        setError(null);

        try {
          setHistory(
            await getMatrixHistory(
              token,
              selectedVersionId,
              page
            )
          );
        } catch (requestError) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No fue posible cargar el historial."
          );
        } finally {
          setLoadingHistory(false);
        }
      },
      [token, selectedVersionId]
    );

  useEffect(() => {
    void loadVersions();
  }, [loadVersions]);

  useEffect(() => {
    void loadCatalogs();
  }, [loadCatalogs]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    void loadHistory(1);
  }, [loadHistory]);

  const refreshAll =
    useCallback(async () => {
      await loadVersions();
      await Promise.all([
        loadCatalogs(),
        loadTasks(),
        loadHistory(
          history.paginacion.pagina
        ),
      ]);
    }, [
      loadVersions,
      loadCatalogs,
      loadTasks,
      loadHistory,
      history.paginacion.pagina,
    ]);

  const updateFilters =
    useCallback(
      (
        patch: Partial<MatrixFilters>
      ) => {
        setFilters((current) => ({
          ...current,
          ...patch,
          pagina:
            patch.pagina ??
            (Object.keys(patch).some(
              (key) =>
                key !== "pagina"
            )
              ? 1
              : current.pagina),
          versionSupermatrizId:
            String(
              selectedVersionId ??
                ""
            ),
        }));
      },
      [selectedVersionId]
    );

  async function mutation<T>(
    action: () => Promise<T>,
    options?: {
      versions?: boolean;
      catalogs?: boolean;
      tasks?: boolean;
      history?: boolean;
    }
  ): Promise<T> {
    setError(null);

    const result =
      await action();

    await Promise.all([
      options?.versions
        ? loadVersions()
        : Promise.resolve(),
      options?.catalogs
        ? loadCatalogs()
        : Promise.resolve(),
      options?.tasks
        ? loadTasks()
        : Promise.resolve(),
      options?.history
        ? loadHistory(
            history.paginacion.pagina
          )
        : Promise.resolve(),
    ]);

    return result;
  }

  return {
    versions,
    selectedVersionId,
    selectedVersion,
    canEditSelectedVersion,
    catalogs,
    tasks,
    history,
    filters,
    loadingVersions,
    loadingCatalogs,
    loadingTasks,
    loadingHistory,
    error,
    setSelectedVersionId,
    updateFilters,
    refreshAll,
    loadHistory,

    createVersion: (
      payload: MatrixVersionPayload
    ) =>
      mutation(
        () =>
          createMatrixVersion(
            token!,
            payload
          ),
        {
          versions: true,
          history: true,
        }
      ),

    updateVersion: (
      id: number,
      payload: MatrixVersionPayload
    ) =>
      mutation(
        () =>
          updateMatrixVersion(
            token!,
            id,
            payload
          ),
        {
          versions: true,
          history: true,
        }
      ),

    cloneVersion: async (
      id: number,
      payload: MatrixVersionPayload
    ) => {
      const cloned =
        await mutation<MatrixVersion>(
          () =>
            cloneMatrixVersion(
              token!,
              id,
              payload
            ),
          {
            versions: true,
          }
        );

      setSelectedVersionId(
        cloned.id
      );

      return cloned;
    },

    publishVersion: (
      id: number
    ) =>
      mutation(
        () =>
          publishMatrixVersion(
            token!,
            id
          ),
        {
          versions: true,
          catalogs: true,
          tasks: true,
          history: true,
        }
      ),

    closeVersion: (
      id: number
    ) =>
      mutation(
        () =>
          closeMatrixVersion(
            token!,
            id
          ),
        {
          versions: true,
          catalogs: true,
          tasks: true,
          history: true,
        }
      ),

    saveTask: (
      current: MatrixTask | null,
      payload: MatrixTaskPayload
    ) =>
      mutation(
        () =>
          current
            ? updateMatrixTask(
                token!,
                current.id,
                payload
              )
            : createMatrixTask(
                token!,
                payload
              ),
        {
          tasks: true,
          history: true,
        }
      ),

    deactivateTask: (
      id: number
    ) =>
      mutation(
        () =>
          deactivateMatrixTask(
            token!,
            id
          ),
        {
          tasks: true,
          history: true,
        }
      ),

    saveCycle: (
      current: PhvaCycle | null,
      payload: CyclePayload
    ) =>
      mutation(
        () =>
          current
            ? updateCycle(
                token!,
                current.id,
                payload
              )
            : createCycle(
                token!,
                payload
              ),
        {
          catalogs: true,
          history: true,
        }
      ),

    deactivateCycle: (
      id: number
    ) =>
      mutation(
        () =>
          deactivateCycle(
            token!,
            id
          ),
        {
          catalogs: true,
          history: true,
        }
      ),

    saveCategory: (
      current: StandardCategory | null,
      payload: StandardCategoryPayload
    ) =>
      mutation(
        () =>
          current
            ? updateStandardCategory(
                token!,
                current.id,
                payload
              )
            : createStandardCategory(
                token!,
                payload
              ),
        {
          catalogs: true,
          history: true,
        }
      ),

    deactivateCategory: (
      id: number
    ) =>
      mutation(
        () =>
          deactivateStandardCategory(
            token!,
            id
          ),
        {
          catalogs: true,
          history: true,
        }
      ),

    saveStandard: (
      current: Standard | null,
      payload: StandardPayload
    ) =>
      mutation(
        () =>
          current
            ? updateStandard(
                token!,
                current.id,
                payload
              )
            : createStandard(
                token!,
                payload
              ),
        {
          catalogs: true,
          history: true,
        }
      ),

    deactivateStandard: (
      id: number
    ) =>
      mutation(
        () =>
          deactivateStandard(
            token!,
            id
          ),
        {
          catalogs: true,
          history: true,
        }
      ),

    saveAspect: (
      current: AspectCatalog | null,
      payload: AspectPayload
    ) =>
      mutation(
        () =>
          current
            ? updateAspect(
                token!,
                current.id,
                payload
              )
            : createAspect(
                token!,
                payload
              ),
        {
          catalogs: true,
          tasks: true,
          history: true,
        }
      ),

    deactivateAspect: (
      id: number
    ) =>
      mutation(
        () =>
          deactivateAspect(
            token!,
            id
          ),
        {
          catalogs: true,
          tasks: true,
          history: true,
        }
      ),

    saveProcess: (
      current: ProcessCatalog | null,
      payload: ProcessPayload
    ) =>
      mutation(
        () =>
          current
            ? updateProcess(
                token!,
                current.id,
                payload
              )
            : createProcess(
                token!,
                payload
              ),
        {
          catalogs: true,
          tasks: true,
          history: true,
        }
      ),

    deactivateProcess: (
      id: number
    ) =>
      mutation(
        () =>
          deactivateProcess(
            token!,
            id
          ),
        {
          catalogs: true,
          tasks: true,
          history: true,
        }
      ),
  };
}
