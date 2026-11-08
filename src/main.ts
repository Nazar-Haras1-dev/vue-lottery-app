import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@/assets/styles/main.scss'
import App from '@/App.vue'
import { setAuthFailureHandler } from '@/api/http-client'
import { router } from '@/router'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
app.use(createPinia())

const auth = useAuthStore()

// Якщо refresh не вдався (токени прострочені), розлогінюємо й ведемо на /login
setAuthFailureHandler(() => {
  auth.logout()
  void router.push({ name: 'login' })
})

app.use(router)

// Перевіряємо сесію запитом до захищеного /auth/me (тут спрацює інтерцептор)
if (auth.isAuthenticated) {
  auth.fetchMe().catch(() => auth.logout())
}

app.mount('#app')
