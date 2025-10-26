/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        accent: '#0ea5e9',
        'accent-tint': '#0ea5e911'
      },
      boxShadow: {
        soft: '0 20px 45px -25px rgba(15, 23, 42, 0.25)'
      },
      borderRadius: {
        '2xl': '1.25rem'
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif'
        ]
      }
    }
  },
  plugins: []
};
