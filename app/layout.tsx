// app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Roboto_Flex as Roboto } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from '@/components/Auth/AuthContextProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Configuração das Fontes
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${roboto.variable}`}>
      <body className={`${poppins.className} ${roboto.className}`}>
        <AuthContextProvider> {/* Adiciona o Provider */}
          <div className="flex flex-col min-h-screen bg-background text-text-primary antialiased">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthContextProvider> {/* Fecha o Provider */}
      </body>
    </html>
  );
}