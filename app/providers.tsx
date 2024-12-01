// app/providers.tsx

'use client'

import React from 'react'
import { ThemeProvider } from 'next-themes'

interface ProvidersProps {
  children: React.ReactNode
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider
      attribute='data-theme'
      defaultTheme='light'
      enableSystem={false}
      enableColorScheme={true}
    >
      {children}
    </ThemeProvider>
  )
}

export default Providers
