/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1e2b58', // Deep navy color from hero background & footer
          orange: '#e27435', // Orange buttons and accents
          gold: '#c5a880', // Premium gold color
          lightBg: '#f8fafc', // Very soft grey/blue bg for alternating sections
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        spectral: ['Spectral', 'serif'],
      }
    },
  },
  plugins: [],
}

