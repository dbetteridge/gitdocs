require("dotenv").config();
const withCSS = require("@zeit/next-css");
const { githubURL, authURL, appID, scopes, GITHUB_ID, HOST_URL } = process.env;
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
    githubURL,
    authURL,
    appID,
    scopes,
    GITHUB_ID,
    HOST_URL,
  },
  typescript: {
    ignoreDevErrors: true,
  },
});
