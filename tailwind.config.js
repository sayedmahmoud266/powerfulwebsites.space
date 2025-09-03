/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffef0',
          100: '#fefcdd',
          200: '#fdf6ba',
          300: '#fbf08d',
          400: '#f7da00', // Main yellow
          500: '#dcbf03',
          600: '#c39b02',
          700: '#a17102',
          800: '#805701',
          900: '#5c3f01',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
