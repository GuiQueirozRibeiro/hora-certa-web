/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Aqui é onde você coloca suas "Variáveis" de cores do Hora Certa
      colors: {
        primary: '#4F46E5', // O Indigo que você gosta
        secondary: '#1F2937', // Um cinza escuro
        // Adicione outras cores da marca aqui
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Exemplo de fonte
      }
    },
  },
  plugins: [],
}