import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'horta-dark': '#14532D',
        'horta-medium': '#2E7D32',
        'horta-light': '#4CAF50',
        'brand-red': '#D32F2F',
        'brand-yellow': '#FBC02D',
        'bg-app': '#F7F8F4',
        'card-border': '#E8EAE3',
        'input-border': '#E3E6DE',
      },
      borderRadius: {
        card: '16px',
        input: '12px',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(20, 83, 45, 0.06)',
      },
    },
  },
  plugins: [],
}
export default config
