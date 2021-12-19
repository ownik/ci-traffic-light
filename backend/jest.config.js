module.exports = {
  rootDir: './',
  displayName: 'Backend',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
    './__tests__/teamcityTestUtils.js',
    './__tests__/setupTests.js',
    'node_modules',
  ],
  setupFiles: ['./__tests__/setupTests.js'],
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
