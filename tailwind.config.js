/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Noto Serif SC"', '"Source Han Serif SC"', 'Georgia', 'serif'],
      },
      colors: {
        cream: {
          50: '#fefdfb',
          100: '#fdf8f0',
          200: '#f9eddc',
          300: '#f2ddc1',
          400: '#e8c59a',
        },
        terracotta: {
          50: '#fdf5f2',
          100: '#fae7df',
          200: '#f4cdbd',
          300: '#ecaa91',
          400: '#e07f5c',
          500: '#d45f3a',
          600: '#c04728',
          700: '#9f3821',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe2',
          200: '#c7d7c6',
          300: '#a0ba9e',
          400: '#769874',
          500: '#597a57',
          600: '#456143',
        },
        ink: {
          50: '#f6f6f5',
          100: '#e7e7e4',
          200: '#d0d0ca',
          300: '#b0afb0',
          400: '#898888',
          500: '#6b6a6b',
          600: '#555456',
          700: '#474648',
          800: '#3b3a3c',
          900: '#201f22',
        },
      },
      boxShadow: {
        'soft': '0 2px 20px -2px rgba(32, 31, 34, 0.08), 0 4px 6px -2px rgba(32, 31, 34, 0.04)',
        'card': '0 10px 40px -10px rgba(32, 31, 34, 0.12), 0 4px 10px -4px rgba(32, 31, 34, 0.06)',
      },
    },
  },
  plugins: [],
};
