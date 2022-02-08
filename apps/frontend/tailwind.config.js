// apps/site/tailwind.config.js
const { join } = require('path');
const defaultTheme = require('tailwindcss/defaultTheme');

// available since Nx v 12.5
const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');

module.exports = {
  mode: 'jit',
  // content: [
  //   join(__dirname, '**/*.html'),
  //   ...createGlobPatternsForDependencies(__dirname),
  // ],
  content: ['./apps/frontend/src/**/*.html'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      primary: {
        light: '#E6FFFA' /* teal.100 */,
        default: '#4FD1C5' /* teal.400 */,
        dark: '#319795' /* teal.600 */,
      },
      secondary: {
        light: '#FEFCBF' /* yellow.200 */,
        default: '#F6E05E' /* yellow.400 */,
        dark: '#D69E2E' /* yellow.600 */,
      },
      neutral: {
        light: '#EDF2F7' /* gray.200 */,
        default: '#CBD5E0' /* gray.400 */,
        dark: '#4A5568' /* gray.700 */,
      },
      green: {
        light: '#C6F6D5' /* green.200 */,
        default: '#68D391' /* green.400 */,
        dark: '#2F855A' /* green.700 */,
      },
      red: {
        light: '#fecaca' /* red.200 */,
        default: '#f87171' /* red.400 */,
        dark: '#b91c1c' /* red.700 */,
      },
      pink: {
        light: '#FED7E2' /* pink.200 */,
        default: '#F687B3' /* pink.400 */,
        dark: '#B83280' /* pink.700 */,
      },
      blue: {
        light: '#BEE3F8' /* blue.200 */,
        default: '#63B3ED' /* blue.400 */,
        dark: '#2B6CB0' /* blue.700 */,
      },
      amber: {
        light: '#fde68a' /* amber.200 */,
        default: '#fbbf24' /* amber.400 */,
        dark: '#b45309' /* amber.700 */,
      },
      violet: {
        light: '#e9d5ff' /* violet.200 */,
        default: '#c084fc' /* violet.400 */,
        dark: '#7e22ce' /* violet.700 */,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    function({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = '') {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars =
            typeof value === 'string'
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ':root': extractColorVars(theme('colors')),
      });
    },
  ],
};
