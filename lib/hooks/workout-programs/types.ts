// lib/hooks/workout-programs/types.ts

export interface WorkoutProgram {
  id: string // Firestore document ID
  name: string
  description?: string
  totalWeeks: number
  totalPhases: number
  phases: Phase[]
  createdAt: Date
}

export interface Phase {
  name: string
  weeks: number[] // Array of week numbers
  weeklyTemplate: {
    days: (string | null)[] // Array of 7 daily routine IDs or null
  }
}
