<script setup lang="ts">
import type { ParticipantInput } from '@/types/participant'
import ParticipantForm from '@/components/ParticipantForm.vue'

defineProps<{ isEmailTaken: (email: string) => boolean }>()
defineEmits<{ register: [value: ParticipantInput] }>()
</script>

<template>
  <section class="card mb-3">
    <div class="card-body">
      <h2 class="h6 fw-bold text-uppercase mb-0">Register form</h2>
      <p class="text-body-secondary small mb-3">Please fill in all the fields.</p>
      <ParticipantForm
        submit-label="Save"
        reset-after-submit
        :is-email-taken="isEmailTaken"
        @submit="$emit('register', $event)"
      />
    </div>
  </section>
</template>
