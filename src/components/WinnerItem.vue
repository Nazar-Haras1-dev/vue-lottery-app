<script setup lang="ts">
defineProps<{ name: string }>()
defineEmits<{ remove: [] }>()
</script>

<template>
  <span class="badge text-bg-primary d-inline-flex align-items-center gap-1">
    {{ name }}
    <button type="button" class="winner-remove" :aria-label="`Remove ${name}`" @click="$emit('remove')">×</button>
  </span>
</template>

<style scoped>
.winner-remove { border: 0; background: transparent; color: inherit; padding: 0 2px; line-height: 1; cursor: pointer; }
</style>
