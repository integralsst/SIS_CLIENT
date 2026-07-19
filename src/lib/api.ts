const RAW_API_URL =
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_BACKEND_URL ??
  "";

const API_URL = String(RAW_API_URL).replace(/\/$/, "");

interface ApiErrorPayload {
  error?: string;
  message?: string;
  code?: string;
  details?: unknown;
  [key: string]: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly payload?: ApiErrorPayload;

  constructor(
    message: string,
    status: number,
    payload?: ApiErrorPayload
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code =
      typeof payload?.code === "string"
        ? payload.code
        : undefined;
    this.details = payload?.details;
    this.payload = payload;
  }
}

function buildUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${API_URL}${normalizedPath}`;
}

async function readResponseBody(
  response: Response
): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType =
    response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

function getErrorMessage(
  payload: unknown,
  status: number
): string {
  if (
    payload &&
    typeof payload === "object"
  ) {
    const data = payload as ApiErrorPayload;

    if (
      typeof data.error === "string" &&
      data.error.trim()
    ) {
      return data.error;
    }

    if (
      typeof data.message === "string" &&
      data.message.trim()
    ) {
      return data.message;
    }
  }

  if (
    typeof payload === "string" &&
    payload.trim()
  ) {
    return payload;
  }

  return `La solicitud no pudo completarse (HTTP ${status}).`;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  const bodyIsFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  if (options.body && !bodyIsFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(buildUrl(path), {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `No fue posible conectar con el servidor: ${error.message}`
        : "No fue posible conectar con el servidor."
    );
  }

  const payload = await readResponseBody(response);

  if (!response.ok) {
    const errorPayload =
      payload && typeof payload === "object"
        ? (payload as ApiErrorPayload)
        : undefined;

    throw new ApiError(
      getErrorMessage(payload, response.status),
      response.status,
      errorPayload
    );
  }

  return payload as T;
}
