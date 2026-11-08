import { accessToken, clearTokens, refreshToken, setTokens } from '@/api/token-storage'
import type { AuthTokens } from '@/types/auth'

// Єдине місце, де відомо про fetch, базову адресу, токени й обробку помилок
const BASE_URL = import.meta.env.VITE_API_URL
const TOKEN_TTL_MINUTES = 30

export class HttpError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

interface HttpOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  skipAuthRefresh?: boolean // для /auth/login: 401 там означає «невірний пароль»
}

let onAuthFailure: (() => void) | null = null
export function setAuthFailureHandler(handler: () => void): void {
  onAuthFailure = handler
}

let refreshing: Promise<boolean> | null = null

async function refreshTokens(): Promise<boolean> {
  if (!refreshToken.value) return false
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshToken.value, expiresInMins: TOKEN_TTL_MINUTES }),
    })
    if (!response.ok) return false
    const data = (await response.json()) as AuthTokens
    setTokens(data.accessToken, data.refreshToken)
    return true
  } catch {
    return false
  }
}

function send(path: string, options: HttpOptions): Promise<Response> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (accessToken.value) headers.Authorization = `Bearer ${accessToken.value}`
  return fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  let response = await send(path, options)

  // Interceptor: 401 -> оновлюємо токен -> повторюємо запит один раз
  if (response.status === 401 && !options.skipAuthRefresh && refreshToken.value) {
    // Кілька паралельних 401 чекають на один і той самий refresh
    refreshing ??= refreshTokens().finally(() => {
      refreshing = null
    })
    if (await refreshing) {
      response = await send(path, options)
    } else {
      clearTokens()
      onAuthFailure?.()
    }
  }

  if (!response.ok) {
    let message = response.statusText
    try {
      const body = (await response.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {
      /* тіло не JSON: лишаємо statusText */
    }
    throw new HttpError(response.status, message)
  }

  return (await response.json()) as T
}

export { TOKEN_TTL_MINUTES }
