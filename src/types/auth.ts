import type { Gender } from '@/types/user'

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthProfile {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: Gender
  image?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export type LoginResponse = AuthProfile & AuthTokens
