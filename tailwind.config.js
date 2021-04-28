const colors = require('tailwindcss/colors');
const { rgb } = require('polished');

module.exports = {
  darkMode: 'class',
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      blue: '#006699',
      background: {
        light: 'whte',
        dark: rgb(21, 32, 43),
      },
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      green: colors.green,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
    },
    zIndex: {
      fade: 5,
      'scroll-container': 999,
    },
    inset: {
      0: '0',
      '-1000': '-1000px',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
