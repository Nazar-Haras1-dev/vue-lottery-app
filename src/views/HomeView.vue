<script setup lang="ts">
import { AUTHOR } from '@/data/author'

const technologies = ['Vue 3 + Composition API', 'TypeScript', 'Vue Router', 'Pinia', 'VeeValidate + Yup', 'Bootstrap (SCSS)', 'Vite', 'DummyJSON REST API (JWT)']
</script>

<template>
  <section>
    <h1 class="mb-3">Vue Lottery App</h1>
    <p class="lead">
      Навчальний застосунок лотереї: керування учасниками (CRUD) з даними з DummyJSON, авторизація за JWT,
      захищені маршрути та патерн Repository для роботи з REST API.
    </p>
    <h2 class="h5 mt-4">Технології</h2>
    <ul>
      <li v-for="tech in technologies" :key="tech">{{ tech }}</li>
    </ul>
    <a :href="AUTHOR.projectGithub" target="_blank" rel="noopener" class="btn btn-primary">GitHub проєкту</a>
  </section>
</template>
