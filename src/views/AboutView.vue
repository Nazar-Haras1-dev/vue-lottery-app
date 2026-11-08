<script setup lang="ts">
import { AUTHOR } from '@/data/author'
</script>

<template>
  <section>
    <h1 class="mb-3">About author</h1>
    <p class="lead">{{ AUTHOR.fullName }}</p>
    <h2 class="h5">Technical skills</h2>
    <ul>
      <li v-for="skill in AUTHOR.skills" :key="skill">{{ skill }}</li>
    </ul>
    <a :href="AUTHOR.github" target="_blank" rel="noopener" class="btn btn-primary">GitHub</a>
  </section>
</template>
