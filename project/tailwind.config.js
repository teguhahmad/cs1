/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6ebfa',
          100: '#c2d1f2',
          200: '#9eb7e9',
          300: '#7a9de0',
          400: '#5684d7',
          500: '#326ace',
          600: '#0F52BA', // Main primary
          700: '#0c3d8c',
          800: '#09295d',
          900: '#06152f',
        },
        secondary: {
          50: '#e0f5f5',
          100: '#b3e5e5',
          200: '#80d4d4',
          300: '#4dc4c4',
          400: '#26b3b3',
          500: '#20B2AA', // Main teal
          600: '#1a8f88',
          700: '#136c66',
          800: '#0d4844',
          900: '#062322',
        },
        accent: {
          50: '#f0e7fa',
          100: '#d8c4f2',
          200: '#c0a1e9',
          300: '#a87ee0',
          400: '#905bd7',
          500: '#8A2BE2', // Main purple
          600: '#6d22b5',
          700: '#521a88',
          800: '#36115a',
          900: '#1b092d',
        },
        gray: {
          750: '#243246',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'inner-top': 'inset 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
};