import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/services/service-provider'
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user'

export const PAGE_SIZE = 10
const LOCAL_ID_START = 100000 // id локально створених користувачів

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const current = ref<User | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  // DummyJSON лише імітує POST/PUT/DELETE, тому зміни пам'ятаємо локально
  const created = ref<User[]>([])
  const edited = ref<Record<number, User>>({})
  const deletedIds = ref<number[]>([])

  let requestId = 0

  const applyOverlays = (items: User[]): User[] =>
    items.filter((u) => !deletedIds.value.includes(u.id)).map((u) => edited.value[u.id] ?? u)

  async function fetchPage(page: number, q: string): Promise<void> {
    const id = ++requestId
    isLoading.value = true
    error.value = null
    try {
      const result = await ServiceProvider.users.getAll({ limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE, q: q || undefined })
      if (id !== requestId) return // застарілу відповідь ігноруємо
      const items = applyOverlays(result.items)
      const showCreated = page === 1 && !q
      users.value = showCreated ? [...created.value, ...items] : items
      total.value = result.total + created.value.length - deletedIds.value.length
    } catch (e) {
      if (id === requestId) error.value = (e as Error).message
    } finally {
      if (id === requestId) isLoading.value = false
    }
  }

  async function fetchUser(id: number): Promise<void> {
    isLoading.value = true
    error.value = null
    current.value = null
    try {
      if (deletedIds.value.includes(id)) throw new Error('User was deleted')
      const local = created.value.find((u) => u.id === id)
      current.value = local ?? edited.value[id] ?? (await ServiceProvider.users.getById(id))
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  async function create(dto: CreateUserDto): Promise<User> {
    isSaving.value = true
    try {
      const response = await ServiceProvider.users.create(dto)
      const user: User = { ...response, ...dto, id: LOCAL_ID_START + created.value.length + 1 }
      created.value.unshift(user)
      users.value.unshift(user)
      total.value += 1
      return user
    } finally {
      isSaving.value = false
    }
  }

  async function update(id: number, dto: UpdateUserDto): Promise<User> {
    isSaving.value = true
    try {
      const isLocal = id >= LOCAL_ID_START
      if (!isLocal) await ServiceProvider.users.update(id, dto)
      const base = users.value.find((u) => u.id === id) ?? current.value
      if (!base) throw new Error('User not found')
      const updated: User = { ...base, ...dto }
      if (isLocal) created.value = created.value.map((u) => (u.id === id ? updated : u))
      else edited.value[id] = updated
      users.value = users.value.map((u) => (u.id === id ? updated : u))
      if (current.value?.id === id) current.value = updated
      return updated
    } finally {
      isSaving.value = false
    }
  }

  async function remove(id: number): Promise<void> {
    isSaving.value = true
    try {
      if (id < LOCAL_ID_START) {
        await ServiceProvider.users.delete(id)
        deletedIds.value.push(id)
      } else {
        created.value = created.value.filter((u) => u.id !== id)
      }
      users.value = users.value.filter((u) => u.id !== id)
      total.value = Math.max(0, total.value - 1)
    } finally {
      isSaving.value = false
    }
  }

  return { users, total, current, isLoading, isSaving, error, fetchPage, fetchUser, create, update, remove }
})
