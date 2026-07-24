import {
  apiRequest,
} from "../../../lib/api";

import type {
  BuildMatrixRowPayload,
  BuildMatrixRowResponse,
} from "../types/supermatriz.types";
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

const BASE_PATH =
  "/api/supermatriz";

function withQuery(
  path: string,
  params: Record<
    string,
    string | number | undefined
  >
): string {
  const query =
    new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== ""
      ) {
        query.set(
          key,
          String(value)
        );
      }
    }
  );

  const suffix =
    query.toString();

  return suffix
    ? `${path}?${suffix}`
    : path;
}

export function getMatrixCatalogs(
  token: string,
  versionSupermatrizId?: number,
  incluirInactivos = true
) {
  return apiRequest<MatrixCatalogs>(
    withQuery(
      `${BASE_PATH}/catalogos`,
      {
        versionSupermatrizId,
        incluirInactivos:
          incluirInactivos
            ? "true"
            : undefined,
      }
    ),
    {},
    token
  );
}

export function getMatrixVersions(
  token: string
) {
  return apiRequest<
    MatrixVersion[]
  >(
    `${BASE_PATH}/versiones`,
    {},
    token
  );
}

export function getMatrixTasks(
  token: string,
  filters: MatrixFilters
) {
  return apiRequest<MatrixTaskListResponse>(
    withQuery(
      `${BASE_PATH}/tareas`,
      filters as unknown as Record<
        string,
        string | number
      >
    ),
    {},
    token
  );
}

export function buildMatrixRow(
  token: string,
  payload: BuildMatrixRowPayload
) {
  return apiRequest<BuildMatrixRowResponse>(
    `${BASE_PATH}/construir-fila`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );
}

export function createMatrixTask(
  token: string,
  payload: MatrixTaskPayload
) {
  return apiRequest<MatrixTask>(
    `${BASE_PATH}/tareas`,
    {
      method: "POST",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function updateMatrixTask(
  token: string,
  id: number,
  payload: MatrixTaskPayload
) {
  return apiRequest<MatrixTask>(
    `${BASE_PATH}/tareas/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function deactivateMatrixTask(
  token: string,
  id: number
) {
  return apiRequest(
    `${BASE_PATH}/tareas/${id}`,
    {
      method: "DELETE",
    },
    token
  );
}

export function createMatrixVersion(
  token: string,
  payload: MatrixVersionPayload
) {
  return apiRequest<MatrixVersion>(
    `${BASE_PATH}/versiones`,
    {
      method: "POST",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function updateMatrixVersion(
  token: string,
  id: number,
  payload: MatrixVersionPayload
) {
  return apiRequest<MatrixVersion>(
    `${BASE_PATH}/versiones/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function cloneMatrixVersion(
  token: string,
  id: number,
  payload: MatrixVersionPayload
) {
  return apiRequest<MatrixVersion>(
    `${BASE_PATH}/versiones/${id}/clonar`,
    {
      method: "POST",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function publishMatrixVersion(
  token: string,
  id: number
) {
  return apiRequest<MatrixVersion>(
    `${BASE_PATH}/versiones/${id}/publicar`,
    {
      method: "POST",
    },
    token
  );
}

export function closeMatrixVersion(
  token: string,
  id: number
) {
  return apiRequest<MatrixVersion>(
    `${BASE_PATH}/versiones/${id}/cerrar`,
    {
      method: "POST",
    },
    token
  );
}

export function createCycle(
  token: string,
  payload: CyclePayload
) {
  return apiRequest<PhvaCycle>(
    `${BASE_PATH}/ciclos-phva`,
    {
      method: "POST",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function updateCycle(
  token: string,
  id: number,
  payload: CyclePayload
) {
  return apiRequest<PhvaCycle>(
    `${BASE_PATH}/ciclos-phva/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function deactivateCycle(
  token: string,
  id: number
) {
  return apiRequest(
    `${BASE_PATH}/ciclos-phva/${id}`,
    {
      method: "DELETE",
    },
    token
  );
}

export function createStandardCategory(
  token: string,
  payload: StandardCategoryPayload
) {
  return apiRequest<StandardCategory>(
    `${BASE_PATH}/categorias-estandar`,
    {
      method: "POST",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function updateStandardCategory(
  token: string,
  id: number,
  payload: StandardCategoryPayload
) {
  return apiRequest<StandardCategory>(
    `${BASE_PATH}/categorias-estandar/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function deactivateStandardCategory(
  token: string,
  id: number
) {
  return apiRequest(
    `${BASE_PATH}/categorias-estandar/${id}`,
    {
      method: "DELETE",
    },
    token
  );
}

export function createStandard(
  token: string,
  payload: StandardPayload
) {
  return apiRequest<Standard>(
    `${BASE_PATH}/estandares`,
    {
      method: "POST",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function updateStandard(
  token: string,
  id: number,
  payload: StandardPayload
) {
  return apiRequest<Standard>(
    `${BASE_PATH}/estandares/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function deactivateStandard(
  token: string,
  id: number
) {
  return apiRequest(
    `${BASE_PATH}/estandares/${id}`,
    {
      method: "DELETE",
    },
    token
  );
}

export function createAspect(
  token: string,
  payload: AspectPayload
) {
  return apiRequest<AspectCatalog>(
    `${BASE_PATH}/aspectos`,
    {
      method: "POST",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function updateAspect(
  token: string,
  id: number,
  payload: AspectPayload
) {
  return apiRequest<AspectCatalog>(
    `${BASE_PATH}/aspectos/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function deactivateAspect(
  token: string,
  id: number
) {
  return apiRequest(
    `${BASE_PATH}/aspectos/${id}`,
    {
      method: "DELETE",
    },
    token
  );
}

export function createProcess(
  token: string,
  payload: ProcessPayload
) {
  return apiRequest<ProcessCatalog>(
    `${BASE_PATH}/procesos`,
    {
      method: "POST",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function updateProcess(
  token: string,
  id: number,
  payload: ProcessPayload
) {
  return apiRequest<ProcessCatalog>(
    `${BASE_PATH}/procesos/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(
        payload
      ),
    },
    token
  );
}

export function deactivateProcess(
  token: string,
  id: number
) {
  return apiRequest(
    `${BASE_PATH}/procesos/${id}`,
    {
      method: "DELETE",
    },
    token
  );
}

export function getMatrixHistory(
  token: string,
  versionSupermatrizId?: number,
  pagina = 1
) {
  return apiRequest<HistoryResponse>(
    withQuery(
      `${BASE_PATH}/historial`,
      {
        versionSupermatrizId,
        pagina,
        limite: 25,
      }
    ),
    {},
    token
  );
}
