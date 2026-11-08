<template>
  <RouterLink :to="{ name: 'home' }" class="logo" aria-label="Vue Lottery">
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#36a9dc" />
      <path d="M8 10h16l-8 14z" fill="#fff" />
    </svg>
    <span class="logo__text">Vue Lottery</span>
  </RouterLink>
</template>

<style scoped>
.logo { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: inherit; font-weight: 700; font-size: 1.15rem; }
</style>
