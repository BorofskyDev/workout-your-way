// lib/hooks/daily-routines/useDailyRoutines.ts

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
import { DailyRoutine } from './types' // Import from types.ts

export const useDailyRoutines = () => {
  const { user, loading: authLoading } = useAuth()
  const [dailyRoutines, setDailyRoutines] = useState<DailyRoutine[]>([])
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

    const routinesRef = collection(db, 'dailyRoutines')
    const q = query(routinesRef, where('userId', '==', user.uid))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const routinesData: DailyRoutine[] = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            type: data.type,
            sets: data.sets || [],
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          }
        })
        setDailyRoutines(routinesData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching daily routines:', err)
        setError('An error occurred while fetching daily routines.')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user, authLoading])

  const createDailyRoutine = async (
    routineData: Omit<DailyRoutine, 'id' | 'createdAt'>
  ) => {
    if (!user) {
      setError('User not authenticated.')
      return
    }

    try {
      const routinesRef = collection(db, 'dailyRoutines')
      await addDoc(routinesRef, {
        ...routineData,
        userId: user.uid,
        createdAt: Timestamp.now(),
      })
    } catch (err: unknown) {
      console.error('Error creating daily routine:', err)
      setError('An unexpected error occurred while creating the daily routine.')
    }
  }

  return {
    dailyRoutines,
    loading,
    error,
    createDailyRoutine,
  }
}
