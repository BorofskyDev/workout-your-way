// components/ui/links/InternalPageLink.tsx

'use client' 

import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface InternalPageLinkProps {
  href: string
  children: ReactNode
  className?: string
}

const InternalPageLink: React.FC<InternalPageLinkProps> = ({
  href,
  children,
  className = '',
}) => {
  
const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={`relative group ${className}`}>
      <span className='text-primary dark:text-primary-dark transition-colors duration-200'>
        {children}
      </span>
      
      <motion.span
        className='absolute left-1/2 bottom-0 h-0.5 bg-secondary dark:bg-secondary-dark'
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.2 }}
        style={{ transformOrigin: 'center' }}
      />
      
      {isActive && (
        <motion.span
          className='absolute left-1/2 bottom-0 h-0.5 bg-secondary dark:bg-secondary-dark'
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
          style={{ transformOrigin: 'center' }}
        />
      )}
    </Link>
  )
}

export default InternalPageLink
