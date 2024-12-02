// components/workout-programs/WorkoutProgramDetails.tsx

import React from 'react'
import { WorkoutProgram } from '@/lib/hooks/workout-programs/types'
import { useAuth } from '@/contexts/UserContext'
import { useWorkoutPrograms } from '@/lib/hooks/workout-programs/useWorkoutPrograms'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface WorkoutProgramDetailsProps {
  program: WorkoutProgram
  onClose: () => void
}

const WorkoutProgramDetails: React.FC<WorkoutProgramDetailsProps> = ({
  program,
  onClose,
}) => {
  const { user } = useAuth()
  const { deleteWorkoutProgram } = useWorkoutPrograms()
  const [error, setError] = React.useState<string | null>(null)

  const handleStartProgram = async () => {
    if (!user) {
      setError('User not authenticated.')
      return
    }

    try {
      // Check if the user already has an active program
      const activeProgramsRef = collection(db, 'activePrograms')
      const q = query(activeProgramsRef, where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        setError('You already have an active program.')
        return
      }

      // Assign the program to activePrograms
      await addDoc(activeProgramsRef, {
        userId: user.uid,
        programId: program.id,
        startedAt: Timestamp.now(),
      })

      // Optionally, provide feedback or navigate to the active program page
      onClose() // Close the details modal after starting
    } catch (err: unknown) {
      console.error('Error starting program:', err)
      setError('An error occurred while starting the program.')
    }
  }

  const handleEditProgram = () => {
    // Implement edit functionality as needed
    // For example, open an edit modal or navigate to an edit page
    console.log('Edit program:', program.id)
  }

  const handleDeleteProgram = async () => {
    try {
      await deleteWorkoutProgram(program.id)
      onClose()
    } catch (err: unknown) {
      console.error('Error deleting program:', err)
      setError('An error occurred while deleting the program.')
    }
  }

  return (
    <div className='p-6 bg-background-secondary rounded-md shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>{program.name}</h2>
      {program.description && <p className='mb-4'>{program.description}</p>}

      {/* Display program details */}
      <div className='space-y-4'>
        {program.phases.map((phase, index) => (
          <div key={index}>
            <h3 className='text-xl font-semibold'>
              Phase {index + 1}: {phase.name}
            </h3>
            {/* Display weeks and daily routines */}
            <p>Total Weeks: {phase.weeks.length}</p>
            <div className='ml-4'>
              {phase.weeks.map((week, weekIndex) => (
                <div key={weekIndex}>
                  <h4 className='font-semibold'>Week {weekIndex + 1}</h4>
                  {/* Display weekly template details */}
                  {/* Implement as needed */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && <div className='text-red-500 text-sm mt-4'>{error}</div>}

      {/* Action Buttons */}
      <div className='mt-6 flex justify-end space-x-2'>
        <button
          onClick={handleEditProgram}
          className='px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md shadow-md hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500'
        >
          Edit
        </button>
        <button
          onClick={handleDeleteProgram}
          className='px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500'
        >
          Delete
        </button>
        <button
          onClick={handleStartProgram}
          className='px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
        >
          Start Program
        </button>
      </div>
    </div>
  )
}

export default WorkoutProgramDetails
