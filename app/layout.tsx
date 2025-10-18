// app/layout.tsx
// ... imports existentes ...
import { AuthContextProvider } from '@/components/Auth/AuthContextProvider' // IMPORT NOVO

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
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