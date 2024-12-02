'use client'

import React, { useState } from 'react'
import Modal from '../Modal'
import { useDailyRoutines } from '@/lib/hooks/daily-routines/useDailyRoutines'

interface CreateDailyRoutineModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateDailyRoutineModal: React.FC<CreateDailyRoutineModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const { createDailyRoutine } = useDailyRoutines()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Daily routine name is required.')
      return
    }

    try {
      await createDailyRoutine({ name, description })
      setName('')
      setDescription('')
      onClose()
    } catch (err: unknown) {
      console.error('Error creating daily routine:', err)
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
        Create Daily Routine
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Name */}
        <div>
          <label htmlFor='name' className='block text-sm font-medium text-text'>
            Daily Routine Name
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
            placeholder='Enter daily routine name'
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
            placeholder='Enter daily routine description'
            rows={3}
          />
        </div>

        {/* Error Message */}
        {error && <div className='text-red-500 text-sm'>{error}</div>}

        {/* Submit Button */}
        <div className='mt-4'>
          <button
            type='submit'
            className='w-full px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
          >
            Create Daily Routine
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateDailyRoutineModal
