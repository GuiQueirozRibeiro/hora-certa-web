/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        dark: {
          100: '#2a2a2a',
          200: '#1a1a1a',
          300: '#0f0f0f',
        }
      },
    },
  },
  plugins: [],
}