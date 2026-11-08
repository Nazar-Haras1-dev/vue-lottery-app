<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ page: number; totalPages: number }>()
defineEmits<{ change: [page: number] }>()

// Вікно з 5 сторінок навколо поточної
const pages = computed<number[]>(() => {
  const end = Math.min(props.totalPages, Math.max(props.page + 2, 5))
  const start = Math.max(1, end - 4)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Pagination">
    <ul class="pagination justify-content-center mb-0">
      <li class="page-item" :class="{ disabled: page === 1 }">
        <button type="button" class="page-link" @click="$emit('change', page - 1)">«</button>
      </li>
      <li v-for="p in pages" :key="p" class="page-item" :class="{ active: p === page }">
        <button type="button" class="page-link" @click="$emit('change', p)">{{ p }}</button>
      </li>
      <li class="page-item" :class="{ disabled: page === totalPages }">
        <button type="button" class="page-link" @click="$emit('change', page + 1)">»</button>
      </li>
    </ul>
  </nav>
</template>
