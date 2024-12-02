// components/modals/ConfirmationModal.tsx

'use client'

import React from 'react'
import Modal from './Modal'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText: string
  cancelText?: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className='text-2xl font-semibold mb-4 text-center'>{title}</h2>
      <p className='mb-6 text-center'>{message}</p>
      <div className='flex justify-end space-x-4'>
        <button
          onClick={onClose}
          className='px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500'
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className='px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500'
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmationModal
