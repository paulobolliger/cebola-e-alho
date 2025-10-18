// components/Auth/AuthContextProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client' 

// Define a estrutura do contexto de autenticação
interface AuthContextType {
  session: Session | null
  user: User | null // O objeto User contém o UUID (id)
  isLoading: boolean
  supabase: ReturnType<typeof createClient>
}

// Cria o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personalizado para usar a autenticação em qualquer componente filho
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthContextProvider')
  }
  return context
}

// Componente Provedor
export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 1. Busca a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // 2. Assina as mudanças de estado
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    // Limpa a inscrição ao desmontar
    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  const value = {
    session,
    user,
    isLoading,
    supabase,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}