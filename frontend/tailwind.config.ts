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
        success: '#0CA30C',
        warning: '#F5A524',
        'warning-ink': '#8A5700',
        ink: {
          50: '#F5F7F1',
          100: '#EEF1EA',
          300: '#C4CCC1',
          400: '#9DAA9B',
          500: '#788577',
          600: '#5A6B5D',
          700: '#3E4C40',
          800: '#28362C',
          900: '#16211A',
        },
      },
      borderRadius: {
        card: '16px',
        input: '12px',
        'card-lg': '24px',
        'card-sm': '10px',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      fontSize: {
        display: ['40px', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        h1: ['28px', { lineHeight: '1.2' }],
        h2: ['20px', { lineHeight: '1.3' }],
        h3: ['16px', { lineHeight: '1.4' }],
        body: ['15px', { lineHeight: '1.6' }],
        'body-sm': ['13px', { lineHeight: '1.5' }],
        caption: ['11px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      },
      boxShadow: {
        card: '0 2px 12px rgba(20, 83, 45, 0.06)',
        'card-lg': '0 12px 32px rgba(20, 83, 45, 0.14)',
      },
    },
  },
  plugins: [],
}
export default config
