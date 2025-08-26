/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        premiereGlow: {
          '0%, 100%': { boxShadow: '0 0 20px #E53E3E, 0 0 40px #F6E05E' },
          '50%': { boxShadow: '0 0 40px #E53E3E, 0 0 80px #F6E05E' },
        },
      },
      animation: {
        'premiere-glow': 'premiereGlow 2s infinite alternate',
      },
    }
  },
  plugins: [],
}
