'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // MELHORIA: Usa callback para garantir a atualização correta do estado.
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* Ícone Hambúrguer */}
      <button
        onClick={toggleMenu}
        className="text-text-primary focus:outline-none"
        aria-label="Abrir menu"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Overlay e Painel do Menu */}
      <div
        className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={closeMenu} // Usa closeMenu para fechar
        ></div>

        {/* Painel Lateral */}
        <div className="fixed top-0 right-0 h-full w-64 bg-surface shadow-lg z-50 p-6">
          <div className="flex justify-end mb-8">
            <button
              onClick={closeMenu} // Usa closeMenu para fechar
              className="text-text-primary"
              aria-label="Fechar menu"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* CORREÇÃO: Alterando link Gerador para Home e adicionando Receitas */}
          <nav className="flex flex-col space-y-6 text-xl font-body text-text-secondary items-center">
            <Link href="/" className="font-semibold text-primary" onClick={closeMenu}>
              Home
            </Link>
            <Link href="/recipes" className="hover:text-primary" onClick={closeMenu}>
              Receitas
            </Link>
            <Link href="/blog" className="hover:text-primary" onClick={closeMenu}>
              Blog
            </Link>
            <Link href="/about" className="hover:text-primary" onClick={closeMenu}>
              Sobre
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}