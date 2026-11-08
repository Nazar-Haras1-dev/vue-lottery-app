<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
</script>

<template>
  <main class="auth-layout">
    <div class="auth-layout__box">
      <div class="text-center mb-4"><AppLogo /></div>
      <slot />
    </div>
  </main>
</template>

<style scoped>
.auth-layout { min-height: 100vh; display: grid; place-items: center; padding: 16px; }
.auth-layout__box { width: 100%; max-width: 400px; background: #fff; padding: 32px; border-radius: 16px; box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08); }
</style>
