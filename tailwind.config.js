/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',  // Extra small screens
        'sm': '375px',  // Small screens
        'md-sm': '425px', // Medium-small screens
        'md': '768px', // Tablet size
        'lg': '1024px',    // Large screens
        'xl': '1440px',    // Extra large screens
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
