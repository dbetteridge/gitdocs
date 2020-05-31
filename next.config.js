require("dotenv").config();
const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  experimental: {
    tsconfigPaths: true,
  },
  publicRuntimeConfig: {
    ...process.env,
  },
});
