/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  // Scope ALL utilities to #str-root so they never collide with existing CSS
  important: '#str-root',
  corePlugins: {
    // Disable the CSS reset — project has its own base styles
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        'hk-linen':   '#f1ede8',
        'hk-warm':    '#b5a08a',
        'hk-dark':    '#1a1512',
        'hk-primary': '#2c2520',
        'hk-gold':    '#b8935a',
        'hk-muted':   '#8a7d72',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
