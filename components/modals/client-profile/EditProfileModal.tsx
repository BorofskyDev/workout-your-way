// components/modals/client-profile/EditProfileModal.tsx

'use client'

import React, { useState, useEffect } from 'react'
import Modal from '../Modal'
import { calculateAge } from '@/lib/functions/client-profile/calculateAge'
import { useClientProfile } from '@/lib/hooks/client-profile/useClientProfile'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Form state
  const [fullName, setFullName] = useState<string>('')
  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const [age, setAge] = useState<number | null>(null)
  const [gender, setGender] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [height, setHeight] = useState<number | ''>('')
  const [weight, setWeight] = useState<number | ''>('')
  const [medicalHistory, setMedicalHistory] = useState<string>('')
  const [fitnessGoals, setFitnessGoals] = useState<string>('')
  const [activityLevel, setActivityLevel] = useState<string>('')
  const [preferredWorkoutTimes, setPreferredWorkoutTimes] = useState<string>('')
  const [dietaryPreferences, setDietaryPreferences] = useState<string>('')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Utilize the custom hook to access profile data and update function
  const { profile, updateProfile } = useClientProfile()

  // Initialize form fields with profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName)
      setDateOfBirth(profile.dateOfBirth)
      setGender(profile.gender)
      setEmail(profile.email)
      setPhone(profile.phone || '')
      setAddress(profile.address || '')
      setHeight(profile.height || '')
      setWeight(profile.weight || '')
      setMedicalHistory(profile.medicalHistory || '')
      setFitnessGoals(profile.fitnessGoals || '')
      setActivityLevel(profile.activityLevel)
      setPreferredWorkoutTimes(profile.preferredWorkoutTimes || '')
      setDietaryPreferences(profile.dietaryPreferences || '')
    }
  }, [profile])

  // Calculate age whenever dateOfBirth changes
  useEffect(() => {
    if (dateOfBirth) {
      const calculatedAge = calculateAge(new Date(dateOfBirth))
      setAge(calculatedAge)
    } else {
      setAge(null)
    }
  }, [dateOfBirth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Prepare the updated profile data
    const updatedProfile = {
      fullName,
      dateOfBirth,
      gender,
      email,
      phone,
      address,
      height: typeof height === 'number' ? height : 0,
      weight: typeof weight === 'number' ? weight : 0,
      medicalHistory,
      fitnessGoals,
      activityLevel,
      preferredWorkoutTimes,
      dietaryPreferences,
    }

    try {
      // Update the profile using the custom hook's function
      await updateProfile(updatedProfile)

      console.log('Profile updated successfully:', updatedProfile)

      // Close the modal upon successful update
      onClose()
    } catch (err: unknown) {
      console.error('Error updating profile:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className='text-2xl font-semibold mb-4 text-center'>
        Edit Your Profile
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Full Name */}
        <div>
          <label
            htmlFor='fullName'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Full Name
          </label>
          <input
            type='text'
            id='fullName'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className='mt-1 block w-full px-3 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark'
            placeholder='John Doe'
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label
            htmlFor='dateOfBirth'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Date of Birth
          </label>
          <input
            type='date'
            id='dateOfBirth'
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
            className='mt-1 block w-full px-3 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark'
          />
        </div>

        {/* Age (Read-Only) */}
        <div>
          <label
            htmlFor='age'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Age
          </label>
          <input
            type='number'
            id='age'
            value={age !== null ? age : ''}
            readOnly
            className='mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-not-allowed'
            placeholder='Age'
          />
        </div>

        {/* Gender */}
        <div>
          <label
            htmlFor='gender'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Gender
          </label>
          <select
            id='gender'
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className='mt-1 block w-full px-3 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark'
          >
            <option value=''>Select Gender</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='non-binary'>Non-binary</option>
            <option value='prefer-not-to-say'>Prefer not to say</option>
          </select>
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Email Address
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='mt-1 block w-full px-3 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark'
            placeholder='you@example.com'
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor='phone'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Phone Number
          </label>
          <input
            type='tel'
            id='phone'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className='mt-1 block w-full px-3 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark'
            placeholder='(123) 456-7890'
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor='address'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Address
          </label>
          <input
            type='text'
            id='address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='mt-1 block w-full px-3 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark'
            placeholder='123 Main St, City, State, ZIP'
          />
        </div>

        {/* Height */}
        <div>
          <label
            htmlFor='height'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Height
          </label>
          <input
            type='number'
            id='height'
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            required
            className='mt-1 block w-full px-3 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark'
            placeholder='Height in cm or inches'
          />
        </div>

        {/* Weight */}
        <div>
          <label
            htmlFor='weight'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Weight
          </label>
          <input
            type='number'
            id='weight'
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            required
            className='mt-1 block w-full px-3 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark'
            placeholder='Weight in kg or pounds'
          />
        </div>

        {/* Medical History */}
        <div>
          <label
            htmlFor='medicalHistory'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Medical History
          </label>
          <textarea
            id='medicalHistory'
            value={medicalHistory}
            onChange={(e) => setMedicalHistory(e.target.value)}
            className='mt-1 block w-full px-3 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark'
            placeholder='List any allergies or existing medical conditions...'
            rows={3}
          />
        </div>

        {/* Fitness Goals */}
        <div>
          <label
            htmlFor='fitnessGoals'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Fitness Goals
          </label>
          <textarea
            id='fitnessGoals'
            value={fitnessGoals}
            onChange={(e) => setFitnessGoals(e.target.value)}
            className='mt-1 block w-full px-3 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark'
            placeholder='Describe your fitness goals...'
            rows={3}
          />
        </div>

        {/* Activity Level */}
        <div>
          <label
            htmlFor='activityLevel'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Activity Level
          </label>
          <select
            id='activityLevel'
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            required
            className='mt-1 block w-full px-3 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark'
          >
            <option value=''>Select Activity Level</option>
            <option value='sedentary'>Sedentary (little or no exercise)</option>
            <option value='light'>
              Lightly Active (light exercise/sports 1-3 days/week)
            </option>
            <option value='moderate'>
              Moderately Active (moderate exercise/sports 3-5 days/week)
            </option>
            <option value='very-active'>
              Very Active (hard exercise/sports 6-7 days a week)
            </option>
            <option value='extra-active'>
              Extra Active (very hard exercise/sports & physical job)
            </option>
          </select>
        </div>

        {/* Preferred Workout Times */}
        <div>
          <label
            htmlFor='preferredWorkoutTimes'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Preferred Workout Times
          </label>
          <input
            type='text'
            id='preferredWorkoutTimes'
            value={preferredWorkoutTimes}
            onChange={(e) => setPreferredWorkoutTimes(e.target.value)}
            className='mt-1 block w-full px-3 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark'
            placeholder='e.g., Morning, Evening'
          />
        </div>

        {/* Dietary Preferences */}
        <div>
          <label
            htmlFor='dietaryPreferences'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Dietary Preferences or Restrictions
          </label>
          <textarea
            id='dietaryPreferences'
            value={dietaryPreferences}
            onChange={(e) => setDietaryPreferences(e.target.value)}
            className='mt-1 block w-full px-3 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark'
            placeholder='e.g., Vegetarian, Gluten-Free, No Dairy...'
            rows={3}
          />
        </div>

        {/* Error Message */}
        {error && <div className='text-red-500 text-sm'>{error}</div>}

        {/* Submit Button */}
        <div className='mt-4'>
          <button
            type='submit'
            disabled={loading}
            className='w-full px-4 py-2 bg-primary dark:bg-primary-dark text-white font-semibold rounded-md shadow-md hover:bg-secondary dark:hover:bg-secondary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark'
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default EditProfileModal
