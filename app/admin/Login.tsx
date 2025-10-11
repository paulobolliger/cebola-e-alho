'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { clientSupabase } from '@/lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    setIsError(false)

    try {
      // 1. Autenticação por Magic Link (Padrão mais simples e seguro do Supabase)
      const { error } = await clientSupabase.auth.signInWithOtp({ 
        email, 
        options: {
            // URL de redirecionamento após a confirmação do link
            emailRedirectTo: `${window.location.origin}/admin`
        }
    })

      if (error) {
        throw new Error(error.message)
      }

      setMessage('Link mágico enviado! Verifique seu email para acessar.')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao tentar logar.'
      setMessage(`Falha no Login: ${errorMessage}`)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-soft p-4">
      <div className="w-full max-w-md bg-background-light p-8 rounded-lg shadow-2xl">
        
        <h1 className="text-3xl font-display font-black text-primary text-center mb-6">
          Acesso à Cozinha Digital
        </h1>
        <p className="text-center text-text-base font-body mb-6">
          Acesse o CMS Decap com seu email. Um link de acesso será enviado.
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Seu email de Chef"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-4 focus:ring-secondary font-body"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-secondary text-white p-3 rounded-lg hover:bg-primary transition font-display font-bold uppercase tracking-wider disabled:bg-gray-400 flex items-center justify-center"
          >
            {isLoading ? 'Enviando Link...' : 'Enviar Link Mágico'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg font-body text-sm ${isError ? 'bg-primary/10 border border-primary text-primary' : 'bg-green-500/10 border border-green-600 text-green-700'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}