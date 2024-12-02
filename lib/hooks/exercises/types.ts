// lib/hooks/exercises/types.ts

export interface MeasurementOptions {
  reps?: boolean
  amap?: boolean
  timed?: boolean
  laps?: boolean
  [key: string]: boolean | undefined
}

export interface Exercise {
  id: string
  name: string
  description?: string
  bodyParts: string[]
  measurements: MeasurementOptions
  weight?: boolean
  createdAt: Date
}
