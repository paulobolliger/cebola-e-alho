'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-primary/20 shadow-sm bg-surface/95 backdrop-blur-sm">
      
      {/* Barra superior fixa */}
      <div className="bg-gradient-fire py-2 text-center">
        <p className="text-white text-sm font-display font-bold">
          ✨ Novo: Gere receitas ilimitadas com nossa IA! <span className="animate-pulse">🔥</span>
        </p>
      </div>

      {/* Container principal com altura fixa */}
      <div className="container mx-auto h-24">
        <div className="relative flex h-full items-center justify-between px-4">
          
          {/* LOGO CONTAINER */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 left-4 transition-all duration-300 ease-in-out ${
              isScrolled ? 'w-20 h-20' : 'w-[210px] h-[210px] top-16'
            }`}
          >
            <Link href="/" className="group block h-full w-full">
              {/*
                AQUI ESTÁ A CORREÇÃO:
                - Troquei 'rounded-10x3' por 'rounded-3xl' para um arredondamento grande e válido.
                - 'overflow-hidden' garante que a imagem seja cortada pelas bordas arredondadas da caixa.
              */}
              <div
                className={`relative h-full w-full overflow-hidden transition-all duration-300 ${
                  isScrolled ? '' : 'bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-3'
                }`}
              >
                <Image
                  src="https://res.cloudinary.com/dhqvjxgue/image/upload/v1760212377/logo-ceboela-e-alho-2_nawzzg.png"
                  alt="Cebola & Alho"
                  fill
                  sizes={isScrolled ? "80px" : "186px"}
                  priority={true}
                  className="object-contain drop-shadow-lg"
                />
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </Link>
          </div>

          {/* Navegação e botões à direita (mantendo sua última estrutura) */}
          <div className="flex flex-1 items-center justify-end gap-1">
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: '/recipes', label: 'Receitas'},
                { href: '/blog', label: 'Blog'},
                { href: '/about', label: 'Sobre'},
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-display font-bold text-base transition-all hover:scale-105 text-text-primary hover:text-primary hover:bg-primary/5"
                >
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            <div className="hidden md:block">
              <Link
                href="/#gerador"
                className="bg-accent text-text-primary font-display font-bold px-6 py-3 rounded-lg hover:scale-105 transition-transform shadow-md"
              >
                🔥 Criar Receita
              </Link>
            </div>

            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}