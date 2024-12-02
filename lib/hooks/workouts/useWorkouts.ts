// lib/hooks/workouts/useWorkouts.ts

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
import { useAuth } from '@/contexts/UserContext'

export interface Workout {
  id: string
  name: string
  description?: string
  createdAt: Date
}

export const useWorkouts = () => {
  const { user, loading: authLoading } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!user) {
      setError('User not authenticated.')
      setLoading(false)
      return
    }

    const workoutsRef = collection(db, 'workouts')
    const q = query(workoutsRef, where('userId', '==', user.uid))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const workoutsData: Workout[] = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          }
        })
        setWorkouts(workoutsData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching workouts:', err)
        setError('An error occurred while fetching workouts.')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user, authLoading])

  const createWorkout = async (
    workoutData: Omit<Workout, 'id' | 'createdAt'>
  ) => {
    if (!user) {
      setError('User not authenticated.')
      return
    }

    try {
      const workoutsRef = collection(db, 'workouts')
      await addDoc(workoutsRef, {
        ...workoutData,
        userId: user.uid,
        createdAt: Timestamp.now(),
      })
    } catch (err: unknown) {
      console.error('Error creating workout:', err)
      setError('An unexpected error occurred while creating the workout.')
    }
  }

  return {
    workouts,
    loading,
    error,
    createWorkout,
  }
}
