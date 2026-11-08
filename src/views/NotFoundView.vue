<template>
  <section class="text-center py-5">
    <h1 class="display-1 fw-bold">404</h1>
    <p class="lead">Сторінку не знайдено</p>
    <RouterLink :to="{ name: 'home' }" class="btn btn-primary">На головну</RouterLink>
  </section>
</template>
