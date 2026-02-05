/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Make sure this matches your file structure
  ],
  darkMode: 'class', // Add this for your .dark body styles to work
  theme: {
    extend: {},
  },
  plugins: [],
}