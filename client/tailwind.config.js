/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  tailwindcss: {},
  autoprefixer: {},
  daisyui: {
    themes: [
      {
        nord: {
          ...require("daisyui/src/theming/themes")['nord'],
          'color-scheme': 'light',
        },
      },
    ],
    themas: ['nord'],
  }
}

