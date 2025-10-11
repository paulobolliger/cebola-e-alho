/** @type {import('tailwindcss').Config} */
module.exports = {
  // Garantir que o Tailwind escaneie todos os arquivos .tsx e .ts (App Router)
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // 1. Paleta de Cores "Fogo & Sabor Digital"
      colors: {
        // Cores Principais e de Ação
        'primary': '#D62800', // Vermelho Fogo (Paixão) - CTAs Primários
        'secondary': '#F94C10', // Laranja Alquimia (Criatividade) - Destaques/Secundários
        'accent': '#FFC300', // Amarelo Inovação (Luz) - Acentos/Ícones
        
        // Cores de Base e Fundo
        'text-base': '#1C1C1C', // Preto Carvão (Base Tech) - Tipografia Principal
        'background-light': '#FFFFFF', // Branco Digital - Fundo Primário
        'background-soft': '#ECECEC', // Cinza Claro Neutro - Fundo Secundário
        'footer-bg': '#1C1C1C', // Preto Carvão - Fundo do Footer
      },
      // 2. Configuração de Fontes (Assumindo a instalação das fontes no próximo passo)
      fontFamily: {
        // Exemplo de fontes: Usando 'sans' como fallback até a instalação
        display: ['Poppins', 'sans-serif'], // Fonte para Títulos e Display
        body: ['Roboto', 'sans-serif'],    // Fonte para Corpo de Texto
      }
    }
  },
  plugins: [],
}