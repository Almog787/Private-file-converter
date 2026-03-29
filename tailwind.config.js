/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_posts/**/*.html',
    './*.html',
  ],
  theme: {
    extend: {
      colors: { 
        "primary": "#004ac6" 
      },
      fontFamily: { 
        "headline": ["Space Grotesk", "sans-serif"], 
        "body": ["Manrope", "sans-serif"] 
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
