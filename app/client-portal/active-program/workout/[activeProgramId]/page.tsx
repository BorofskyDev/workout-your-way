// app/client-portal/active-program/workout/[activeProgramId]/page.tsx

'use client'

import React from 'react'
import { useRouter, useParams } from 'next/navigation'

const WorkoutPage: React.FC = () => {
  const router = useRouter()
  const { activeProgramId } = useParams()

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4'>
      <div className='p-6 bg-background-secondary rounded-md shadow-md'>
        <h1 className='text-3xl font-semibold mb-4'>Workout Page</h1>
        <p>Active Program ID: {activeProgramId}</p>
        <p>
          This is where the workout details and tracking would be implemented.
        </p>
      </div>
    </div>
  )
}

export default WorkoutPage
