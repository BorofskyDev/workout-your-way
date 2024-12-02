// components/modals/workout-programs/CreateWorkoutProgramModal.tsx

'use client'

import React, { useState } from 'react'
import Modal from '../Modal'
import { useWorkoutPrograms } from '@/lib/hooks/workout-programs/useWorkoutPrograms'
import PhasesCreationModal from './PhasesCreationModal'

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
  const [totalWeeks, setTotalWeeks] = useState<number>(1)
  const [totalPhases, setTotalPhases] = useState<number>(1)
  const [error, setError] = useState<string | null>(null) // Now we'll use setError
  const [isPhasesModalOpen, setIsPhasesModalOpen] = useState<boolean>(false)

  const { createWorkoutProgram } = useWorkoutPrograms()

  const handleOpenPhasesModal = () => {
    setIsPhasesModalOpen(true)
  }

  const handleClosePhasesModal = () => {
    setIsPhasesModalOpen(false)
    // Optionally, reset the form or handle data here
  }

  const handleProceedToPhases = (e: React.FormEvent) => {
    e.preventDefault()
    // Perform validation
    if (!name.trim()) {
      setError('Program name is required.')
      return
    }
    if (totalWeeks < 1) {
      setError('Total weeks must be at least 1.')
      return
    }
    if (totalPhases < 1) {
      setError('Total phases must be at least 1.')
      return
    }
    if (totalPhases > totalWeeks) {
      setError('Total phases cannot exceed total weeks.')
      return
    }
    // Clear any existing errors
    setError(null)
    handleOpenPhasesModal()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className='text-2xl font-semibold mb-4 text-center'>
          Create Workout Program
        </h2>
        <form onSubmit={handleProceedToPhases} className='space-y-4'>
          {/* Name */}
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-text'
            >
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

          {/* Total Weeks */}
          <div>
            <label
              htmlFor='totalWeeks'
              className='block text-sm font-medium text-text'
            >
              Total Weeks
            </label>
            <input
              type='number'
              id='totalWeeks'
              value={totalWeeks}
              onChange={(e) => setTotalWeeks(Number(e.target.value))}
              min={1}
              required
              className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
              placeholder='Enter total number of weeks'
            />
          </div>

          {/* Total Phases */}
          <div>
            <label
              htmlFor='totalPhases'
              className='block text-sm font-medium text-text'
            >
              Total Phases
            </label>
            <input
              type='number'
              id='totalPhases'
              value={totalPhases}
              onChange={(e) => setTotalPhases(Number(e.target.value))}
              min={1}
              required
              className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
              placeholder='Enter total number of phases'
            />
          </div>

          {/* Error Message */}
          {error && <div className='text-red-500 text-sm'>{error}</div>}

          {/* Proceed Button */}
          <div className='mt-4'>
            <button
              type='submit'
              className='w-full px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
            >
              Move onto Phases
            </button>
          </div>
        </form>
      </Modal>

      {/* Phases Creation Modal */}
      <PhasesCreationModal
        isOpen={isPhasesModalOpen}
        onClose={handleClosePhasesModal}
        programData={{
          name,
          description,
          totalWeeks,
          totalPhases,
          dailyRoutines: [], // Initialize as empty arrays
          sets: [],
          exercises: [],
          userId: ''
        }}
        createWorkoutProgram={createWorkoutProgram}
        closeParentModal={onClose}
      />
    </>
  )
}

export default CreateWorkoutProgramModal
