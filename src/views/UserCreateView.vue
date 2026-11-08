<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto } from '@/types/user'
import UserForm from '@/components/UserForm.vue'

const router = useRouter()
const store = useUsersStore()
const serverError = ref<string | null>(null)

async function onSubmit(values: CreateUserDto): Promise<void> {
  serverError.value = null
  try {
    await store.create(values)
    await router.push({ name: 'users' })
  } catch (e) {
    serverError.value = (e as Error).message
  }
}
</script>

<template>
  <section>
    <RouterLink :to="{ name: 'users' }" class="text-decoration-none">← Back to users</RouterLink>
    <div class="card mt-3">
      <div class="card-body">
        <h1 class="h4 mb-3">New user</h1>
        <UserForm submit-label="Create" :is-submitting="store.isSaving" :server-error="serverError" @submit="onSubmit" />
      </div>
    </div>
  </section>
</template>
