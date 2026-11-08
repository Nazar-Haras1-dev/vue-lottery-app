<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/BaseButton.vue'

const auth = useAuthStore()
const router = useRouter()

function logout(): void {
  auth.logout()
  void router.push({ name: 'login' })
}
</script>

<template>
  <nav class="app-nav">
    <!-- RouterLink сам додає клас router-link-active активному пункту -->
    <RouterLink :to="{ name: 'home' }" class="app-nav__link">Home</RouterLink>
    <RouterLink :to="{ name: 'about' }" class="app-nav__link">About author</RouterLink>
    <RouterLink :to="{ name: 'lottery' }" class="app-nav__link">Lottery</RouterLink>
    <RouterLink :to="{ name: 'users' }" class="app-nav__link">Users</RouterLink>
    <BaseButton v-if="auth.isAuthenticated" small variant="outline-secondary" @click="logout">Logout</BaseButton>
    <RouterLink v-else :to="{ name: 'login' }" class="app-nav__link">Login</RouterLink>
  </nav>
</template>

<style scoped>
.app-nav { display: flex; align-items: center; gap: 8px; }
.app-nav__link { padding: 6px 14px; border-radius: 8px; text-decoration: none; color: inherit; }
.app-nav__link:hover { background: rgba(54, 169, 220, 0.12); }
.app-nav__link.router-link-active { background: #36a9dc; color: #fff; }
</style>
