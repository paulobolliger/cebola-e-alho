// components/Header.tsx
'use client' // Torna o componente cliente

import Link from 'next/link';
import Image from 'next/image';
import { MobileMenu } from './MobileMenu';
import { useAuth } from '@/components/Auth/AuthContextProvider'; // NOVO: Hook de Auth
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, supabase } = useAuth();
  const router = useRouter();

  // Função para lidar com o login via Google OAuth
  const handleLogin = async () => {
    // Redireciona para o `app/auth/callback/route.ts` após o login
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Erro ao fazer login:', error);
      alert('Falha ao fazer login com Google.');
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro ao fazer logout:', error);
    } else {
      router.refresh(); // Atualiza a página para refletir o estado de logout
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Cebola & Alho Logo" width={32} height={32} />
          <span className="font-display font-black text-xl text-primary hidden sm:inline">
            Cebola & Alho
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 font-semibold text-text-primary">
          <Link href="/recipes" className="hover:text-primary transition-colors">
            Receitas
          </Link>
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            Sobre
          </Link>
          <Link href="/#gerador" className="text-white bg-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Gerar Receita
          </Link>

          {/* Login/User Button - Lógica de Autenticação */}
          {user ? (
            <div className="ml-4 flex items-center gap-3">
              <span className="text-sm text-text-secondary hidden lg:inline">
                Olá, {user.email?.split('@')[0] || 'Usuário'}!
              </span>
              {/* ✅ Botão Sair */}
              <button
                onClick={handleLogout}
                className="bg-accent text-white px-3 py-1.5 text-sm rounded-lg hover:bg-accent/90 transition-colors font-bold"
              >
                Sair
              </button>
            </div>
          ) : (
            // ✅ Botão Entrar
            <button
              onClick={handleLogin}
              className="ml-4 bg-secondary text-white px-3 py-1.5 text-sm rounded-lg hover:bg-secondary/90 transition-colors font-bold"
            >
              Entrar
            </button>
          )}

        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}