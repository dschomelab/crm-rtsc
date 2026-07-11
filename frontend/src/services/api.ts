const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

let accessToken: string | null = null;
let refreshToken: string | null = null;
let onTokenRefresh: ((tokens: RefreshResponse) => void) | null = null;

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
}

export function getAccessToken() {
  return accessToken;
}

export function setTokenRefreshCallback(cb: (tokens: RefreshResponse) => void) {
  onTokenRefresh = cb;
}

async function refreshTokens(): Promise<boolean> {
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data: RefreshResponse = await res.json();
    accessToken = data.accessToken;
    refreshToken = data.refreshToken;
    onTokenRefresh?.(data);
    return true;
  } catch {
    return false;
  }
}

async function request<T>(
  method: string,
  url: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const isFormData = body instanceof FormData;
  if (!isFormData && body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  let res = await fetch(`${API_URL}${url}`, {
    method,
    headers,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && refreshToken) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      res = await fetch(`${API_URL}${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } else {
      clearTokens();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      throw new ApiError(401, ['Sessão expirada. Faça login novamente.']);
    }
  }

  if (res.status === 401) {
    clearTokens();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw new ApiError(401, ['Sessão expirada. Faça login novamente.']);
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ messages: [res.statusText] }));
    throw new ApiError(res.status, error.messages ?? error.message ?? ['Request failed']);
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  public messages: string[];
  constructor(
    public status: number,
    messages: string | string[],
  ) {
    super(Array.isArray(messages) ? messages[0] : messages);
    this.messages = Array.isArray(messages) ? messages : [messages];
    this.name = 'ApiError';
  }
}

export const apiClient = {
  get: <T>(url: string) => request<T>('GET', url),
  post: <T>(url: string, body?: unknown) => request<T>('POST', url, body),
  patch: <T>(url: string, body?: unknown) => request<T>('PATCH', url, body),
  put: <T>(url: string, body?: unknown) => request<T>('PUT', url, body),
  delete: <T>(url: string) => request<T>('DELETE', url),
};
