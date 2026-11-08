import { ref } from 'vue'

const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'

// ref, щоб зміна токена була реактивною (isAuthenticated оновлюється сам)
export const accessToken = ref<string | null>(localStorage.getItem(ACCESS_KEY))
export const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_KEY))

export function setTokens(access: string, refresh: string): void {
  accessToken.value = access
  refreshToken.value = refresh
  localStorage.setItem(ACCESS_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens(): void {
  accessToken.value = null
  refreshToken.value = null
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}
