<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'outline-secondary' | 'outline-danger'
    type?: 'button' | 'submit'
    disabled?: boolean
    small?: boolean
  }>(),
  { variant: 'primary', type: 'button', disabled: false, small: false },
)
</script>

<template>
  <button :type="type" :disabled="disabled" :class="['btn', `btn-${variant}`, { 'btn-sm': small }]">
    <slot />
  </button>
</template>
