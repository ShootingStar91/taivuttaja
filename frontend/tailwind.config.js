module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './build/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        'customamber': '#fffdf1',
        'bg-color': '#96ceb4',
        'content-color': 'rgb(255, 229, 178)',
        'header-color': 'rgb(255, 212, 104)',
        'menu-color': 'rgb(255, 97, 97)',
        'menu-color-active': 'rgb(130, 34, 34)',
        'btn-color': '#d17f2c',
        'menu-font-color': '#ffdab5',
        'custom-text-color': '#452916',
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
