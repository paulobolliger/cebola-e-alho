import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReactNode, Suspense } from 'react'; // Importação do Suspense
import { Poppins, Roboto } from 'next/font/google';
import GoogleTagManagerScript from '@/components/GoogleTagManagerScript'; 

// Carregando as fontes com as variáveis que definimos no Tailwind
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-display',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

// Obtendo o ID do GTM para o componente noscript (Server Component)
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata = {
  title: 'Cebola & Alho - Sua despensa, infinitas receitas. Geradas por IA.',
  description:
    'Transforme os ingredientes que você já possui em casa em experiências culinárias personalizadas e criativas, usando o poder da Inteligência Artificial.',
  icons: {
    icon: 'https://res.cloudinary.com/dhqvjxgue/image/upload/v1760213127/favicon-32x32_mba6kn.png',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${roboto.variable}`}>
      {/* Correção: Envolvemos o componente GTM em <Suspense> para compatibilidade */}
      <Suspense fallback={null}> 
        <GoogleTagManagerScript />
      </Suspense>
      
      {/* bg-background agora é branco puro */}
      <body className="flex flex-col min-h-screen font-body bg-background text-text-secondary">
        {/* Injeção da tag <noscript> (parte 2) - Deve ser o primeiro elemento do <body> */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}