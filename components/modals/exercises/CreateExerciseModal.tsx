// components/modals/exercises/CreateExerciseModal.tsx

'use client'

import React, { useState } from 'react'
import Modal from '../Modal'
import { useExercises } from '@/lib/hooks/exercises/useExercises'

interface CreateExerciseModalProps {
  isOpen: boolean
  onClose: () => void
}

const bodyPartOptions: string[] = [
  'Arms',
  'Biceps',
  'Triceps',
  'Shoulders',
  'Chest',
  'Back',
  'Core',
  'Abs',
  'Obliques',
  'Glutes',
  'Hamstrings',
  'Quadriceps',
  'Calves',
  'Upper Body',
  'Lower Body',
  'Full Body',
  'Cardio',
  'Other',
]

const measurementOptions = [
  { label: 'Reps', value: 'reps' },
  { label: 'AMAP (As Many As Possible)', value: 'amap' },
  { label: 'Timed', value: 'timed' },
  { label: 'Laps', value: 'laps' },
  // Add any additional measurement options here
]

const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [bodyParts, setBodyParts] = useState<string[]>([])
  const [measurements, setMeasurements] = useState<{ [key: string]: boolean }>(
    {}
  )
  const [includeWeight, setIncludeWeight] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { createExercise } = useExercises()

  const handleBodyPartToggle = (bodyPart: string) => {
    setBodyParts((prevBodyParts) => {
      if (prevBodyParts.includes(bodyPart)) {
        return prevBodyParts.filter((bp) => bp !== bodyPart)
      } else {
        return [...prevBodyParts, bodyPart]
      }
    })
  }

  const handleMeasurementToggle = (measurement: string) => {
    setMeasurements((prevMeasurements) => ({
      ...prevMeasurements,
      [measurement]: !prevMeasurements[measurement],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Exercise name is required.')
      return
    }

    if (bodyParts.length === 0) {
      setError('Please select at least one body part.')
      return
    }

    if (Object.keys(measurements).length === 0) {
      setError('Please select at least one measurement option.')
      return
    }

    try {
      const exerciseData = {
        name,
        description,
        bodyParts,
        measurements,
        weight: includeWeight,
      }

      await createExercise(exerciseData)
      setName('')
      setDescription('')
      setBodyParts([])
      setMeasurements({})
      setIncludeWeight(false)
      onClose()
    } catch (err: unknown) {
      console.error('Error creating exercise:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred.')
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className='text-2xl font-semibold mb-4 text-center'>
        Create Exercise
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Name */}
        <div>
          <label htmlFor='name' className='block text-sm font-medium text-text'>
            Exercise Name
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
            placeholder='Enter exercise name'
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-text'
          >
            Description
          </label>
          <textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
            placeholder='Enter exercise description'
            rows={3}
          />
        </div>

        {/* Body Parts */}
        <div>
          <label className='block text-sm font-medium text-text mb-1'>
            Body Parts
          </label>
          <div className='flex flex-wrap gap-2'>
            {bodyPartOptions.map((bodyPart) => (
              <label key={bodyPart} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  value={bodyPart}
                  checked={bodyParts.includes(bodyPart)}
                  onChange={() => handleBodyPartToggle(bodyPart)}
                />
                <span>{bodyPart}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Measurements */}
        <div>
          <label className='block text-sm font-medium text-text mb-1'>
            Measurements
          </label>
          <div className='flex flex-wrap gap-2'>
            {measurementOptions.map((option) => (
              <label key={option.value} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  value={option.value}
                  checked={measurements[option.value] || false}
                  onChange={() => handleMeasurementToggle(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Include Weight */}
        <div>
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={includeWeight}
              onChange={() => setIncludeWeight(!includeWeight)}
            />
            <span>Include Weight</span>
          </label>
        </div>

        {/* Error Message */}
        {error && <div className='text-red-500 text-sm'>{error}</div>}

        {/* Submit Button */}
        <div className='mt-4'>
          <button
            type='submit'
            className='w-full px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
          >
            Create Exercise
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateExerciseModal
