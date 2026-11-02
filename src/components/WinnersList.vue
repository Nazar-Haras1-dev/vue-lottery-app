<script setup lang="ts">
import type { Participant } from '@/types/participant'
import BaseButton from '@/components/BaseButton.vue'
import WinnerItem from '@/components/WinnerItem.vue'

defineProps<{ winners: Participant[]; canPick: boolean }>()
defineEmits<{ pick: []; remove: [id: string] }>()
</script>

<template>
  <section class="card mb-3">
    <div class="card-body d-flex gap-3 align-items-center">
      <div class="form-control d-flex flex-wrap align-items-center gap-1 flex-grow-1">
        <WinnerItem v-for="winner in winners" :key="winner.id" :name="winner.name" @remove="$emit('remove', winner.id)" />
        <span class="text-body-secondary">Winners</span>
      </div>
      <BaseButton :disabled="!canPick" @click="$emit('pick')">New winner</BaseButton>
    </div>
  </section>
</template>
