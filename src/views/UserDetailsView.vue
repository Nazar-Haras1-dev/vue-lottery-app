<script setup lang="ts">
import { computed, watch } from 'vue'
import { useUsersStore } from '@/stores/users'

// props: true у роутері передає :id сюди
const props = defineProps<{ id: string }>()
const store = useUsersStore()
const userId = computed(() => Number(props.id))

watch(userId, (id) => store.fetchUser(id), { immediate: true })
</script>

<template>
  <section>
    <RouterLink :to="{ name: 'users' }" class="text-decoration-none">← Back to users</RouterLink>

    <p v-if="store.isLoading" class="mt-3 text-body-secondary">Loading...</p>
    <p v-else-if="store.error" class="mt-3 text-danger">{{ store.error }}</p>
    <div v-else-if="store.current" class="card mt-3">
      <div class="card-body d-flex flex-wrap gap-4">
        <img v-if="store.current.image" :src="store.current.image" :alt="store.current.firstName" width="120" height="120" class="rounded" />
        <div>
          <h1 class="h4">{{ store.current.firstName }} {{ store.current.lastName }}</h1>
          <dl class="row mb-3">
            <dt class="col-sm-4">Username</dt><dd class="col-sm-8">{{ store.current.username }}</dd>
            <dt class="col-sm-4">Email</dt><dd class="col-sm-8">{{ store.current.email }}</dd>
            <dt class="col-sm-4">Phone</dt><dd class="col-sm-8">{{ store.current.phone }}</dd>
            <dt class="col-sm-4">Age</dt><dd class="col-sm-8">{{ store.current.age }}</dd>
            <dt class="col-sm-4">Gender</dt><dd class="col-sm-8">{{ store.current.gender }}</dd>
            <template v-if="store.current.address">
              <dt class="col-sm-4">Address</dt>
              <dd class="col-sm-8">{{ store.current.address.address }}, {{ store.current.address.city }}, {{ store.current.address.country }}</dd>
            </template>
          </dl>
          <RouterLink :to="{ name: 'user-edit', params: { id } }" class="btn btn-outline-secondary">Edit</RouterLink>
        </div>
      </div>
    </div>

    <!-- Вкладений маршрут /users/:id/edit рендериться тут -->
    <RouterView />
  </section>
</template>
