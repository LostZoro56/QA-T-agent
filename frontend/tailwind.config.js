/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        qa: {
          orange: '#FF7A00',
          gray: '#F2F2F2',
          lightgray: '#F9F9F9'
        }
      }
    }
  },
  plugins: []
}
