/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4318FF',
          dark: '#2B3674',
          light: '#7551FF'
        },
        secondary: {
          DEFAULT: '#F4F7FE',
          dark: '#1B2559',
          gray: '#A3AED0'
        },
        navy: {
          DEFAULT: '#2B3674',
          dark: '#1B2559',
          light: '#A3AED0'
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#0B1437'
        },
        brand: {
          500: "#4318FF",
        }
      },
      fontFamily: {
        'dm-sans': ['DM Sans', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};