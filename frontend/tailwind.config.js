/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22C55E', // Vibrant Apple Green
          light: '#4ADE80',
          dark: '#16A34A',
        },
        secondary: {
          DEFAULT: '#06B6D4', // Bright Cyan
          light: '#22D3EE',
        },
        accent: {
          DEFAULT: '#866ABF', // Soft Purple
          light: '#A78BFA',
        },
        risk: {
          low: '#22C55E',
          moderate: '#F59E0B',
          high: '#EF4444',
          critical: '#B91C1C',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        floatZzz: {
          '0%': { opacity: 0, transform: 'translate(0, 0) scale(0.5)' },
          '20%': { opacity: 1, transform: 'translate(10px, -15px) scale(1)' },
          '80%': { opacity: 0.8, transform: 'translate(25px, -45px) scale(1.5)' },
          '100%': { opacity: 0, transform: 'translate(30px, -60px) scale(1.8)' },
        },
        popSeed: {
          '0%': { opacity: 1, transform: 'translate(0, 0) scale(1)' },
          '100%': { opacity: 0, transform: 'var(--translate-end) scale(0)' },
        },
        popConfetti: {
          '0%': { opacity: 1, transform: 'translate(0, 0) rotate(0deg) scale(1)' },
          '100%': { opacity: 0, transform: 'var(--translate-end) rotate(360deg) scale(0)' },
        },
        breathe: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px) rotate(-3deg)' },
          '75%': { transform: 'translateX(4px) rotate(3deg)' },
        },
        stretch: {
          '0%': { transform: 'scaleY(0.5) scaleX(1.2) translateY(50px)' },
          '50%': { transform: 'scaleY(1.15) scaleX(0.9) translateY(-20px)' },
          '100%': { transform: 'scaleY(1) scaleX(1) translateY(0)' },
        }
      },
      animation: {
        floatZzz: 'floatZzz 3s infinite linear',
        popSeed: 'popSeed 0.8s ease-out forwards',
        popConfetti: 'popConfetti 1.5s ease-out infinite',
        breathe: 'breathe 4s ease-in-out infinite',
        shake: 'shake 0.5s ease-in-out infinite',
        stretch: 'stretch 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
