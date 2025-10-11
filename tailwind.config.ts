import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: '#D62800', // Vermelho Fogo (Paixão)
        secondary: '#F94C10', // Laranja Alquimia (Criatividade)
        accent: '#FFC300', // Amarelo Inovação (Luz)
        'text-base': '#1C1C1C', // Preto Carvão (Base Tech)
        'background-light': '#FFFFFF', // Branco Digital
        'background-soft': '#ECECEC', // Cinza Claro Neutro
        'footer-bg': '#1C1C1C', // Preto Carvão (Footer)
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'], // Poppins
        body: ['var(--font-body)', 'sans-serif'], // Roboto
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};

export default config;