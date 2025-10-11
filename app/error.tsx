'use client' // Componente de erro deve ser um Client Component

import { useEffect } from 'react'

// 1. Tipagem dos Props do Componente de Erro
interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void // Função para tentar renderizar o segmento de novo
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  // 2. Logging do erro para o serviço de monitoramento (ex: Sentry, LogRocket)
  useEffect(() => {
    console.error('Erro de Runtime Capturado:', error)
    // Em produção, você chamaria um serviço de monitoramento aqui
  }, [error])

  return (
    <div className="p-8 max-w-xl mx-auto text-center py-20 bg-background-soft rounded-xl my-12 shadow-xl">
      {/* 3. Branding e Tom de Voz Caloroso */}
      <h2 className="text-4xl font-display font-black text-primary mb-4">
        Opa! O Chef Amigo tropeçou.
      </h2>
      <p className="text-lg text-text-base font-body mb-6">
        Parece que algo deu errado na nossa cozinha digital. 
        Não se preocupe, nossos Cientistas de Dados Gourmet já foram alertados.
      </p>
      
      {/* 4. Mensagem de erro para debug (apenas em desenvolvimento) */}
      <p className="text-sm text-gray-500 italic mb-8">
        Detalhe técnico: {error.message}
      </p>

      {/* 5. Botão de Reset (Tentar Novamente) */}
      <button
        onClick={
          // Tenta re-renderizar o segmento
          () => reset()
        }
        className="bg-secondary text-white p-3 rounded-lg hover:bg-primary transition font-display font-bold uppercase tracking-wider shadow-md"
      >
        Tentar Cozinhar Novamente
      </button>
    </div>
  )
}