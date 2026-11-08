<script setup lang="ts" generic="T extends string | number | undefined">
import { useId } from 'vue'

defineOptions({ inheritAttrs: false }) // атрибути (placeholder, onBlur...) віддаємо на <input>

defineProps<{
  label: string
  type?: string
  placeholder?: string
  error?: string
}>()

const model = defineModel<T>({ required: true })
const id = useId()
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label fw-semibold">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      v-bind="$attrs"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      class="form-control"
      :class="{ 'is-invalid': error }"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>
