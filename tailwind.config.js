/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './login.html',
    './src/**/*.{js,html}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        // Italian theme colors
        'verde-italiano': '#007c58',
        'verde-hover': '#006648',
        'oro-veneto': '#d6a74e',
        'rosso-classico': '#c8102e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

