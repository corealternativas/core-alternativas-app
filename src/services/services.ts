const TOKEN_KEY = "auth_token"

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

interface ApiError extends Error {
  status?: number
}

export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  const contentType = res.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")
  const body = isJson ? await res.json().catch(() => ({})) : await res.text()

  if (!res.ok) {
    const err: ApiError = new Error(
      (isJson && (body as { error?: string })?.error) ||
        `Request failed: ${res.status}`
    )
    err.status = res.status
    throw err
  }

  return body as T
}
