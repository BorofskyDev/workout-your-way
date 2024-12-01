// components/auth/LoginComponent.tsx

'use client'

import React, { useState } from 'react'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation' // Import useRouter

const LoginComponent: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter() // Initialize useRouter

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      console.log('Logged in user:', userCredential.user)
      // Redirect to the client portal
      router.push('/client-portal')
    } catch (error: unknown) {
      // Updated typing (see next section)
      console.error('Error logging in:', error)
      if (error instanceof Error) {
        setError(error.message || 'An unexpected error occurred.')
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-md mx-auto mt-10 p-6 bg-background-secondary dark:bg-background-secondary-dark rounded-md shadow-md'>
      <h2 className='text-2xl font-semibold text-primary dark:text-primary-dark mb-4 text-center'>
        Login
      </h2>
      <form onSubmit={handleLogin} className='space-y-4'>
        {/* Email Input */}
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='mt-1 block w-full px-4 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark transition-colors duration-200'
            placeholder='you@example.com'
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-text dark:text-text-dark'
          >
            Password
          </label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='mt-1 block w-full px-4 py-2 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark transition-colors duration-200'
            placeholder='********'
          />
        </div>

        {/* Error Message */}
        {error && <div className='text-red-500 text-sm'>{error}</div>}

        {/* Submit Button */}
        <motion.button
          type='submit'
          disabled={loading}
          className='w-full flex justify-center items-center px-4 py-2 bg-primary dark:bg-primary-dark text-white font-semibold rounded-md shadow-md hover:bg-secondary dark:hover:bg-secondary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark'
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </motion.button>
      </form>
    </div>
  )
}

export default LoginComponent
