// lib/hooks/exercises/useExercises.ts

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

export interface Exercise {
  id: string
  name: string
  description?: string
  bodyParts: string[]
  measurements: MeasurementOptions
  weight?: boolean
  createdAt: Date
}

export interface MeasurementOptions {
  reps?: boolean
  amap?: boolean
  timed?: boolean
  laps?: boolean
  [key: string]: boolean | undefined
}

export const useExercises = () => {
  const { user, loading: authLoading } = useAuth()
  const [exercises, setExercises] = useState<Exercise[]>([])
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

    const exercisesRef = collection(db, 'exercises')
    const q = query(exercisesRef, where('userId', '==', user.uid))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const exercisesData: Exercise[] = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            bodyParts: data.bodyParts || [],
            measurements: data.measurements || {},
            weight: data.weight || false,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          }
        })
        setExercises(exercisesData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching exercises:', err)
        setError('An error occurred while fetching exercises.')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user, authLoading])

  const createExercise = async (
    exerciseData: Omit<Exercise, 'id' | 'createdAt'>
  ) => {
    if (!user) {
      setError('User not authenticated.')
      return
    }

    try {
      const exercisesRef = collection(db, 'exercises')
      await addDoc(exercisesRef, {
        ...exerciseData,
        userId: user.uid,
        createdAt: Timestamp.now(),
      })
    } catch (err: unknown) {
      console.error('Error creating exercise:', err)
      setError('An unexpected error occurred while creating the exercise.')
    }
  }

  return {
    exercises,
    loading,
    error,
    createExercise,
  }
}
