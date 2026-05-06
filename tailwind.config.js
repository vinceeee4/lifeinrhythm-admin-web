/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        jade: {
          DEFAULT: '#0d4a45',
          mid: '#1a6b63',
          light: '#2a9085',
        },
        cream: {
          DEFAULT: '#f7f3ec',
          dark: '#ede7da',
        },
        gold: {
          DEFAULT: '#c8973a',
          light: '#e8b85a',
        },
        text: {
          dark: '#1a1a1a',
          mid: '#4a5568',
          light: '#8a9ab0',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 40px rgba(13,74,69,0.12)',
        cardStrong: '0 16px 60px rgba(13,74,69,0.22)',
      },
      animation: {
        pulse: 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200,151,58,0.5)' },
          '50%': { boxShadow: '0 0 0 8px rgba(200,151,58,0)' },
        },
      },
    },
  },
  plugins: [],
}
