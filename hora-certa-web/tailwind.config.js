/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        dark: {
          100: "#2a2a2a",
          200: "#1a1a1a",
          300: "#0f0f0f",
        },
      },
      keyframes: {
        "progress-bar-timer": {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
      },
      animation: {
        "progress-bar-timer": "progress-bar-timer 3s linear forwards",
      },
    },
  },
  plugins: [],
};
