import type { ParticipantInput } from '@/types/participant'

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const PHONE_REGEX = /^\+380\d{9}$/ // +380 та 9 цифр

export type ParticipantErrors = Partial<Record<keyof ParticipantInput, string>>

const REQUIRED = "Це поле є обов'язковим"

// Локальна дата у форматі yyyy-mm-dd (toISOString дає UTC і може "з'їсти" день)
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function validateParticipant(
  values: ParticipantInput,
  isEmailTaken: (email: string) => boolean,
  today: Date = new Date(),
): ParticipantErrors {
  const errors: ParticipantErrors = {}

  if (!values.name.trim()) errors.name = REQUIRED

  if (!values.dob) errors.dob = REQUIRED
  else if (values.dob > toIsoDate(today)) errors.dob = 'Дата народження не може бути в майбутньому'

  const email = values.email.trim()
  if (!email) errors.email = REQUIRED
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Введіть коректний e-mail'
  else if (isEmailTaken(email)) errors.email = 'Учасник з таким e-mail вже існує'

  const phone = values.phone.trim()
  if (!phone) errors.phone = REQUIRED
  else if (!PHONE_REGEX.test(phone)) errors.phone = 'Формат телефону: +380XXXXXXXXX'

  return errors
}
