import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'

// Єдина точка отримання сервісів (ліниво, по одному екземпляру)
export class ServiceProvider {
  private static userService?: UserService
  private static authService?: AuthService

  static get users(): UserService {
    this.userService ??= new UserService()
    return this.userService
  }

  static get auth(): AuthService {
    this.authService ??= new AuthService()
    return this.authService
  }
}
