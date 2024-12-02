// app/layout.tsx

import './globals.css'
import type { Metadata } from 'next'
import { Inconsolata, Open_Sans } from 'next/font/google'
import Header from '@/components/layout/header/Header'
import { UserProvider } from '@/contexts/UserContext'

const inconsolata = Inconsolata({
  subsets: ['latin'],
  variable: '--font-inconsolata',
  weight: ['400', '700'],
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Workout Your Way',
  description: 'Exercise App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' data-theme='light'>
      <body
        className={`antialiased bg-background text-text ${inconsolata.variable} ${openSans.variable}`}
        suppressHydrationWarning={true}
      >
        <UserProvider>
          <Header />
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
