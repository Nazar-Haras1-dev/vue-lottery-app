export type Gender = 'male' | 'female'

export interface User {
  id: number
  firstName: string
  lastName: string
  age: number
  gender: Gender
  email: string
  phone: string
  username: string
  password?: string
  image?: string
  birthDate?: string
  role?: string
  address?: { address: string; city: string; state: string; country: string }
  company?: { name: string; title: string; department: string }
}

export type CreateUserDto = Pick<User, 'firstName' | 'lastName' | 'email' | 'username' | 'age' | 'gender' | 'phone'> & {
  password: string
}

export type UpdateUserDto = Partial<CreateUserDto>
