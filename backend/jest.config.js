module.exports = {
  rootDir: "./",
  displayName: "Backend",
  testEnvironment: "node",
  modulePathIgnorePatterns: [
    "./__tests__/teamcityTestUtils.js",
    "node_modules",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
  verbose: true,
};
