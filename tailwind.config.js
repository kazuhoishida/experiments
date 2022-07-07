const theme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
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
      screens: {
        '2xl': '1600px',
      },
      fontFamily: {
        sans: [ 'Noto Sans JP', ...theme.fontFamily.sans, ]
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    plugin(function({ addComponents }) {
      addComponents({
        '.font-arrow': {
          'font-variation-settings': 'var(--setting-bold-H1)',
          'font-stretch': 'var(--stretch-bold-H1)',
        },
        '.font-bold-h1': {
          'font-variation-settings': 'var(--setting-bold-H1)',
          'font-stretch': 'var(--stretch-bold-H1)',
        },
        '.font-bold-h4': {
          'font-variation-settings': 'var(--setting-bold-H4)',
          'font-stretch': 'var(--stretch-bold-H4)',
        },
        '.font-bold-h6': {
          'font-variation-settings': 'var(--setting-bold-H6)',
          'font-stretch': 'var(--stretch-bold-H6)',
        },
        '.font-squash-h1': {
          'font-variation-settings': 'var(--setting-squash-H1)',
          'font-stretch': 'var(--stretch-squash-H1)',
        },
        '.font-squash-h4': {
          'font-variation-settings': 'var(--setting-squash-H4)',
          'font-stretch': 'var(--stretch-squash-H4)',
        },
        '.font-squash-h6': {
          'font-variation-settings': 'var(--setting-squash-H6)',
          'font-stretch': 'var(--stretch-squash-H6)',
        },
      })
    })
  ],
};
