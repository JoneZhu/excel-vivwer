module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/unit/**/*.test.js',
    '**/unit/**/*.spec.js'
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'unit/helpers/**/*.js',
    '!**/node_modules/**',
    '!**/specs/**'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  testTimeout: 10000
};
