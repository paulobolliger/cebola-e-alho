import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ReactNode } from 'react'
import { Poppins, Roboto } from 'next/font/google' // Fontes sugeridas

// 1. Configuração das Fontes do Branding Book
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700', '900'], // Pesos comuns
  variable: '--font-display' // Fonte para Títulos e CTAs
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body' // Fonte para Corpo de Texto e Legibilidade
})

// 2. Metadata: Inclusão do Favicon e Slogan
export const metadata = {
  title: 'Cebola & Alho - Sua despensa, infinitas receitas. Geradas por IA.', // Título e Slogan
  description: 'Transforme os ingredientes que o usuário já possui em casa em experiências culinárias personalizadas e criativas, usando o poder da Inteligência Artificial.', // Missão
  icons: {
    // 3. Novo Favicon da Marca
    icon: 'https://res.cloudinary.com/dhqvjxgue/image/upload/v1760213127/favicon-32x32_mba6kn.png',
  }
}

// Tipagem de props
interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    // 4. Aplicação das classes de fonte no <html>
    <html lang="pt-BR" className={`${poppins.variable} ${roboto.variable}`}>
      <body className="flex flex-col min-h-screen font-body bg-background-light text-text-base">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}