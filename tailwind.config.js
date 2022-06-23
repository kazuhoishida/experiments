const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./pages/**/*.tsx", "./components/**/*.tsx", "./slices/**/*.tsx"],
  theme: {
    fontFamily: {
      flex: "'Roboto Flex', 'Noto Sans JP', sans-serif",
      rock: "'Rock 3D', 'Noto Sans JP', cursive",
      serif: "'Roboto Serif', 'Noto Sans JP', serif",
      noto: "'Noto Sans JP', sans-serif",
    },
    extend: {
      fontFamily: {
        sans: [ 'Noto Sans JP', ...defaultTheme.fontFamily.sans, ]
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    plugin(function({ addComponents }) {
      addComponents({
        '.font-bold-h1': {
          'font-variation-settings': 'var(--setting-bold-H1)',
          'font-stretch': 'var(--stretch-bold-H1)',
        },
        '.font-squash-h1': {
          'font-variation-settings': 'var(--setting-squash-H1)',
          'font-stretch': 'var(--stretch-squash-H1)',
        },
        '.font-squash-h4': {
          'font-variation-settings': 'var(--setting-squash-H1)',
          'font-stretch': 'var(--stretch-squash-H1)',
        },
      })
    })
  ],
};
