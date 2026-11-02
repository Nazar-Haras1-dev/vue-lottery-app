import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import eslint from 'vite-plugin-eslint2' // 1. Додали імпорт плагіна лінтера

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    eslint({
      // 2. Інтегрували запуск лінтера при збереженні файлів
      fix: true,          // Автоматично виправляти дрібні помилки стилю
      cache: false,       // Вимикаємо кеш, щоб лінтер завжди бачив свіжі зміни
      include: ['src/**/*.{js,ts,vue,jsx,tsx}'] 
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['import', 'mixed-decls', 'color-functions', 'global-builtin'],
      },
    },
  },
})
