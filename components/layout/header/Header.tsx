// components/Header.tsx

import React from 'react'
import ThemeToggle from '@/components/ui/buttons/ThemeToggle'

const Header = () => {
  return (
    <header className='bg-secondary p-4 flex justify-between items-center'>
      <h1 className='text-primary text-2xl'>Workout Your Way</h1>
      <ThemeToggle />
    </header>
  )
}

export default Header
