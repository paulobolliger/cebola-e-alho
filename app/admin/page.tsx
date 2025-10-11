'use client'

import { useEffect, useState } from 'react'
import { SupabaseAuthProvider, useSupabaseAuth } from '@/components/Admin/SupabaseAuthProvider'
import { registerCustomBackend } from '@/components/Admin/DecapCustomBackend' // 1. Importa o registrador

// Tipagem para controle do carregamento (mantida)
type DecapCMS = {
  init: (config?: any) => void
  registerBackend: (name: string, backend: any) => void
  registerMediaLibrary: (name: string, mediaLibrary: any) => void
  registerWidget: (name: string, control: any, preview: any) => void
}

// 2. Componente que carrega o CMS APENAS se estiver logado
const CMSLoader = () => {
    const { user, isLoading } = useSupabaseAuth()
    const [isCMSLoaded, setIsCMSLoaded] = useState(false)

    useEffect(() => {
        if (!isLoading && user) {
            const loadCMS = async () => {
                // Importa a biblioteca (decap-cms-app)
                const CMS = (await import('decap-cms-app')).default as DecapCMS

                // 3. Registra o backend customizado
                registerCustomBackend()

                // 4. Inicializa o CMS (Ele vai procurar o backend 'supabase-cms' no config.yml)
                CMS.init({
                    // Força a usar o backend 'supabase-cms' definido no config.yml
                    backend: {
                        name: 'supabase-cms', 
                        auth_url: '/api/cms/auth'
                    }
                }) 
                setIsCMSLoaded(true)
            }
            
            if (typeof window !== 'undefined') {
                loadCMS()
            }
        }
    }, [isLoading, user])

    if (!isCMSLoaded) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-background-soft">
              <p className="text-xl font-display font-bold text-primary">
                  {isLoading ? 'Verificando...' : 'Carregando o Painel Decap CMS...'}
              </p>
          </div>
      )
    }

    return null
}

// Wrapper principal que usa o Provedor de Autenticação
export default function AdminPage() {
    return (
        <SupabaseAuthProvider>
            <CMSLoader />
        </SupabaseAuthProvider>
    )
}