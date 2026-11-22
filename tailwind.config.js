/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F5FC',
          100: '#EBEBF9',
          200: '#D7D6F3',
          300: '#B8B5EB',
          400: '#8E88E0',
          500: '#695FD5',
          600: '#5145CD', // Primary accent
          700: '#4035B5', // Primary hover
          800: '#342B94',
          900: '#2C2577',
        },
        slate: {
          50: '#F8F9FC',  // Main background
          100: '#F1F3F7',
          200: '#E6E8EF', // Main border
          300: '#D5D8E2',
          400: '#A3ACBA',
          500: '#697386', // Secondary text
          600: '#4F566B',
          700: '#3C4257',
          800: '#2A2F45',
          900: '#171923', // Primary text
        },
        success: {
          DEFAULT: '#16845B',
          bg: '#EAF6F0',
          border: '#C2E8D7',
        },
        error: {
          DEFAULT: '#D64545',
          bg: '#FDF2F2',
          border: '#F8D7D7',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        dropdown: '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        subtle: '0 1px 2px 0 rgba(16, 24, 40, 0.04)',
      },
    },
  },
  plugins: [],
}
