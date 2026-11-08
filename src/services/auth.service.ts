import { http, TOKEN_TTL_MINUTES } from '@/api/http-client'
import type { AuthProfile, LoginRequest, LoginResponse } from '@/types/auth'

export class AuthService {
  login(credentials: LoginRequest): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { ...credentials, expiresInMins: TOKEN_TTL_MINUTES },
      skipAuthRefresh: true,
    })
  }

  // Захищений ендпоїнт: токен додає http-клієнт (Authorization: Bearer ...)
  me(): Promise<AuthProfile> {
    return http<AuthProfile>('/auth/me')
  }
}
