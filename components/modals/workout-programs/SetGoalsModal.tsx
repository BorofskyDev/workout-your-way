// components/modals/workout-programs/SetGoalsModal.tsx

'use client'

import React, { useState } from 'react'
import Modal from '../Modal'
import { ActiveProgramGoals } from '@/lib/hooks/active-programs/types'
import { doc, updateDoc } from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'
import { useAuth } from '@/contexts/UserContext'
import { WorkoutProgram } from '@/lib/hooks/workout-programs/types'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

interface SetGoalsModalProps {
  isOpen: boolean
  onClose: () => void
  program: WorkoutProgram
  activeProgramId: string
}

const SetGoalsModal: React.FC<SetGoalsModalProps> = ({
  isOpen,
  onClose,
  activeProgramId,
}) => {
  const { user } = useAuth()
  const [goals, setGoals] = useState<ActiveProgramGoals>({
    currentWeight: 0, // pounds
    currentBodyFat: 0, // percentage
    bodyMeasurements: {
      biceps: 0, // inches
      triceps: 0, // inches
      chest: 0, // inches
      waist: 0, // inches
      hips: 0, // inches
      thighs: 0, // inches
      calves: 0, // inches
    },
    achievementGoals: '',
    consistencyGoals: {
      percentageComplete: 0,
      daysPerWeek: 0,
    },
  })

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    if (name in goals) {
      setGoals((prev) => ({
        ...prev,
        [name]: name === 'achievementGoals' ? value : Number(value),
      }))
    } else if (name in goals.bodyMeasurements) {
      setGoals((prev) => ({
        ...prev,
        bodyMeasurements: {
          ...prev.bodyMeasurements,
          [name]: Number(value),
        },
      }))
    } else if (name in goals.consistencyGoals) {
      setGoals((prev) => ({
        ...prev,
        consistencyGoals: {
          ...prev.consistencyGoals,
          [name]: Number(value),
        },
      }))
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic Validation
    if (
      goals.currentWeight <= 0 ||
      goals.currentBodyFat <= 0 ||
      goals.consistencyGoals.percentageComplete <= 0 ||
      goals.consistencyGoals.daysPerWeek <= 0 ||
      goals.consistencyGoals.percentageComplete > 100 ||
      goals.consistencyGoals.daysPerWeek > 7
    ) {
      setError('Please fill in all required fields with valid values.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      if (!user) {
        setError('User not authenticated.')
        setLoading(false)
        return
      }

      let photoURL: string | null = null

      if (photoFile) {
        const storageRef = ref(
          storage,
          `program_photos/${user.uid}/${activeProgramId}/${photoFile.name}`
        )
        await uploadBytes(storageRef, photoFile)
        photoURL = await getDownloadURL(storageRef)
      }

      // Update the activeProgram document with goals and photoURL
      const activeProgramDocRef = doc(db, 'activePrograms', activeProgramId)
      await updateDoc(activeProgramDocRef, {
        goals: goals,
        photoURL: photoURL || '',
      })

      setLoading(false)
      onClose()
      // Optionally, provide feedback to the user
    } catch (err: unknown) {
      console.error('Error setting goals and starting program:', err)
      setError('An error occurred while setting your goals.')
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className='text-2xl font-semibold mb-4 text-center'>
        Set Your Goals
      </h2>
      <form
        onSubmit={handleSubmit}
        className='space-y-4 max-h-[80vh] overflow-y-auto'
      >
        {/* Current Weight */}
        <div>
          <label
            htmlFor='currentWeight'
            className='block text-sm font-medium text-text'
          >
            Current Weight (lb)
          </label>
          <input
            type='number'
            id='currentWeight'
            name='currentWeight'
            value={goals.currentWeight}
            onChange={handleChange}
            required
            min={1}
            className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
            placeholder='e.g., 154'
          />
        </div>

        {/* Current Body Fat Percentage */}
        <div>
          <label
            htmlFor='currentBodyFat'
            className='block text-sm font-medium text-text'
          >
            Current Body Fat Percentage (%)
          </label>
          <input
            type='number'
            id='currentBodyFat'
            name='currentBodyFat'
            value={goals.currentBodyFat}
            onChange={handleChange}
            required
            min={1}
            max={100}
            className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
            placeholder='e.g., 15'
          />
        </div>

        {/* Body Part Measurements */}
        <div>
          <h3 className='text-lg font-semibold mb-2'>
            Body Part Measurements (in)
          </h3>
          <div className='grid grid-cols-2 gap-4'>
            {Object.keys(goals.bodyMeasurements).map((part) => (
              <div key={part}>
                <label
                  htmlFor={part}
                  className='block text-sm font-medium text-text capitalize'
                >
                  {part}
                </label>
                <input
                  type='number'
                  id={part}
                  name={part}
                  value={
                    goals.bodyMeasurements[
                      part as keyof typeof goals.bodyMeasurements
                    ]
                  }
                  onChange={handleChange}
                  required
                  min={1}
                  className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
                  placeholder='e.g., 14'
                />
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Goals */}
        <div>
          <label
            htmlFor='achievementGoals'
            className='block text-sm font-medium text-text'
          >
            Goals to Achieve in This Program
          </label>
          <textarea
            id='achievementGoals'
            name='achievementGoals'
            value={goals.achievementGoals}
            onChange={handleChange}
            required
            className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
            placeholder='e.g., Increase bicep size by 1 inch'
            rows={3}
          />
        </div>

        {/* Consistency Goals */}
        <div>
          <h3 className='text-lg font-semibold mb-2'>Consistency Goals</h3>

          {/* Percentage Completion */}
          <div>
            <label
              htmlFor='percentageComplete'
              className='block text-sm font-medium text-text'
            >
              Percentage to Complete (%)
            </label>
            <input
              type='number'
              id='percentageComplete'
              name='percentageComplete'
              value={goals.consistencyGoals.percentageComplete}
              onChange={handleChange}
              required
              min={1}
              max={100}
              className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
              placeholder='e.g., 80'
            />
            <p className='text-xs text-gray-500 mt-1'>
              While 100% is ideal, it&apos;s not always realistic. Pick a realistic
              completion percentage based on your lifestyle.
            </p>
          </div>

          {/* Days Per Week */}
          <div>
            <label
              htmlFor='daysPerWeek'
              className='block text-sm font-medium text-text'
            >
              Days per Week to Average
            </label>
            <input
              type='number'
              id='daysPerWeek'
              name='daysPerWeek'
              value={goals.consistencyGoals.daysPerWeek}
              onChange={handleChange}
              required
              min={1}
              max={7}
              className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
              placeholder='e.g., 4'
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label
            htmlFor='photo'
            className='block text-sm font-medium text-text'
          >
            Upload a Photo for the Start of the Program (optional)
          </label>
          <input
            type='file'
            id='photo'
            name='photo'
            accept='image/*'
            onChange={handlePhotoChange}
            className='mt-1 block w-full'
          />
        </div>

        {/* Error Message */}
        {error && <div className='text-red-500 text-sm'>{error}</div>}

        {/* Submit Button */}
        <div className='mt-4'>
          <button
            type='submit'
            disabled={loading}
            className='w-full px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
          >
            {loading ? 'Starting Program...' : 'Start Program'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default SetGoalsModal
