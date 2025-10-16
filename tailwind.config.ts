import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ✅ PALETA CORRIGIDA CONFORME BRANDING BOOK "Fogo & Sabor Digital"
        primary: '#D62800',        // Vermelho Fogo (Paixão) - COR PRINCIPAL!
        secondary: '#F94C10',      // Laranja Alquimia (Criatividade)
        accent: '#FFC300',         // Amarelo Inovação (Luz/Destaque)
        
        // Textos
        'text-primary': '#1C1C1C',    // Preto Carvão (Títulos)
        'text-secondary': '#4A4A4A',  // Cinza Escuro (Corpo)
        
        // Fundos
        surface: '#FFFFFF',           // Branco (Cards)
        background: '#ECECEC',        // Cinza Claro Neutro (Fundo geral)
        'background-dark': '#1C1C1C', // Para seções de contraste
        
        // Bordas e neutros
        border: '#D0D0D0',
        neutral: '#ECECEC',
      },
      fontFamily: {
        display: ['var(--font-display)'], // Poppins (Títulos)
        body: ['var(--font-body)'],       // Roboto (Corpo)
      },
      // Gradientes da marca (para usar com bg-gradient-to-r)
      backgroundImage: {
        'gradient-fire': 'linear-gradient(135deg, #D62800 0%, #F94C10 50%, #FFC300 100%)',
        'gradient-fire-subtle': 'linear-gradient(135deg, #F94C10 0%, #FFC300 100%)',
      },
      // Sombras personalizadas para "profundidade"
      boxShadow: {
        'fire': '0 10px 30px -5px rgba(214, 40, 0, 0.3)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      // Animações para o tema "fogo"
      animation: {
        'flame': 'flame 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        flame: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.05)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;