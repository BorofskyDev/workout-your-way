// lib/hooks/workout-programs/types.ts

import { DailyRoutine } from '@/lib/hooks/daily-routines/types'
import { Set } from '@/lib/hooks/sets/types'
import { Exercise } from '@/lib/hooks/exercises/types'

export interface Phase {
  name: string
  weeks: number[]
  weeklyTemplate: WeeklyTemplate
}

export interface WeeklyTemplate {
  days: (DailyRoutine | null)[]
}

export interface WorkoutProgram {
  id: string
  name: string
  description?: string
  totalPhases: number
  totalWeeks: number
  phases: Phase[]
  dailyRoutines: DailyRoutine[]
  sets: Set[]
  exercises: Exercise[]
  createdAt: Date
}
