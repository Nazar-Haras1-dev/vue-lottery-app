import type { ListParams, Paginated } from '@/types/api'

export interface Readable<T> {
  getAll(params?: ListParams): Promise<Paginated<T>>
  getById(id: number): Promise<T>
}

export interface Creatable<T, TCreate> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable {
  delete(id: number): Promise<void>
}
