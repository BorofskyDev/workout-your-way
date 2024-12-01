// app/layout.tsx

import './globals.css'
import type { Metadata } from 'next'
import { Roboto, Open_Sans } from 'next/font/google'
import Header from '@/components/layout/header/Header'



const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
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
        className={`antialiased bg-background text-text ${roboto.variable} ${openSans.variable}`}
        suppressHydrationWarning={true}
      >
        
         
            <Header />
            {children}
          
      
      </body>
    </html>
  )
}
