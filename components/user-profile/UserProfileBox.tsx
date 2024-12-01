// components/user-profile/UserProfileBox.tsx

import React from 'react'
import { ClientProfile } from '@/lib/hooks/client-profile/useClientProfile'
import ModalButton from '@/components/ui/buttons/ModalButton'

interface UserProfileBoxProps {
  profile: ClientProfile
  onEdit: () => void
}

const UserProfileBox: React.FC<UserProfileBoxProps> = ({ profile, onEdit }) => {
  return (
    <div className='bg-background-secondary p-6 rounded-lg shadow-lg w-full max-w-md'>
      <h2 className='text-2xl font-semibold mb-4 text-center'>Your Profile</h2>
      <div className='space-y-2'>
        <div>
          <span className='font-medium'>Full Name:</span> {profile.fullName}
        </div>
        <div>
          <span className='font-medium'>Email:</span> {profile.email}
        </div>
        <div>
          <span className='font-medium'>Phone:</span> {profile.phone || 'N/A'}
        </div>
        <div>
          <span className='font-medium'>Address:</span>{' '}
          {profile.address || 'N/A'}
        </div>
        <div>
          <span className='font-medium'>Date of Birth:</span>{' '}
          {profile.dateOfBirth || 'N/A'}
        </div>
        <div>
          <span className='font-medium'>Gender:</span> {profile.gender || 'N/A'}
        </div>
        <div>
          <span className='font-medium'>Height:</span> {profile.height || 'N/A'}
        </div>
        <div>
          <span className='font-medium'>Weight:</span> {profile.weight || 'N/A'}
        </div>
        <div>
          <span className='font-medium'>Activity Level:</span>{' '}
          {profile.activityLevel || 'N/A'}
        </div>
        <div>
          <span className='font-medium'>Fitness Goals:</span>{' '}
          {profile.fitnessGoals || 'N/A'}
        </div>
        {/* Add more fields as needed */}
      </div>
      <div className='mt-6 flex justify-center'>
        <ModalButton onClick={onEdit}>Edit Profile</ModalButton>
      </div>
    </div>
  )
}

export default UserProfileBox
