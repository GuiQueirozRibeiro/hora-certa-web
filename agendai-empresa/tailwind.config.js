/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Já vou deixar preparado suas cores do Hora Certa aqui
        dark: {
          900: '#18181B', // Fundo principal
          800: '#27272A', // Painéis/Header
          700: '#3F3F46', // Bordas
        },
        primary: {
          DEFAULT: '#4F46E5', // Roxo/Indigo
          hover: '#4338ca',
        }
      }
    },
  },
  plugins: [],
}