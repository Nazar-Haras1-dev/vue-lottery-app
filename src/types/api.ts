export interface ListParams {
  limit?: number
  skip?: number
  q?: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}
