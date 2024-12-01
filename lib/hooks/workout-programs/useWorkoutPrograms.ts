// lib/hooks/workout-programs/useWorkoutPrograms.ts

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
} from 'firebase/firestore'
import { WorkoutProgram } from './types'
import { useAuth } from '@/contexts/UserContext' // Import useAuth

export const useWorkoutPrograms = () => {
  const { user, loading: authLoading } = useAuth()
  const [programs, setPrograms] = useState<WorkoutProgram[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) {
      return // Wait until the auth state is initialized
    }

    if (!user) {
      setError('User not authenticated.')
      setLoading(false)
      return
    }

    const programsRef = collection(db, 'workoutPrograms')
    const q = query(programsRef, where('userId', '==', user.uid))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const programsData: WorkoutProgram[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          createdAt: doc.data().createdAt.toDate(),
        }))
        setPrograms(programsData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching workout programs:', err)
        setError('An error occurred while fetching workout programs.')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user, authLoading])

  const createWorkoutProgram = async (
    programData: Omit<WorkoutProgram, 'id' | 'createdAt'>
  ) => {
    if (!user) {
      setError('User not authenticated.')
      return
    }

    try {
      const programsRef = collection(db, 'workoutPrograms')
      await addDoc(programsRef, {
        ...programData,
        userId: user.uid,
        createdAt: Timestamp.now(),
      })
    } catch (err: unknown) {
      console.error('Error creating workout program:', err)
      setError(
        'An unexpected error occurred while creating the workout program.'
      )
    }
  }

  return {
    programs,
    loading,
    error,
    createWorkoutProgram,
  }
}
