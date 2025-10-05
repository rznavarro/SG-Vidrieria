/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        'midnight-blue': {
          DEFAULT: '#1a2a3a',
          light: '#2d4a5a',
          dark: '#0f1a24',
        },
      },
      fontFamily: {
        'great-vibes': ['Great Vibes', 'cursive'],
        'allura': ['Allura', 'cursive'],
      }
    },
  },
  plugins: [],
};