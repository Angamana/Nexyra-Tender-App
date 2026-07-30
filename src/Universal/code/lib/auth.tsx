import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type User = {
  name: string
  email: string
  organization: string
  initial: string
  password?: string
}

type AuthContextType = {
  user: User | null
  signUp: (name: string, email: string, password: string, organization: string) => boolean
  signIn: (email: string, password: string) => { success: boolean; message?: string }
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USERS_STORAGE_KEY = 'nexyra_tender_users_db'
const CURRENT_USER_KEY = 'nexyra_tender_current_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  }, [user])

  const getStoredUsers = (): Record<string, User> => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  }

  const signUp = (name: string, email: string, password: string, organization: string) => {
    const formattedEmail = email.trim().toLowerCase()
    const users = getStoredUsers()
    
    const newUser: User = {
      name: name.trim() || formattedEmail.split('@')[0],
      email: formattedEmail,
      organization: organization.trim() || 'Default Organization',
      initial: (name.trim() || formattedEmail).charAt(0).toUpperCase(),
      password: password || ''
    }

    users[formattedEmail] = newUser
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    setUser(newUser)
    return true
  }

  const signIn = (email: string, password: string) => {
    const formattedEmail = email.trim().toLowerCase()
    const users = getStoredUsers()
    const existingUser = users[formattedEmail]

    if (existingUser) {
      // If existing user has a password set, verify it
      if (existingUser.password && password && existingUser.password !== password) {
        return { success: false, message: 'Incorrect password. Please try again.' }
      }
      setUser(existingUser)
      return { success: true }
    } else {
      // Auto-register user with provided password
      const newUser: User = {
        name: formattedEmail.split('@')[0],
        email: formattedEmail,
        organization: 'My Enterprise',
        initial: formattedEmail.charAt(0).toUpperCase(),
        password: password || ''
      }
      users[formattedEmail] = newUser
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
      setUser(newUser)
      return { success: true }
    }
  }

  const signOut = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
