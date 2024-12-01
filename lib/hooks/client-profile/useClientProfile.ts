// lib/hooks/client-profile/useClientProfile.ts

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  DocumentReference,
} from 'firebase/firestore'
import { useAuth } from '@/contexts/UserContext' // Import useAuth

export interface ClientProfile {
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

  const { user, loading: authLoading } = useAuth() // Get user and auth loading state

  useEffect(() => {
    if (authLoading) {
      return // Wait until the auth state is initialized
    }

    if (!user) {
      setError('User not authenticated.')
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const profileRef: DocumentReference<ClientProfile> = doc(
          db,
          'clientProfiles',
          user.uid
        ) as DocumentReference<ClientProfile>

        const profileSnap = await getDoc(profileRef)
        if (profileSnap.exists()) {
          setProfile(profileSnap.data())
        } else {
          console.log('No profile found, creating a new one.')
          const newProfile: ClientProfile = {
            fullName: user.displayName || '',
            dateOfBirth: '',
            gender: '',
            email: user.email || '',
            height: 0,
            weight: 0,
            activityLevel: '',
            phone: '',
            address: '',
            medicalHistory: '',
            fitnessGoals: '',
            preferredWorkoutTimes: '',
            dietaryPreferences: '',
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

    fetchProfile()
  }, [user, authLoading])

  const updateProfile = async (updatedProfile: Partial<ClientProfile>) => {
    if (!user) {
      setError('No authenticated user found.')
      return
    }

    try {
      const profileRef: DocumentReference<ClientProfile> = doc(
        db,
        'clientProfiles',
        user.uid
      ) as DocumentReference<ClientProfile>

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
  }
}
