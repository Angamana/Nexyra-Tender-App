import { createContext, useContext, useState, type ReactNode } from 'react'

// This is a Mock Auth context since Supabase keys are not currently present in the .env file.
// It hardcodes the requested user account for development and demonstration.

type User = {
  email: string
  initial: string
}

type AuthContextType = {
  user: User | null
  signIn: (email: string, pass: string) => boolean
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // To test the login screen initially, we'll start with null
  const [user, setUser] = useState<User | null>(null)

  const signIn = (email: string) => {
    // For development testing, allow any email/password combo
    // We will hook this up to Supabase later
    setUser({ email, initial: email.charAt(0).toUpperCase() || 'U' })
    return true
  }

  const signOut = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
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
