// components/modals/workout-programs/PhasesCreationModal.tsx

'use client'

import React, { useState, useEffect } from 'react'
import Modal from '../Modal'
import { Phase, WorkoutProgram } from '@/lib/hooks/workout-programs/types'
import { useDailyRoutines } from '@/lib/hooks/daily-routines/useDailyRoutines'
import { useSets } from '@/lib/hooks/sets/useSets'
import { useExercises } from '@/lib/hooks/exercises/useExercises'
import PhaseBox from './PhaseBox'

interface PhasesCreationModalProps {
  isOpen: boolean
  onClose: () => void
  programData: Omit<WorkoutProgram, 'id' | 'createdAt' | 'phases'>
  createWorkoutProgram: (
    programData: Omit<WorkoutProgram, 'id' | 'createdAt'>
  ) => Promise<void>
  closeParentModal: () => void
}

const PhasesCreationModal: React.FC<PhasesCreationModalProps> = ({
  isOpen,
  onClose,
  programData,
  createWorkoutProgram,
  closeParentModal,
}) => {
  const [phasesData, setPhasesData] = useState<Phase[]>([])
  const [error, setError] = useState<string | null>(null)
  const { dailyRoutines } = useDailyRoutines()
  const { sets } = useSets()
  const { exercises } = useExercises()
  const { name, totalPhases } = programData

  // Initialize phasesData if not already initialized
  useEffect(() => {
    if (phasesData.length !== totalPhases) {
      const initialPhases: Phase[] = Array.from(
        { length: totalPhases },
        () => ({
          name: '',
          weeks: [],
          weeklyTemplate: { days: Array(7).fill(null) },
        })
      )
      setPhasesData(initialPhases)
    }
  }, [totalPhases, phasesData.length])

  const handlePhaseDataChange = (index: number, updatedPhase: Phase) => {
    setPhasesData((prevPhases) => {
      const newPhases = [...prevPhases]
      newPhases[index] = updatedPhase
      return newPhases
    })
  }

  const handleSaveProgram = async () => {
    // Perform validation
    for (let i = 0; i < phasesData.length; i++) {
      const phase = phasesData[i]
      if (!phase.name.trim()) {
        setError(`Phase ${i + 1} is missing a name.`)
        return
      }
      if (phase.weeks.length === 0) {
        setError(`Phase ${i + 1} has no weeks selected.`)
        return
      }
      // Additional validation as needed
    }

    // Gather IDs of used daily routines
    const usedDailyRoutineIds = new Set<string>()
    phasesData.forEach((phase) => {
      phase.weeklyTemplate.days.forEach((dailyRoutine) => {
        if (dailyRoutine && dailyRoutine.id) {
          usedDailyRoutineIds.add(dailyRoutine.id)
        }
      })
    })

    // Filter daily routines based on used IDs
    const usedDailyRoutines = dailyRoutines.filter((dr) =>
      usedDailyRoutineIds.has(dr.id)
    )

    // Similarly, gather sets and exercises used in these daily routines
    const usedSetIds = new Set<string>()
    usedDailyRoutines.forEach((dr) => {
      dr.sets.forEach((setId: string) => {
        // Explicitly type 'setId'
        usedSetIds.add(setId)
      })
    })

    const usedSets = sets.filter((set) => usedSetIds.has(set.id))

    const usedExerciseIds = new Set<string>()
    usedSets.forEach((set) => {
      set.exercises.forEach((exerciseId: string) => {
        // Explicitly type 'exerciseId'
        usedExerciseIds.add(exerciseId)
      })
    })

    const usedExercises = exercises.filter((ex) => usedExerciseIds.has(ex.id))

    // Combine programData with phasesData and used data
    const completeProgramData: Omit<WorkoutProgram, 'id' | 'createdAt'> = {
      ...programData,
      phases: phasesData,
      dailyRoutines: usedDailyRoutines,
      sets: usedSets,
      exercises: usedExercises,
    }

    try {
      await createWorkoutProgram(completeProgramData)
      // Close both modals
      onClose()
      closeParentModal()
    } catch (error) {
      console.error('Error creating workout program with phases:', error)
      setError('An error occurred while saving the program.')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className='text-2xl font-semibold mb-4 text-center'>
        Create Phases for {name}
      </h2>

      {error && <div className='text-red-500 text-sm mb-4'>{error}</div>}

      <div className='space-y-6 max-h-[60vh] overflow-y-auto'>
        {Array.from({ length: totalPhases }).map((_, index) => (
          <PhaseBox
            key={index}
            phaseNumber={index + 1}
            totalWeeks={programData.totalWeeks}
            onPhaseDataChange={(updatedPhase) =>
              handlePhaseDataChange(index, updatedPhase)
            }
          />
        ))}
      </div>

      <div className='mt-6 flex justify-end'>
        <button
          onClick={handleSaveProgram}
          className='px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
        >
          Save Program
        </button>
      </div>
    </Modal>
  )
}

export default PhasesCreationModal
