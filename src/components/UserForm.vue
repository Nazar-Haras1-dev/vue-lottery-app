<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import type { CreateUserDto } from '@/types/user'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'

const props = defineProps<{
  initial?: Partial<CreateUserDto>
  submitLabel: string
  isSubmitting?: boolean
  serverError?: string | null
}>()

const emit = defineEmits<{ submit: [value: CreateUserDto] }>()

const schema = toTypedSchema(
  yup.object({
    firstName: yup.string().trim().required('First name is required'),
    lastName: yup.string().trim().required('Last name is required'),
    email: yup.string().trim().email('Invalid email format').required('Email is required'),
    username: yup.string().trim().required('Username is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    age: yup.number().typeError('Age must be a number').integer('Age must be an integer').min(1, 'Min age is 1').max(120, 'Max age is 120').required('Age is required'),
    gender: yup.string().oneOf(['male', 'female'] as const, 'Choose gender').required('Gender is required'),
    phone: yup.string().trim().matches(/^\+?[\d\s\-()]{7,}$/, 'Invalid phone number').required('Phone is required'),
  }),
)

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: { ...props.initial },
})

const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')
const [age, ageAttrs] = defineField('age')
const [gender, genderAttrs] = defineField('gender')
const [phone, phoneAttrs] = defineField('phone')

const onSubmit = handleSubmit((values) => emit('submit', values))
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div class="row">
      <div class="col-md-6"><BaseInput v-model="firstName" v-bind="firstNameAttrs" label="First name" :error="errors.firstName" /></div>
      <div class="col-md-6"><BaseInput v-model="lastName" v-bind="lastNameAttrs" label="Last name" :error="errors.lastName" /></div>
      <div class="col-md-6"><BaseInput v-model="email" v-bind="emailAttrs" label="Email" type="email" :error="errors.email" /></div>
      <div class="col-md-6"><BaseInput v-model="username" v-bind="usernameAttrs" label="Username" :error="errors.username" /></div>
      <div class="col-md-6"><BaseInput v-model="password" v-bind="passwordAttrs" label="Password" type="password" :error="errors.password" /></div>
      <div class="col-md-6"><BaseInput v-model="phone" v-bind="phoneAttrs" label="Phone" :error="errors.phone" /></div>
      <div class="col-md-6"><BaseInput v-model="age" v-bind="ageAttrs" label="Age" type="number" :error="errors.age" /></div>
      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold" for="gender">Gender</label>
        <select id="gender" v-model="gender" v-bind="genderAttrs" class="form-select" :class="{ 'is-invalid': errors.gender }">
          <option :value="undefined" disabled>Choose...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <div v-if="errors.gender" class="invalid-feedback">{{ errors.gender }}</div>
      </div>
    </div>
    <p v-if="serverError" class="text-danger">{{ serverError }}</p>
    <BaseButton type="submit" :disabled="isSubmitting">{{ isSubmitting ? 'Saving...' : submitLabel }}</BaseButton>
  </form>
</template>
