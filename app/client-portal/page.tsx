// app/client-portal/page.tsx
'use client'
import React, { useState } from 'react'
import ModalButton from '@/components/ui/buttons/ModalButton' // Ensure correct import path
import EditProfileModal from '@/components/modals/client-profile/EditProfileModal' // Ensure correct import path

const ClientPortalPage: React.FC = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false)

  const handleOpenEditProfile = () => {
    setIsEditProfileOpen(true)
  }

  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false)
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-background dark:bg-background-dark px-4'>
      <h1 className='text-3xl text-primary dark:text-primary-dark mb-6'>
        Welcome to the Client Portal!
      </h1>

      {/* ModalButton to Open EditProfileModal */}
      <ModalButton onClick={handleOpenEditProfile}>Edit Profile</ModalButton>

      {/* EditProfileModal Component */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={handleCloseEditProfile}
      />
    </div>
  )
}

export default ClientPortalPage
