// components/ui/buttons/ModalButton.tsx

'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ModalButtonProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
}

const ModalButton: React.FC<ModalButtonProps> = ({
  onClick,
  children,
  className = '',
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 bg-primary dark:bg-primary-dark text-white font-semibold rounded-md shadow-md hover:bg-secondary dark:hover:bg-secondary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark ${className}`}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}

export default ModalButton
