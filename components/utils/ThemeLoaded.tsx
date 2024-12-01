// components/ThemeLoaded.tsx

'use client'

import React from 'react'
import { useTheme } from 'next-themes'

interface ThemeLoadedProps {
  children: React.ReactNode
}

const ThemeLoaded: React.FC<ThemeLoadedProps> = ({ children }) => {
  const { resolvedTheme } = useTheme()

  if (!resolvedTheme) return null // Don't render until the theme is resolved

  return <>{children}</>
}

export default ThemeLoaded
