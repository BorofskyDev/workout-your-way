// lib/hooks/sets/types.ts

export interface Set {
  id: string
  name: string
  description?: string
  exercises: string[] // Array of Exercise IDs
  userId: string
  createdAt: Date
}
