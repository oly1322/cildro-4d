/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17120D',
        ink2: '#211A13',
        ink3: '#2C231A',
        bone: '#F4EFE6',
        bone2: '#E9E1D1',
        accent: '#FF5D1D',
        wa: '#25D366',
        honey: '#C9925B',
        amber2: '#9A6B3C',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        body: ['Archivo', 'Helvetica Neue', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        micro: '0.14em',
        wider2: '0.22em',
      },
    },
  },
  plugins: [],
}
