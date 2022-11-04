/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto-1fr': 'auto auto',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
