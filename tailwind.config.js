/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        surface: {
          dark: '#0a0a0a',
          light: '#ffffff',
        },
        border: {
          dark: '#1a1a1a',
          light: '#e5e5e5',
        },
      },
    },
  },
  plugins: [],
};
