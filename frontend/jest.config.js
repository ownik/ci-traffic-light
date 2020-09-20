module.exports = {
  rootDir: './',
  displayName: 'Frontend',
  setupFiles: ['./__tests__/setupTests.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  modulePathIgnorePatterns: ['./__tests__/setupTests.js', 'node_modules'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
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
