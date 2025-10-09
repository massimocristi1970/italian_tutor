/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ enable dark mode based on a .dark class
  content: [
    "./*.html",
    "./**/*.html",
    "./**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

