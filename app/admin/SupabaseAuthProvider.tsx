'use client'

import { clientSupabase } from '@/lib/supabaseClient'
import { Session, User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import Login from './Login' // Importa o componente de Login que criaremos

// 1. Tipagem do Contexto
interface AuthContextType {
  session: Session | null
  user: User | null
  isLoading: boolean
}

const SupabaseAuthContext = createContext<AuthContextType | undefined>(undefined)

// 2. O Hook para uso em outros componentes
export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth deve ser usado dentro de um SupabaseAuthProvider')
  }
  return context
}

// 3. O Provedor Principal
export const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 4. Busca a sessão inicial
    clientSupabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // 5. Listener para mudanças de sessão (login/logout)
    const { data: { subscription } } = clientSupabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    // 6. Cleanup da subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value = { session, user, isLoading }

  return (
    <SupabaseAuthContext.Provider value={value}>
      {/* 7. Lógica de Proteção */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl font-display font-bold text-secondary">Verificando Credenciais...</p>
        </div>
      ) : user ? (
        children
      ) : (
        // Se não houver usuário, renderiza a página de login
        <Login />
      )}
    </SupabaseAuthContext.Provider>
  )
}