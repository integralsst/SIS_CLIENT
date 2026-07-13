const rawApiUrl =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:4000";

export const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

interface ApiErrorBody {
  error?: string;
  message?: string;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  let data: unknown = null;

  if (response.status !== 204) {
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : null;
    }
  }

  if (!response.ok) {
    const body = (data ?? {}) as ApiErrorBody;
    throw new Error(
      body.error ||
        body.message ||
        `La solicitud falló con estado ${response.status}.`
    );
  }

  return data as T;
}
