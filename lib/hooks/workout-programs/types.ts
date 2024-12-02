// lib/hooks/workout-programs/types.ts


export interface WeeklyTemplate {
  days: string[] // Array of DailyRoutine IDs
}

export interface Phase {
  name: string
  weeks: number[]
  weeklyTemplate: WeeklyTemplate
}

export interface WorkoutProgram {
  id: string
  name: string
  description?: string
  totalPhases: number
  totalWeeks: number
  phases: Phase[]
  dailyRoutines: string[] // Array of DailyRoutine IDs
  sets: string[] // Array of Set IDs
  exercises: string[] // Array of Exercise IDs
  createdAt: Date
  userId: string
}
