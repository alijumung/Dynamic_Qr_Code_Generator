/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      letterSpacing: {
        widest: "0.3em", // Correct syntax with unit
        wider: "0.2em", // Added unit
      },
      colors: {
        primary: '#8f8cee', // Example primary color
        secondary: '#8a1479', // Example secondary color
        accent: '#e0248b',    // Example accent color
        textColor: '#e1e0fa', // Example custom gray
        backGround: '#070524',
      },

    },
  },
  plugins: [],
}

