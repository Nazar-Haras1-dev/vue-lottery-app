<script setup lang="ts">
import AppNavigation from '@/components/AppNavigation.vue'
import AppLogo from '@/components/AppLogo.vue'
</script>

<template>
  <header class="app-header">
    <div class="container d-flex align-items-center justify-content-between py-3">
      <AppLogo />
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped>
.app-header { background: #fff; border-bottom: 1px solid #e5e9f5; }
</style>
