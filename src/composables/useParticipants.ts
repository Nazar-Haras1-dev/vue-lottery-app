import { computed, ref, watch } from 'vue'
import type { Participant, ParticipantInput } from '@/types/participant'

const PARTICIPANTS_KEY = 'lottery:participants'
const WINNERS_KEY = 'lottery:winners'
export const MAX_WINNERS = 3

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function useParticipants() {
  // Відновлення з localStorage при завантаженні застосунку
  const participants = ref<Participant[]>(loadJson<Participant[]>(PARTICIPANTS_KEY, []))
  const winnerIds = ref<string[]>(loadJson<string[]>(WINNERS_KEY, []))

  // Збереження за допомогою watcher (deep)
  watch(participants, (value) => localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(value)), { deep: true })
  watch(winnerIds, (value) => localStorage.setItem(WINNERS_KEY, JSON.stringify(value)), { deep: true })

  const winners = computed<Participant[]>(() =>
    winnerIds.value
      .map((id) => participants.value.find((p) => p.id === id))
      .filter((p): p is Participant => p !== undefined),
  )

  // Переможцем можуть стати лише ті, хто ще не переміг
  const candidates = computed(() => participants.value.filter((p) => !winnerIds.value.includes(p.id)))

  const canPickWinner = computed(() => winnerIds.value.length < MAX_WINNERS && candidates.value.length > 0)

  function isEmailTaken(email: string, ignoreId?: string): boolean {
    const normalized = email.trim().toLowerCase()
    return participants.value.some((p) => p.id !== ignoreId && p.email.trim().toLowerCase() === normalized)
  }

  function add(input: ParticipantInput): void {
    participants.value.push({ id: crypto.randomUUID(), ...input })
  }

  function update(id: string, input: ParticipantInput): void {
    const index = participants.value.findIndex((p) => p.id === id)
    if (index !== -1) participants.value[index] = { id, ...input }
  }

  function remove(id: string): void {
    participants.value = participants.value.filter((p) => p.id !== id)
    winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
  }

  function pickWinner(): void {
    if (!canPickWinner.value) return
    const pool = candidates.value
    const winner = pool[Math.floor(Math.random() * pool.length)]
    winnerIds.value.push(winner.id)
  }

  function removeWinner(id: string): void {
    winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
  }

  return { participants, winners, canPickWinner, isEmailTaken, add, update, remove, pickWinner, removeWinner }
}
