// apps/site/tailwind.config.js
const { join } = require('path');
const defaultTheme = require('tailwindcss/defaultTheme');

// available since Nx v 12.5
const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');

module.exports = {
  mode: 'jit',
  content: [
    join(__dirname, '**/*.html'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  // content: ['./apps/frontend/src/**/*.html'],
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
