// lib/hooks/active-programs/types.ts

export interface BodyMeasurements {
  biceps: number
  triceps: number
  chest: number
  waist: number
  hips: number
  thighs: number
  calves: number
}

export interface ConsistencyGoals {
  percentageComplete: number
  daysPerWeek: number
}

export interface ActiveProgramGoals {
  currentWeight: number
  currentBodyFat: number
  bodyMeasurements: BodyMeasurements
  achievementGoals: string
  consistencyGoals: ConsistencyGoals
}

export interface ActiveProgram {
  id: string
  userId: string
  programId: string
  startedAt: Date
  goals: ActiveProgramGoals
  photoURL?: string
}
