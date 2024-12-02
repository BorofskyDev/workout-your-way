// app/client-portal/page.tsx

'use client'

import React, { useState } from 'react'
import EditProfileModal from '@/components/modals/client-profile/EditProfileModal'
import UserProfileBox from '@/components/user-profile/UserProfileBox'
import { useClientProfile } from '@/lib/hooks/client-profile/useClientProfile'
import { useWorkoutPrograms } from '@/lib/hooks/workout-programs/useWorkoutPrograms'
import WorkoutProgramList from '@/components/workout-programs/WorkoutProgramList'
import CreateWorkoutProgramModal from '@/components/modals/workout-programs/CreateWorkoutProgramModal'
import WorkoutProgramDetails from '@/components/workout-programs/WorkoutProgramDetails'
import { WorkoutProgram } from '@/lib/hooks/workout-programs/types'
import { useAuth } from '@/contexts/UserContext'

const ClientPortalPage: React.FC = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false)
  const [isCreateProgramOpen, setIsCreateProgramOpen] = useState<boolean>(false)
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(
    null
  )

  const handleOpenEditProfile = () => {
    setIsEditProfileOpen(true)
  }

  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false)
  }

  const handleOpenCreateProgram = () => {
    setIsCreateProgramOpen(true)
  }

  const handleCloseCreateProgram = () => {
    setIsCreateProgramOpen(false)
  }

  const { user, loading: authLoading } = useAuth()

  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useClientProfile()

  const {
    programs,
    loading: programsLoading,
    error: programsError,
  } = useWorkoutPrograms()

  const handleSelectProgram = (program: WorkoutProgram) => {
    setSelectedProgram(program)
  }

  const handleCloseDetails = () => {
    setSelectedProgram(null)
  }

  if (authLoading || profileLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-4'>
        <p>Loading your profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-4'>
        <p>You must be logged in to access this page.</p>
      </div>
    )
  }

  if (profileError) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-4'>
        <p className='text-red-500'>Error: {profileError}</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-4'>
        <p>No profile data found.</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col items-center bg-background px-4 py-6'>
      <h1 className='text-3xl text-primary mb-6'>
        Welcome to the Client Portal!
      </h1>

      <UserProfileBox profile={profile} onEdit={handleOpenEditProfile} />

      {/* Workout Programs Section */}
      <div className='mt-10 w-full max-w-md'>
        <h2 className='text-2xl font-semibold mb-4 text-center'>
          Your Workout Programs
        </h2>

        {programsLoading ? (
          <p>Loading your workout programs...</p>
        ) : programsError ? (
          <p className='text-red-500'>Error: {programsError}</p>
        ) : selectedProgram ? (
          <WorkoutProgramDetails
            program={selectedProgram}
            onClose={handleCloseDetails}
          />
        ) : programs.length > 0 ? (
          <div className='flex flex-col gap-4'>
            <button
              onClick={handleOpenCreateProgram}
              className='mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
            >
              Create Workout Program
            </button>
            <WorkoutProgramList
              programs={programs}
              onSelectProgram={handleSelectProgram}
            />
          </div>
        ) : (
          <div className='text-center'>
            <p>You have no workout programs. Would you like to create one?</p>
            <button
              onClick={handleOpenCreateProgram}
              className='mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary'
            >
              Create Workout Program
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={handleCloseEditProfile}
      />
      <CreateWorkoutProgramModal
        isOpen={isCreateProgramOpen}
        onClose={handleCloseCreateProgram}
      />
    </div>
  )
}

export default ClientPortalPage
