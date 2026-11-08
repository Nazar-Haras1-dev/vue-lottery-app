<script setup lang="ts">
import type { User } from '@/types/user'
import BaseButton from '@/components/BaseButton.vue'

defineProps<{ users: User[] }>()
defineEmits<{ remove: [user: User] }>()
</script>

<template>
  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead>
        <tr><th>#</th><th>Name</th><th>Username</th><th>Email</th><th>Phone</th><th>Age</th><th /></tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="text-body-secondary">{{ user.id }}</td>
          <td>
            <RouterLink :to="{ name: 'user-details', params: { id: user.id } }" class="text-decoration-none">
              {{ user.firstName }} {{ user.lastName }}
            </RouterLink>
          </td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.age }}</td>
          <td class="text-end text-nowrap">
            <RouterLink :to="{ name: 'user-edit', params: { id: user.id } }" class="btn btn-sm btn-outline-secondary me-2">Edit</RouterLink>
            <BaseButton small variant="outline-danger" @click="$emit('remove', user)">Delete</BaseButton>
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="7" class="text-center text-body-secondary py-4">No users found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
