const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        'logo-background': '#00283a',
        'logo-yellow': '#ecb351',
        'logo-blue': '#0090c7',
        'logo-orange': '#d45207',
      },
    },
  },
  plugins: [],
};
