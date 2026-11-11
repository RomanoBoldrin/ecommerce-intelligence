const path = require("path");

module.exports = {
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "<rootDir>"],
  globals: {
    AbortController: globalThis.AbortController,
    AbortSignal: globalThis.AbortSignal,
    crypto: globalThis.crypto,
    TextEncoder: globalThis.TextEncoder,
    TextDecoder: globalThis.TextDecoder,
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  globalSetup: "<rootDir>/jest.globalSetup.js",
  resolver: "<rootDir>/jest.resolver.js",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": [
      require.resolve("next/dist/build/swc/jest-transformer.js"),
      {
        pagesDir: path.resolve(__dirname, "src/pages"),
        isEsmProject: false,
      },
    ],
  },
  transformIgnorePatterns: ["/node_modules/"],
};
