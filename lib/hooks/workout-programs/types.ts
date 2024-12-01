// lib/types.ts 

export interface WorkoutProgram {
  id: string // Firestore document ID
  name: string
  description?: string
  createdAt: Date
  // Add other fields as needed
}