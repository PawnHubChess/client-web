/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        'chessgrid': 'auto 12rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
