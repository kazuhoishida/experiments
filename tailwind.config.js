const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./pages/**/*.tsx", "./components/**/*.tsx", "./slices/**/*.tsx"],
  theme: {
    fontFamily: {
      flex: "'Roboto Flex', sans-serif",
      rock: "'Rock 3D', cursive",
      serif: "'Roboto Serif', serif",
      source: "'Source Sans Pro', sans-serif",
    },
    extend: {},
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    plugin(function({ addComponents }) {
      addComponents({
        '.font-bold-h1': {
          'font-variation-settings': 'var(--setting-bold-H1)',
          'font-stretch': 'var(--stretch-bold-H1)',
        },
      })
    })
  ],
};
