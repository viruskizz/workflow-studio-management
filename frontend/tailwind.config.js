/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors : {
        "search-box" : 'rgb(165,	165,	173)',
        "purple-button" : 'rgb(75,	49,	220	)',
        "table-bg" : 'rgb(245,	245,	245)',
        "thead" : 'rgb(241,	242,	243)',
        "table-border" : 'rgb(241	242	243)',
        "orange-line" : 'rgb(242 169	59)'
      }
    },
  },
  plugins: [require("daisyui")],
}

