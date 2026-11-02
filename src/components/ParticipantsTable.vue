<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Participant } from '@/types/participant'
import BaseButton from '@/components/BaseButton.vue'
import SearchBar from '@/components/SearchBar.vue'

type SortKey = 'name' | 'dob'
type SortDirection = 'asc' | 'desc'

const props = defineProps<{ participants: Participant[] }>()
defineEmits<{ edit: [participant: Participant]; remove: [participant: Participant] }>()

const query = ref('')
const sortKey = ref<SortKey | null>(null)
const sortDirection = ref<SortDirection>('asc')

function toggleSort(key: SortKey): void {
  if (sortKey.value === key) sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

// Спочатку фільтр, потім сортування; вихідний масив props не змінюється
const visibleParticipants = computed<Participant[]>(() => {
  const needle = query.value.trim().toLowerCase()
  const filtered = props.participants.filter((p) => p.name.toLowerCase().includes(needle))
  const key = sortKey.value
  if (!key) return filtered
  const direction = sortDirection.value === 'asc' ? 1 : -1
  return filtered.sort((a, b) => a[key].localeCompare(b[key]) * direction)
})

const nameIcon = computed(() => (sortKey.value === 'name' && sortDirection.value === 'desc' ? 'bi-sort-alpha-up' : 'bi-sort-alpha-down'))
const dobIcon = computed(() => (sortKey.value === 'dob' && sortDirection.value === 'desc' ? 'bi-sort-up' : 'bi-sort-down'))

const formatDate = (iso: string): string => iso.split('-').reverse().join('/')
</script>

<template>
  <section class="card mb-3">
    <div class="card-body">
      <div class="mb-3"><SearchBar @filter-by-name="query = $event" /></div>
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th class="text-body-secondary">#</th>
              <th>
                Name
                <button type="button" class="sort-btn" title="Sort by name" @click="toggleSort('name')"><i class="bi" :class="nameIcon" /></button>
              </th>
              <th>
                Date of Birth
                <button type="button" class="sort-btn" title="Sort by date of birth" @click="toggleSort('dob')"><i class="bi" :class="dobIcon" /></button>
              </th>
              <th>Email</th>
              <th>Phone number</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(participant, index) in visibleParticipants" :key="participant.id">
              <td class="text-body-secondary">{{ index + 1 }}</td>
              <td>{{ participant.name }}</td>
              <td>{{ formatDate(participant.dob) }}</td>
              <td>{{ participant.email }}</td>
              <td>{{ participant.phone }}</td>
              <td><BaseButton small variant="outline-secondary" @click="$emit('edit', participant)">Редагувати дані</BaseButton></td>
              <td><BaseButton small variant="outline-danger" @click="$emit('remove', participant)">Видалити учасника</BaseButton></td>
            </tr>
            <tr v-if="visibleParticipants.length === 0">
              <td colspan="7" class="text-center text-body-secondary py-3">
                {{ participants.length === 0 ? 'No participants yet' : 'Nothing found' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sort-btn { border: 0; background: transparent; padding: 0 4px; cursor: pointer; color: inherit; }
</style>
