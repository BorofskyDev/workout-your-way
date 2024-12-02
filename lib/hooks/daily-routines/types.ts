// lib/hooks/daily-routines/types.ts

export type RoutineType =
  | 'Upper Body'
  | 'Lower Body'
  | 'Cardio'
  | 'Total Body'
  | 'Other'

export interface DailyRoutine {
  id: string
  name: string
  description?: string
  type: RoutineType
  sets: string[] // Array of set IDs
  createdAt: Date
}
