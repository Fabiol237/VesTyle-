/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8f0',
          100: '#ffebd0',
          200: '#ffd4a1',
          300: '#ffb665',
          400: '#ff8c28',
          500: '#f56f00',
          600: '#c95600',
          700: '#a04100',
          800: '#7a3200',
          900: '#5c2600',
        },
        africa: {
          gold:    '#D4A017',
          earth:   '#8B4513',
          green:   '#2E6B3E',
          sunset:  '#E8642A',
          sand:    '#C7A96E',
          dark:    '#1A1A2E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'gradient-africa': 'linear-gradient(135deg, #1A1A2E 0%, #2E3B55 40%, #8B4513 100%)',
        'gradient-gold': 'linear-gradient(90deg, #D4A017 0%, #F5C842 50%, #D4A017 100%)',
      }
    },
  },
  plugins: [],
}
