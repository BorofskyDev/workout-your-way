// components/modals/workout-programs/CreateWorkoutProgramModal.tsx

'use client'

import React, { useState } from 'react'
import Modal from '../Modal'
import { useWorkoutPrograms } from '@/lib/hooks/workout-programs/useWorkoutPrograms'

interface CreateWorkoutProgramModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateWorkoutProgramModal: React.FC<CreateWorkoutProgramModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const { createWorkoutProgram } = useWorkoutPrograms()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await createWorkoutProgram({ name, description })
      setName('')
      setDescription('')
      onClose()
    } catch (err: unknown) {
      console.error('Error creating workout program:', err)
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
        Create Workout Program
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Name */}
        <div>
          <label htmlFor='name' className='block text-sm font-medium text-text'>
            Program Name
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
            placeholder='Enter program name'
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
            placeholder='Enter program description'
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
            className='w-full px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
          >
            {loading ? 'Creating...' : 'Create Program'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateWorkoutProgramModal
