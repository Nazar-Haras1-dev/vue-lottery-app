<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

defineProps<{ title: string }>()

const open = defineModel<boolean>({ required: true })
const root = ref<HTMLElement | null>(null)

// Фокус у вікно, щоб працював @keydown.esc
watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    root.value?.focus()
  }
})

function close(): void {
  open.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        ref="root"
        class="modal d-block modal-overlay"
        tabindex="-1"
        role="dialog"
        @keydown.esc="close"
        @click.self="close"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ title }}</h5>
              <button type="button" class="btn-close" aria-label="Close" @click="close" />
            </div>
            <div class="modal-body"><slot /></div>
            <div v-if="$slots.footer" class="modal-footer"><slot name="footer" /></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay { background: rgba(0, 0, 0, 0.5); overflow-y: auto; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
