// lib/hooks/daily-routines/types.ts

export interface DailyRoutine {
  id: string
  name: string
  description?: string
  type: RoutineType
  sets: string[] // Array of set IDs
  createdAt: Date
}

export type RoutineType =
  | 'Upper Body'
  | 'Lower Body'
  | 'Cardio'
  | 'Total Body'
  | 'Other'
