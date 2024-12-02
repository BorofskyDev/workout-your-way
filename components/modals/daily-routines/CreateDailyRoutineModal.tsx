// components/modals/daily-routines/CreateDailyRoutineModal.tsx

'use client'

import React, { useState } from 'react'
import Modal from '../Modal'
import { useDailyRoutines } from '@/lib/hooks/daily-routines/useDailyRoutines'
import { useSets } from '@/lib/hooks/sets/useSets'
import CreateSetModal from '@/components/modals/sets/CreateSetModal'
import { Set } from '@/lib/hooks/sets/useSets'
import { DailyRoutine, RoutineType } from '@/lib/hooks/daily-routines/types'
import { Reorder } from 'framer-motion'

interface CreateDailyRoutineModalProps {
  isOpen: boolean
  onClose: () => void
}

const routineTypes: RoutineType[] = [
  'Upper Body',
  'Lower Body',
  'Cardio',
  'Total Body',
  'Other',
]

const CreateDailyRoutineModal: React.FC<CreateDailyRoutineModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [type, setType] = useState<RoutineType>('Other')
  const [selectedSets, setSelectedSets] = useState<Set[]>([])
  const [error, setError] = useState<string | null>(null)
  const { createDailyRoutine } = useDailyRoutines()
  const { sets, loading: setsLoading, error: setsError } = useSets()
  const [isCreateSetModalOpen, setIsCreateSetModalOpen] =
    useState<boolean>(false)

  const handleAddSet = (setId: string) => {
    const setToAdd = sets.find((set) => set.id === setId)
    if (setToAdd && !selectedSets.some((set) => set.id === setId)) {
      setSelectedSets([...selectedSets, setToAdd])
    }
  }

  const handleRemoveSet = (setId: string) => {
    setSelectedSets(selectedSets.filter((set) => set.id !== setId))
  }

  const handleOpenCreateSetModal = () => {
    setIsCreateSetModalOpen(true)
  }

  const handleCloseCreateSetModal = () => {
    setIsCreateSetModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Daily routine name is required.')
      return
    }

    if (selectedSets.length === 0) {
      setError('Please add at least one set to the routine.')
      return
    }

    try {
      const routineData: Omit<DailyRoutine, 'id' | 'createdAt'> = {
        name,
        description,
        type,
        sets: selectedSets.map((set) => set.id),
      }

      await createDailyRoutine(routineData)
      setName('')
      setDescription('')
      setType('Other')
      setSelectedSets([])
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
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className='text-2xl font-semibold mb-4 text-center'>
          Create Daily Routine
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Name */}
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-text'
            >
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

          {/* Type of Routine */}
          <div>
            <label
              htmlFor='type'
              className='block text-sm font-medium text-text'
            >
              Type of Routine
            </label>
            <select
              id='type'
              value={type}
              onChange={(e) => setType(e.target.value as RoutineType)}
              className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
            >
              {routineTypes.map((routineType) => (
                <option key={routineType} value={routineType}>
                  {routineType}
                </option>
              ))}
            </select>
          </div>

          {/* Sets Selection */}
          <div>
            <label className='block text-sm font-medium text-text mb-1'>
              Add Sets
            </label>
            {setsLoading ? (
              <p>Loading sets...</p>
            ) : setsError ? (
              <p className='text-red-500'>Error: {setsError}</p>
            ) : sets.length === 0 ? (
              <div>
                <p>You have no sets. Please create one.</p>
                <button
                  onClick={handleOpenCreateSetModal}
                  type='button'
                  className='mt-2 px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
                >
                  Create Set
                </button>
              </div>
            ) : (
              <div>
                <select
                  onChange={(e) => handleAddSet(e.target.value)}
                  className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
                  defaultValue=''
                >
                  <option value='' disabled>
                    Select a set to add
                  </option>
                  {sets.map((set) => (
                    <option key={set.id} value={set.id}>
                      {set.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleOpenCreateSetModal}
                  type='button'
                  className='mt-2 px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
                >
                  Create New Set
                </button>
              </div>
            )}

            {/* Selected Sets */}
            {selectedSets.length > 0 && (
              <div className='mt-4'>
                <label className='block text-sm font-medium text-text mb-2'>
                  Selected Sets
                </label>
                <Reorder.Group
                  axis='y'
                  values={selectedSets}
                  onReorder={setSelectedSets}
                  className='space-y-2'
                >
                  {selectedSets.map((set) => (
                    <Reorder.Item
                      key={set.id}
                      value={set}
                      className='flex items-center justify-between p-2 bg-white border border-gray-300 rounded-md shadow-sm cursor-grab'
                    >
                      <span>{set.name}</span>
                      <button
                        type='button'
                        onClick={() => handleRemoveSet(set.id)}
                        className='text-red-500 hover:text-red-700 focus:outline-none'
                      >
                        Remove
                      </button>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
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
              Create Daily Routine
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Set Modal */}
      <CreateSetModal
        isOpen={isCreateSetModalOpen}
        onClose={handleCloseCreateSetModal}
      />
    </>
  )
}

export default CreateDailyRoutineModal
