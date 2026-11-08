<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto } from '@/types/user'
import UserForm from '@/components/UserForm.vue'

const props = defineProps<{ id: string }>()
const router = useRouter()
const store = useUsersStore()

const userId = computed(() => Number(props.id))
// Форму показуємо, коли батьківський маршрут уже завантажив цього користувача
const user = computed(() => (store.current?.id === userId.value ? store.current : null))
const serverError = ref<string | null>(null)

async function onSubmit(values: CreateUserDto): Promise<void> {
  serverError.value = null
  try {
    await store.update(userId.value, values)
    await router.push({ name: 'user-details', params: { id: props.id } })
  } catch (e) {
    serverError.value = (e as Error).message
  }
}
</script>

<template>
  <div v-if="user" class="card mt-3">
    <div class="card-body">
      <h2 class="h5 mb-3">Edit user</h2>
      <UserForm
        :initial="{ firstName: user.firstName, lastName: user.lastName, email: user.email, username: user.username, password: user.password ?? '', age: user.age, gender: user.gender, phone: user.phone }"
        submit-label="Update"
        :is-submitting="store.isSaving"
        :server-error="serverError"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>
