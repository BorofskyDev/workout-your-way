// components/modals/sets/CreateSetModal.tsx

'use client'

import React, { useState } from 'react'
import Modal from '../Modal'
import { useSets } from '@/lib/hooks/sets/useSets'
import { useExercises } from '@/lib/hooks/exercises/useExercises'
import { Set } from '@/lib/hooks/sets/useSets'
import CreateExerciseModal from '../exercises/CreateExerciseModal'

interface CreateSetModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateSetModal: React.FC<CreateSetModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [selectedExercises, setSelectedExercises] = useState<(string | null)[]>(
    [null]
  )
  const [error, setError] = useState<string | null>(null)
  const { createSet } = useSets()
  const {
    exercises,
    loading: exercisesLoading,
    error: exercisesError,
  } = useExercises()
  const [isCreateExerciseModalOpen, setIsCreateExerciseModalOpen] =
    useState<boolean>(false)

  const handleAddExerciseDropdown = () => {
    setSelectedExercises([...selectedExercises, null])
  }

  const handleExerciseChange = (index: number, exerciseId: string) => {
    const updatedExercises = [...selectedExercises]
    updatedExercises[index] = exerciseId
    setSelectedExercises(updatedExercises)
  }

  const handleRemoveExerciseDropdown = (index: number) => {
    const updatedExercises = [...selectedExercises]
    updatedExercises.splice(index, 1)
    setSelectedExercises(updatedExercises)
  }

  const handleOpenCreateExerciseModal = () => {
    setIsCreateExerciseModalOpen(true)
  }

  const handleCloseCreateExerciseModal = () => {
    setIsCreateExerciseModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Set name is required.')
      return
    }

    if (selectedExercises.length === 0 || selectedExercises.some((id) => !id)) {
      setError('Please select all exercises or remove empty selections.')
      return
    }

    try {
      const setData: Omit<Set, 'id' | 'createdAt'> = {
        name,
        description,
        exercises: selectedExercises as string[],
      }

      await createSet(setData)
      setName('')
      setDescription('')
      setSelectedExercises([null])
      onClose()
    } catch (err: unknown) {
      console.error('Error creating set:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred.')
      }
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className='text-2xl font-semibold mb-4 text-center'>Create Set</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Name */}
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-text'
            >
              Set Name
            </label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
              placeholder='Enter set name'
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
              placeholder='Enter set description'
              rows={3}
            />
          </div>

          {/* Exercises Selection */}
          <div>
            <label className='block text-sm font-medium text-text mb-1'>
              Add Exercises
            </label>
            {exercisesLoading ? (
              <p>Loading exercises...</p>
            ) : exercisesError ? (
              <p className='text-red-500'>Error: {exercisesError}</p>
            ) : exercises.length === 0 ? (
              <div>
                <p>You have no exercises. Please create one.</p>
                <button
                  onClick={handleOpenCreateExerciseModal}
                  type='button'
                  className='mt-2 px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
                >
                  Create Exercise
                </button>
              </div>
            ) : (
              <>
                {selectedExercises.map((selectedExerciseId, index) => (
                  <div key={index} className='flex items-center mt-2'>
                    <select
                      value={selectedExerciseId || ''}
                      onChange={(e) =>
                        handleExerciseChange(index, e.target.value)
                      }
                      className='block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
                    >
                      <option value='' disabled>
                        Select an exercise
                      </option>
                      {exercises.map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type='button'
                      onClick={() => handleRemoveExerciseDropdown(index)}
                      className='ml-2 text-red-500 hover:text-red-700 focus:outline-none'
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type='button'
                  onClick={handleAddExerciseDropdown}
                  className='mt-2 px-4 py-2 bg-secondary text-white font-semibold rounded-md shadow-md hover:bg-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
                >
                  Add Another Exercise
                </button>
                <button
                  onClick={handleOpenCreateExerciseModal}
                  type='button'
                  className='mt-2 ml-2 px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
                >
                  Create New Exercise
                </button>
              </>
            )}
          </div>

          {/* Error Message */}
          {error && <div className='text-red-500 text-sm'>{error}</div>}

          {/* Submit Button */}
          <div className='mt-4'>
            <button
              type='submit'
              className='w-full px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
            >
              Create Set
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Exercise Modal */}
      <CreateExerciseModal
        isOpen={isCreateExerciseModalOpen}
        onClose={handleCloseCreateExerciseModal}
      />
    </>
  )
}

export default CreateSetModal
