// components/workout-programs/WorkoutProgramList.tsx

import React from 'react'
import { WorkoutProgram } from '@/lib/hooks/workout-programs/types'

interface WorkoutProgramListProps {
  programs: WorkoutProgram[]
  onSelectProgram: (program: WorkoutProgram) => void
}

const WorkoutProgramList: React.FC<WorkoutProgramListProps> = ({
  programs,
  onSelectProgram,
}) => {
  return (
    <div className='space-y-4'>
      {programs.map((program) => (
        <div
          key={program.id}
          className='p-4 bg-secondary capitalize rounded-md shadow-md cursor-pointer hover:bg-secondary-dark'
          onClick={() => onSelectProgram(program)}
        >
          <h3 className='text-xl font-semibold'>{program.name}</h3>
          {program.description && (
            <p className='text-sm mt-1'>{program.description}</p>
          )}
          {/* Add more details or actions as needed */}
        </div>
      ))}
    </div>
  )
}

export default WorkoutProgramList
