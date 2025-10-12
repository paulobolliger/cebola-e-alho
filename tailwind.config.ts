import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Nova Paleta de Cores
        primary: '#F94C10',       // Laranja Alquimia (Criatividade)
        accent: '#FFC300',         // Amarelo Inovação (Luz)
        'text-primary': '#1C1C1C',  // Preto Carvão (Títulos)
        'text-secondary': '#4A4A4A',// Cinza Escuro (Corpo de texto)
        surface: '#FFFFFF',        // Branco (Superfícies, Cards)
        background: '#F7F7F7',      // Cinza Muito Claro (Fundo da página)
        border: '#EAEAEA',          // Cinza Claro (Bordas)
      },
      fontFamily: {
        display: ['var(--font-display)'], // Poppins
        body: ['var(--font-body)'], // Roboto
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};

export default config;