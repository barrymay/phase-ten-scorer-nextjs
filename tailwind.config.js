const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',

  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      blue: '#006699',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
    },

    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
