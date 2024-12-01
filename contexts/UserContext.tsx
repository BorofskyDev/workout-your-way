// contexts/UserContext.tsx
'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { User } from 'firebase/auth'

interface UserContextType {
  user: User | null
  loading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
})

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useAuth = () => useContext(UserContext)
