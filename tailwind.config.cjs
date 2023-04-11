/** @type {import("tailwindcss").Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar'), require('@tailwindcss/forms')],
};

export default config;
