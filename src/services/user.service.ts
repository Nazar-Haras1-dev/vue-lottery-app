import { http } from '@/api/http-client'
import type { ListParams, Paginated } from '@/types/api'
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user'
import type { Creatable, Deletable, Editable, Readable } from '@/services/interfaces'

interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export class UserService
  implements Readable<User>, Creatable<User, CreateUserDto>, Editable<User, UpdateUserDto>, Deletable
{
  async getAll({ limit = 10, skip = 0, q }: ListParams = {}): Promise<Paginated<User>> {
    const path = q
      ? `/users/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
      : `/users?limit=${limit}&skip=${skip}`
    const data = await http<UsersResponse>(path)
    return { items: data.users, total: data.total, skip: data.skip, limit: data.limit }
  }

  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`)
  }

  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', { method: 'POST', body: data })
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, { method: 'PUT', body: data })
  }

  async delete(id: number): Promise<void> {
    await http(`/users/${id}`, { method: 'DELETE' })
  }
}
