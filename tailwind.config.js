/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '322px',  // Extra small screens
        'sm': '378px',  // Small screens
        'md-sm': '428px', // Medium-small screens
        'md': '770px', // Tablet size
        'lg': '1025px',    // Large screens
        'xl': '1441px',    // Extra large screens
        '2xl': '2560px',   // 4K resolution
      },
      colors: {
        primary: '#B09383', // Primary color
        'button-primary': '#5C3822', // Button primary
        hover: '#D7C9C1', // Hover color
        text: '#909F8C', // Text color
      },
    },
  },
  plugins: [],
}
