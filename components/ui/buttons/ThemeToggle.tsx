// components/ui/buttons/ThemeToggle.tsx

'use client' 

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid' 

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

 
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className='p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
      aria-label='Toggle Dark Mode'
    >
      {theme === 'light' ? (
        
        <SunIcon className='h-6 w-6 text-primary' />
      ) : (
        
        <MoonIcon className='h-6 w-6 text-primary' />
      )}
    </button>
  )
}

export default ThemeToggle
