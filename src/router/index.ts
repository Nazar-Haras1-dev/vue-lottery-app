import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Типізуємо поле meta
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    layout?: 'default' | 'auth'
    requiresAuth?: boolean
    guestOnly?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { title: 'Home' } },
  { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue'), meta: { title: 'About author' } },
  { path: '/lottery', name: 'lottery', component: () => import('@/views/LotteryView.vue'), meta: { title: 'Lottery' } },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login', layout: 'auth', guestOnly: true },
  },
  {
    path: '/users',
    meta: { requiresAuth: true }, // успадковується всіма дочірніми маршрутами
    children: [
      { path: '', name: 'users', component: () => import('@/views/UsersView.vue'), meta: { title: 'Users' } },
      { path: 'new', name: 'user-create', component: () => import('@/views/UserCreateView.vue'), meta: { title: 'New user' } },
      {
        path: ':id(\\d+)',
        name: 'user-details',
        component: () => import('@/views/UserDetailsView.vue'),
        props: true, // :id потрапляє в компонент як prop
        meta: { title: 'User details' },
        children: [
          // /users/:id/edit показується у <RouterView /> всередині UserDetailsView
          {
            path: 'edit',
            name: 'user-edit',
            component: () => import('@/views/UserEditView.vue'),
            props: true,
            meta: { title: 'Edit user' },
          },
        ],
      },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue'), meta: { title: '404' } },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'users' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | Vue Lottery` : 'Vue Lottery'
})
