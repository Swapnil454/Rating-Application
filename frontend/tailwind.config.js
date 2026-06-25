/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#18181b', // zinc-900 (was black)
          800: '#27272a', // zinc-800
          700: '#3f3f46', // zinc-700
        },
        primary: {
          blue: '#2563eb', // blue-600
          hover: '#1d4ed8', // blue-700
        },
        arcova: {
          dark: '#111111',
          light: '#F9F8F6',
          gold: '#C5A880',
          goldHover: '#dcc19a',
          gray: '#222222',
          textGray: '#888888',
          border: '#333333'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
