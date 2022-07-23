module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './build/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        'customamber': '#fffdf1',
        'bg-color': 'rgb(255, 229, 178)',
        'content-color': 'rgb(89, 209, 215)',
        'header-color': 'rgb(255, 212, 104)',
        'menu-color': 'rgb(255, 97, 97)',
        'menu-color-active': 'rgb(130, 34, 34)'

      },
      gridTemplateColumns: {
        '24': 'repeat(24, 20px)'
      },
      gridTemplateRows: {
        '24': 'repeat(24, 40px)'
      },
      
    },

  },
  plugins: [],
};
