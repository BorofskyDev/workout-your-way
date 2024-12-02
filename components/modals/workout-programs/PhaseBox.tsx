// components/modals/workout-programs/PhaseBox.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { Phase } from '@/lib/hooks/workout-programs/types'
import { useDailyRoutines } from '@/lib/hooks/daily-routines/useDailyRoutines'
import CreateDailyRoutineModal from '@/components/modals/daily-routines/CreateDailyRoutineModal'
import { DailyRoutine } from '@/lib/hooks/daily-routines/types'

interface PhaseBoxProps {
  phaseNumber: number
  totalWeeks: number
  onPhaseDataChange: (phaseData: Phase) => void
}

const PhaseBox: React.FC<PhaseBoxProps> = ({
  phaseNumber,
  totalWeeks,
  onPhaseDataChange,
}) => {
  const [name, setName] = useState<string>('')
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([])
  const [weeklyTemplate, setWeeklyTemplate] = useState<(DailyRoutine | null)[]>(
    Array(7).fill(null)
  )

  const { dailyRoutines, loading, error } = useDailyRoutines()
  const [isCreateDailyRoutineModalOpen, setIsCreateDailyRoutineModalOpen] =
    useState(false)

  // Inform the parent component whenever data changes
  useEffect(() => {
    const phaseData: Phase = {
      name,
      weeks: selectedWeeks,
      weeklyTemplate: { days: weeklyTemplate },
    }
    onPhaseDataChange(phaseData)
  }, [name, selectedWeeks, weeklyTemplate, onPhaseDataChange])

  // Generate week options
  const weekOptions = Array.from({ length: totalWeeks }, (_, i) => i + 1)

  const handleWeekToggle = (week: number) => {
    setSelectedWeeks((prevWeeks) => {
      if (prevWeeks.includes(week)) {
        return prevWeeks.filter((w) => w !== week)
      } else {
        return [...prevWeeks, week]
      }
    })
  }

  const handleDailyRoutineChange = (
    dayIndex: number,
    routine: DailyRoutine | null
  ) => {
    setWeeklyTemplate((prevTemplate) => {
      const newTemplate = [...prevTemplate]
      newTemplate[dayIndex] = routine
      return newTemplate
    })
  }

  const handleOpenCreateDailyRoutineModal = () => {
    setIsCreateDailyRoutineModalOpen(true)
  }

  const handleCloseCreateDailyRoutineModal = () => {
    setIsCreateDailyRoutineModalOpen(false)
  }

  return (
    <div className='border border-gray-300 rounded-md p-4'>
      <h3 className='text-xl font-semibold mb-4'>Phase {phaseNumber}</h3>

      {/* Phase Name */}
      <div className='mb-4'>
        <label
          htmlFor={`phase-name-${phaseNumber}`}
          className='block text-sm font-medium text-text'
        >
          Phase Name
        </label>
        <input
          type='text'
          id={`phase-name-${phaseNumber}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
          placeholder={`Enter name for Phase ${phaseNumber}`}
        />
      </div>

      {/* Weeks Selection */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-text mb-1'>
          Weeks Covered
        </label>
        <div className='flex flex-wrap gap-2'>
          {weekOptions.map((week) => (
            <label key={week} className='flex items-center space-x-2'>
              <input
                type='checkbox'
                value={week}
                checked={selectedWeeks.includes(week)}
                onChange={() => handleWeekToggle(week)}
              />
              <span>Week {week}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Weekly Template */}
      <div>
        <label className='block text-sm font-medium text-text mb-2'>
          Weekly Template
        </label>
        {loading ? (
          <p>Loading daily routines...</p>
        ) : error ? (
          <p className='text-red-500'>Error: {error}</p>
        ) : (
          <>
            {dailyRoutines.length === 0 ? (
              <div className='mb-4'>
                <p>You have no daily routines. Please create one.</p>
                <button
                  onClick={handleOpenCreateDailyRoutineModal}
                  className='mt-2 px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
                >
                  Create Daily Routine
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleOpenCreateDailyRoutineModal}
                  className='mt-2 px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
                >
                  Create Daily Routine
                </button>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
                  {[
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                  ].map((day, index) => (
                    <div key={index}>
                      <label className='block text-sm font-medium text-text mb-1'>
                        {day}
                      </label>
                      <select
                        value={weeklyTemplate[index]?.id || ''}
                        onChange={(e) => {
                          const routineId = e.target.value || null
                          const routine =
                            dailyRoutines.find((r) => r.id === routineId) ||
                            null
                          handleDailyRoutineChange(index, routine)
                        }}
                        className='mt-1 block w-full px-3 py-2 bg-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary'
                      >
                        <option value=''>Select a daily routine</option>
                        {dailyRoutines.map((routine) => (
                          <option key={routine.id} value={routine.id}>
                            {routine.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Daily Routine Modal */}
      <CreateDailyRoutineModal
        isOpen={isCreateDailyRoutineModalOpen}
        onClose={handleCloseCreateDailyRoutineModal}
      />
    </div>
  )
}

export default PhaseBox
