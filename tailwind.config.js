/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      width: {
        900: '900px',
        1000: '1000px',
      },
      height: {
        '90vh': '90vh',
        '80vh': '80vh',
        '70vh': '70vh',
      },
      opacity: {
        '0%': '0%',
      },
    },
  },
  plugins: [],
};
