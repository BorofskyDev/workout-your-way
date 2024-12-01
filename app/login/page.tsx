// pages/login.tsx

import React from 'react'
import LoginComponent from '@/components/auth/LoginComponent'
import InternalPageLink from '@/components/ui/links/InternalPageLink'
import Head from 'next/head'

const LoginPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Login - Workout Your Way</title>
        <meta
          name='description'
          content='Login to your Workout Your Way account.'
        />
      </Head>
      <div className='min-h-screen flex flex-col items-center justify-center bg-background dark:bg-background-dark'>
        <LoginComponent />
        <p className='mt-4 text-text dark:text-text-dark'>
          Don&apos;t have an account?{' '}
          <InternalPageLink href='/signup' className='font-semibold'>
            Sign Up
          </InternalPageLink>
        </p>
      </div>
    </>
  )
}

export default LoginPage
