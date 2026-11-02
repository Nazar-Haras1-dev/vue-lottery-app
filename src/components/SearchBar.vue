<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{ placeholder?: string; initial?: string }>(), {
  placeholder: 'Search by name',
  initial: '',
})

const emit = defineEmits<{ 'filter-by-name': [value: string] }>()

const query = ref(props.initial)
watch(() => props.initial, (value) => (query.value = value))

// debounce 300 мс: подія йде лише коли користувач перестав друкувати
watch(query, (value, _old, onCleanup) => {
  const timer = setTimeout(() => emit('filter-by-name', value.trim()), 300)
  onCleanup(() => clearTimeout(timer))
})
</script>

<template>
  <input v-model="query" type="search" class="form-control" :placeholder="placeholder" />
</template>
