require("dotenv").config();
const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = "eval-cheap-source-map";
    }
    return config;
  },
  experimental: {
    tsconfigPaths: true,
  },
  publicRuntimeConfig: {
    ...process.env,
  },
  typescript: {
    ignoreDevErrors: true,
  },
});
