<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const schema = toTypedSchema(
  yup.object({
    username: yup.string().trim().required('Username is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  }),
)

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: { username: 'emilys', password: 'emilyspass' }, // тестові дані DummyJSON
})
const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

// Дозволяємо тільки внутрішні шляхи (захист від open redirect)
function getRedirect(): string {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/users'
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await auth.login(values)
    await router.push(getRedirect())
  } catch {
    /* повідомлення про помилку вже в auth.error і показується у формі */
  }
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <h1 class="h4 mb-3 text-center">Login</h1>
    <BaseInput v-model="username" v-bind="usernameAttrs" label="Username" :error="errors.username" />
    <BaseInput v-model="password" v-bind="passwordAttrs" label="Password" type="password" :error="errors.password" />
    <p v-if="auth.error" class="text-danger">{{ auth.error }}</p>
    <BaseButton type="submit" class="w-100" :disabled="auth.isLoading">{{ auth.isLoading ? 'Loading...' : 'Login' }}</BaseButton>
  </form>
</template>
