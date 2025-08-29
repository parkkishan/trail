/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        '3xl': '1920px',
      },
      animation: {
        'fadeIn': 'fadeIn 0.2s ease-out',
        'slideIn': 'slideIn 0.3s ease-out',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      minHeight: {
        'screen-without-nav': 'calc(100vh - 4rem)',
      }
    },
  },
  plugins: [],
}

module.exports = {
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    // ... rest of your config
  },
}
   

