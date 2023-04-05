/** @type {import("prettier").Config} */
const config = {
  arrowParens: 'avoid',
  singleQuote: true,
  tabWidth: 2,
  semi: true,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
};

module.exports = config;
