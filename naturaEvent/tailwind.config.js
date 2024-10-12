/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#16423C",
        secondary: {
          DEFAULT: "#6A9C89",
          100: "#C4DAD2",
          200: "#D8F6D3",
          50: "#EFF4F2"
        },
      },
    },
  },
  plugins: [],
}

