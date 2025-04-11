module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
      "./node_modules/@shopify/polaris/**/*.js"
    ],
    theme: {
      extend: {},
    },
    plugins: [],
    corePlugins: {
      preflight: false,
    }
  }