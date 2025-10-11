// app/not-found.tsx

import Link from 'next/link'

// 1. O componente notFound é sempre um Server Component
export default function NotFound() {
  return (
    <div className="p-8 max-w-xl mx-auto text-center py-20 bg-background-soft rounded-xl my-12 shadow-xl">
      {/* 2. Código HTTP com Destaque de Branding */}
      <h1 className="text-6xl font-display font-black text-primary mb-2">404</h1>
      <h2 className="text-3xl font-display font-bold text-text-base mb-6">
        Despensa Vazia
      </h2>
      <p className="text-lg text-text-base font-body mb-8">
        Não conseguimos encontrar esta página na nossa cozinha. Talvez o ingrediente tenha acabado!
      </p>
      
      {/* 3. CTA Principal para a Home */}
      <Link href="/" className="inline-block bg-primary text-white p-4 rounded-lg hover:bg-secondary transition font-display font-bold text-lg uppercase tracking-wider shadow-md">
        Voltar à Cozinha Principal
      </Link>
    </div>
  )
}