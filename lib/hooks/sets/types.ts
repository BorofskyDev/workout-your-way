export interface Set {
  id: string
  name: string
  description?: string
  exercises: string[] // Array of workout IDs
  createdAt: Date
}
