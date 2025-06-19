/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F9FAFC',
        secondary: '#e74c3c',
        'custom-blue': '#051DA9',
        'custom-indigo': '#591DA9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Arial', 'sans-serif'],
        'poppins': ["Poppins", "sans-serif"],  // Replace with your chosen font family
        'inter': ["Inter", "sans-serif"],  // Replace with your chosen font family
        'josefin': ["Josefin Sans", "sans-serif"],  // Replace with your chosen font family
        'montserrat': ["Montserrat", "sans-serif"],  // Replace with your chosen font family

      },
    },
  },
  plugins: [],
}