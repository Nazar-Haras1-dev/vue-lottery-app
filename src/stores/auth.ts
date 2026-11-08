import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { accessToken, clearTokens, setTokens } from '@/api/token-storage'
import { ServiceProvider } from '@/services/service-provider'
import type { AuthProfile, LoginRequest } from '@/types/auth'

const USER_KEY = 'authUser'

function loadUser(): AuthProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthProfile) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthProfile | null>(loadUser())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => accessToken.value !== null)

  // Дані користувача дублюємо в localStorage
  watch(user, (value) => {
    if (value) localStorage.setItem(USER_KEY, JSON.stringify(value))
    else localStorage.removeItem(USER_KEY)
  }, { deep: true })

  async function login(credentials: LoginRequest): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const { accessToken: access, refreshToken: refresh, ...profile } = await ServiceProvider.auth.login(credentials)
      setTokens(access, refresh)
      user.value = profile
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function logout(): void {
    clearTokens()
    user.value = null
  }

  async function fetchMe(): Promise<void> {
    user.value = await ServiceProvider.auth.me()
  }

  return { user, isLoading, error, isAuthenticated, login, logout, fetchMe }
})
