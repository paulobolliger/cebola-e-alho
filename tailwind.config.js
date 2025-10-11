/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8E6",
        purple: "#8E4E9E",
        gold: "#C49A6C",
        sage: "#A2B29F",
        primary: "#8E4E9E",
        footer: "#232323"
      }
    }
  },
  plugins: [],
}
