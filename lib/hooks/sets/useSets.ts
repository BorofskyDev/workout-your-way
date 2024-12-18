// lib/hooks/sets/useSets.ts

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
import { Set as SetType } from './types' // Import from types.ts

export const useSets = () => {
  const { user, loading: authLoading } = useAuth()
  const [sets, setSets] = useState<SetType[]>([])
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

    const setsRef = collection(db, 'sets')
    const q = query(setsRef, where('userId', '==', user.uid))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const setsData: SetType[] = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            exercises: data.exercises || [],
            userId: data.userId,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          }
        })
        setSets(setsData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching sets:', err)
        setError('An error occurred while fetching sets.')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user, authLoading])

  const createSet = async (setData: Omit<SetType, 'id' | 'createdAt'>) => {
    if (!user) {
      setError('User not authenticated.')
      return
    }

    try {
      const setsRef = collection(db, 'sets')
      await addDoc(setsRef, {
        ...setData,
        userId: user.uid,
        createdAt: Timestamp.now(),
      })
    } catch (err: unknown) {
      console.error('Error creating set:', err)
      setError('An unexpected error occurred while creating the set.')
    }
  }

  return {
    sets,
    loading,
    error,
    createSet,
  }
}
