import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Nova Paleta de Cores (Ajustada para um visual mais limpo e profissional)
        primary: '#F94C10',       // Laranja Alquimia (Criatividade)
        accent: '#FFC300',         // Amarelo Inovação (Luz)
        'text-primary': '#1C1C1C',  // Preto Carvão (Títulos)
        'text-secondary': '#4A4A4A',// Cinza Escuro (Corpo de texto)
        surface: '#FFFFFF',        // Branco (Superfícies, Cards)
        background: '#FFFFFF',      // CORREÇÃO: Fundo da página agora é Branco Puro
        border: '#DEDEDE',          // MELHORIA: Levemente mais escuro para se destacar no fundo branco.
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