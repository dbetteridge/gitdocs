module.exports = {
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^@components/(.*)$": "<rootDir>/components/$1",
    "^@models/(.*)$": "<rootDir>/models/$1",
    "^@utils/(.*)$": "<rootDir>/utils/$1",
    "^@controllers/(.*)$": "<rootDir>/controllers/$1",
    "^@contexts/(.*)$": "<rootDir>/contexts/$1",
    "^@pages/(.*)$": "<rootDir>/pages/$1",
    "^@interfaces/(.*)$": "<rootDir>/interfaces/$1",
  },
};
