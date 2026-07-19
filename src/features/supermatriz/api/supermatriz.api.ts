import { apiRequest } from "../../../lib/api";
import type {
  MatrixCatalogs,
  MatrixFilters,
  MatrixTask,
  MatrixTaskListResponse,
  MatrixTaskPayload,
  MatrixVersion,
  MatrixVersionPayload,
} from "../types/supermatriz.types";

const BASE_PATH = "/api/supermatriz";

export function getMatrixCatalogs(token: string) {
  return apiRequest<MatrixCatalogs>(
    `${BASE_PATH}/catalogos`,
    {},
    token
  );
}

export function getMatrixTasks(
  token: string,
  filters: MatrixFilters
) {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  });

  return apiRequest<MatrixTaskListResponse>(
    `${BASE_PATH}/tareas?${query.toString()}`,
    {},
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
      body: JSON.stringify(payload),
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
      body: JSON.stringify(payload),
    },
    token
  );
}

export function deactivateMatrixTask(token: string, id: number) {
  return apiRequest(
    `${BASE_PATH}/tareas/${id}`,
    { method: "DELETE" },
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
      body: JSON.stringify(payload),
    },
    token
  );
}
