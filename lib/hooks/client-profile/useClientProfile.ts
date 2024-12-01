// lib/hooks/client-profile/useClientProfile.ts

import { useState, useEffect } from 'react'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { User } from 'firebase/auth'
import { calculateAge } from '@/lib/functions/client-profile/calculateAge'

interface ClientProfile {
  fullName: string
  dateOfBirth: string
  gender: string
  email: string
  phone?: string
  address?: string
  height: number
  weight: number
  medicalHistory?: string
  fitnessGoals?: string
  activityLevel: string
  preferredWorkoutTimes?: string
  dietaryPreferences?: string
}

export const useClientProfile = () => {
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async (user: User) => {
    try {
      const profileRef = doc(db, 'clientProfiles', user.uid)
      const profileSnap = await getDoc(profileRef)
      if (profileSnap.exists()) {
        setProfile(profileSnap.data() as ClientProfile)
      } else {
        console.log('No profile found, creating a new one.')
        // Initialize a new profile if not exists
        const newProfile: ClientProfile = {
          fullName: user.displayName || '',
          dateOfBirth: '',
          gender: '',
          email: user.email || '',
          height: 0,
          weight: 0,
          activityLevel: '',
        }
        await setDoc(profileRef, newProfile)
        setProfile(newProfile)
      }
    } catch (err: unknown) {
      console.error('Error fetching profile:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred while fetching the profile.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchProfile(user)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const updateProfile = async (updatedProfile: Partial<ClientProfile>) => {
    if (!auth.currentUser) {
      setError('No authenticated user found.')
      return
    }

    try {
      const profileRef = doc(db, 'clientProfiles', auth.currentUser.uid)
      await updateDoc(profileRef, updatedProfile)
      setProfile((prev) => (prev ? { ...prev, ...updatedProfile } : prev))
    } catch (err: unknown) {
      console.error('Error updating profile:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred while updating the profile.')
      }
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    calculateAge, // Exporting the calculateAge function if needed elsewhere
  }
}
