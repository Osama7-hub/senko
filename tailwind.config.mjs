/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx,css}",
    './app/globals.css',
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        greenLight: "var(--color-light)",
      },
      // fontFamily: {
      //   sans: ['Quicksand', 'Tajawal' ,'sans-serif'],
      // },
      fontFamily: {
        quicksand: ['var(--font-quicksand)', 'sans-serif'],
        tajawal: ['var(--font-tajawal)', 'sans-serif'],
        mixed: ['var(--font-tajawal)', 'var(--font-quicksand)', 'sans-serif'], // default fallback
      },
    },
  },
  darkMode: "class", // استخدم "class" للتحكم في الوضع الداكن
  plugins: [],
};
