// Componente de Servidor Estático, sem necessidade de 'use client' ou tipagem de props
export default function AboutPage() {
  return (
    <section className="p-8 max-w-4xl mx-auto">
      {/* 1. Título com Cor Primária e Fonte Display (Alto Impacto) */}
      <h1 className="text-4xl font-display font-black mb-6 text-primary">
        A Alquimia da Cozinha Digital
      </h1>
      {/* 2. Corpo do texto com Fonte Body e Cor Base Suave */}
      <p className="mb-4 text-text-base font-body text-lg leading-relaxed">
        Cebola & Alho é a fusão do calor da cozinha com a precisão da Inteligência Artificial. 
        Nossa missão é transformar os ingredientes que você já possui em experiências culinárias personalizadas e criativas.
      </p>
      <p className="mb-4 text-text-base font-body text-lg leading-relaxed">
        Não somos apenas um site de receitas; somos seu **Assistente Culinário de IA**. 
        Estimulamos a experimentação (Inspiradora) e garantimos a eficiência (Inteligente), sempre com um tom acessível e acolhedor (Calorosa).
      </p>
      <p className="mb-4 text-text-base font-body text-lg leading-relaxed">
        Você nunca mais vai olhar para uma despensa vazia. Nós transformamos o que é possível no que é delicioso.
      </p>
      <p className="mt-8 text-secondary font-display text-lg font-bold">
        Tecnologia: Next.js 13+ (App Router), React, TypeScript, Tailwind CSS e Supabase (Pronto para Integração).
      </p>
    </section>
  )
}