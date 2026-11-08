<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Participant, ParticipantInput } from '@/types/participant'
import { useParticipants } from '@/composables/useParticipants'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import ParticipantForm from '@/components/ParticipantForm.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import WinnersList from '@/components/WinnersList.vue'

const { participants, winners, canPickWinner, isEmailTaken, add, update, remove, pickWinner, removeWinner } = useParticipants()

const editing = ref<Participant | null>(null)
const deleting = ref<Participant | null>(null)

// writable computed: модалка закривається -> очищаємо вибраного учасника
const isEditOpen = computed({
  get: () => editing.value !== null,
  set: (open: boolean) => { if (!open) editing.value = null },
})
const isDeleteOpen = computed({
  get: () => deleting.value !== null,
  set: (open: boolean) => { if (!open) deleting.value = null },
})

function onUpdate(input: ParticipantInput): void {
  if (!editing.value) return
  update(editing.value.id, input)
  editing.value = null
}

function confirmDelete(): void {
  if (deleting.value) remove(deleting.value.id)
  deleting.value = null
}
</script>

<template>
  <section class="lottery mx-auto">
    <WinnersList :winners="winners" :can-pick="canPickWinner" @pick="pickWinner" @remove="removeWinner" />
    <RegisterForm :is-email-taken="(email) => isEmailTaken(email)" @register="add" />
    <ParticipantsTable :participants="participants" @edit="editing = $event" @remove="deleting = $event" />

    <BaseModal v-model="isEditOpen" title="Редагувати учасника">
      <ParticipantForm
        v-if="editing"
        :key="editing.id"
        :initial="{ name: editing.name, dob: editing.dob, email: editing.email, phone: editing.phone }"
        submit-label="Оновити дані"
        :is-email-taken="(email) => isEmailTaken(email, editing?.id)"
        @submit="onUpdate"
      />
    </BaseModal>

    <BaseModal v-model="isDeleteOpen" title="Видалення учасника">
      <p v-if="deleting" class="mb-0">Ви дійсно бажаєте видалити учасника "{{ deleting.name }}", "{{ deleting.email }}"?</p>
      <template #footer>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
        <BaseButton variant="secondary" @click="isDeleteOpen = false">Ні</BaseButton>
      </template>
    </BaseModal>
  </section>
</template>

<style scoped>
.lottery { max-width: 760px; }
</style>
