/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        gray: {
          100: '#e5e7eb',
          300: '#9ca3af',
        },
        'forest-green': '#1a2f1a',
        'forest-green-light': '#2d4a2d',
        'forest-green-dark': '#0f1f0f',
      },
      fontFamily: {
        'great-vibes': ['Great Vibes', 'cursive'],
        'allura': ['Allura', 'cursive'],
      }
    },
  },
  plugins: [],
};