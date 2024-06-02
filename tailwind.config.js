/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.purple,
        secondary: colors.stone,
        neutral: colors.gray,
        warn: colors.orange,
        danger: colors.rose,
        action: colors.blue
      },
      fontFamily: {
        'sans': 'Helvetica, Arial, sans-serif',
      }
    },
  },
  plugins: [],
}

