<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PAGE_SIZE, useUsersStore } from '@/stores/users'
import type { User } from '@/types/user'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import BasePagination from '@/components/BasePagination.vue'
import SearchBar from '@/components/SearchBar.vue'
import UsersTable from '@/components/UsersTable.vue'

const route = useRoute()
const router = useRouter()
const store = useUsersStore()

// Стан списку живе в URL: /users?page=2&q=john
const page = computed(() => Math.max(1, Number(route.query.page) || 1))
const query = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const totalPages = computed(() => Math.max(1, Math.ceil(store.total / PAGE_SIZE)))

watch([page, query], () => store.fetchPage(page.value, query.value), { immediate: true })

function setQuery(q: string): void {
  if (q === query.value) return
  void router.replace({ query: { ...(q ? { q } : {}), page: 1 } })
}

function setPage(next: number): void {
  void router.push({ query: { ...route.query, page: next } })
}

const deleting = ref<User | null>(null)
const isDeleteOpen = computed({
  get: () => deleting.value !== null,
  set: (open: boolean) => { if (!open) deleting.value = null },
})

async function confirmDelete(): Promise<void> {
  if (!deleting.value) return
  const id = deleting.value.id
  deleting.value = null
  await store.remove(id) // зміни одразу видно, бо стор оновлює локальний стан
}
</script>

<template>
  <section>
    <div class="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-3">
      <h1 class="h3 mb-0">Users</h1>
      <div class="d-flex gap-2">
        <div style="min-width: 260px"><SearchBar placeholder="Search users" :initial="query" @filter-by-name="setQuery" /></div>
        <RouterLink :to="{ name: 'user-create' }" class="btn btn-primary">New user</RouterLink>
      </div>
    </div>

    <p v-if="store.isLoading" class="text-body-secondary">Loading...</p>
    <p v-else-if="store.error" class="text-danger">{{ store.error }}</p>
    <template v-else>
      <UsersTable :users="store.users" @remove="deleting = $event" />
      <div class="mt-3"><BasePagination :page="page" :total-pages="totalPages" @change="setPage" /></div>
    </template>

    <BaseModal v-model="isDeleteOpen" title="Видалення користувача">
      <p v-if="deleting" class="mb-0">Видалити "{{ deleting.firstName }} {{ deleting.lastName }}", "{{ deleting.email }}"?</p>
      <template #footer>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
        <BaseButton variant="secondary" @click="isDeleteOpen = false">Ні</BaseButton>
      </template>
    </BaseModal>
  </section>
</template>
