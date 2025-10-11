import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReactNode } from 'react';
import { Poppins, Roboto } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-display',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

export const metadata = {
  title: 'Cebola & Alho - Sua despensa, infinitas receitas. Geradas por IA.',
  description:
    'Transforme os ingredientes que o usuário já possui em casa em experiências culinárias personalizadas e criativas, usando o poder da Inteligência Artificial.',
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
      <body className="flex flex-col min-h-screen font-body bg-background-light text-text-base">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}