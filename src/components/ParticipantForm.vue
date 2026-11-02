<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { ParticipantInput } from '@/types/participant'
import { validateParticipant } from '@/utils/validators'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'

const props = withDefaults(
  defineProps<{
    initial?: ParticipantInput
    submitLabel?: string
    resetAfterSubmit?: boolean
    isEmailTaken: (email: string) => boolean
  }>(),
  { submitLabel: 'Save', resetAfterSubmit: false },
)

const emit = defineEmits<{ submit: [value: ParticipantInput] }>()

const empty = (): ParticipantInput => ({ name: '', dob: '', email: '', phone: '' })

const values = reactive<ParticipantInput>({ ...empty(), ...props.initial })
const touched = reactive<Record<keyof ParticipantInput, boolean>>({ name: false, dob: false, email: false, phone: false })
const submitted = ref(false)

const errors = computed(() => validateParticipant(values, props.isEmailTaken))

// Помилку показуємо, лише коли поле «торкнули» або була спроба збереження
const errorOf = (field: keyof ParticipantInput): string | undefined =>
  submitted.value || touched[field] ? errors.value[field] : undefined

function resetForm(): void {
  Object.assign(values, empty())
  Object.assign(touched, { name: false, dob: false, email: false, phone: false })
  submitted.value = false // помилки зникають, валідація не спрацьовує
}

function onSubmit(): void {
  submitted.value = true
  if (Object.keys(errors.value).length > 0) return
  emit('submit', {
    name: values.name.trim(),
    dob: values.dob,
    email: values.email.trim(),
    phone: values.phone.trim(),
  })
  if (props.resetAfterSubmit) resetForm()
}
</script>

<template>
  <!-- Enter у будь-якому полі відправляє форму -->
  <form novalidate @keydown.enter.prevent="onSubmit">
    <BaseInput v-model="values.name" label="Name" placeholder="Enter user name" :error="errorOf('name')" @blur="touched.name = true" />
    <BaseInput v-model="values.dob" label="Date of Birth" type="date" :error="errorOf('dob')" @blur="touched.dob = true" />
    <BaseInput v-model="values.email" label="Email" type="email" placeholder="Enter email" :error="errorOf('email')" @blur="touched.email = true" />
    <BaseInput v-model="values.phone" label="Phone number" placeholder="+380XXXXXXXXX" :error="errorOf('phone')" @blur="touched.phone = true" />
    <div class="d-flex justify-content-end mt-4">
      <BaseButton @click="onSubmit">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>
