// components/modals/Modal.tsx

'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className='fixed inset-0 bg-black bg-opacity-50 z-40'
            variants={backdropVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className='fixed top-10  margin-auto bg-background-secondary dark:bg-background-secondary-dark rounded-lg shadow-lg z-50 p-6 w-full max-w-md transform'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className='absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none'
              aria-label='Close Modal'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>

            {/* Modal Body */}
            <div className='mt-4 max-h-[70vh] overflow-y-auto'>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal
