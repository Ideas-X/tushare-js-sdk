module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  testTimeout: 30000,
  verbose: true,
  collectCoverage: false,
  setupFilesAfterEnv: ['<rootDir>/test/setup.js']
};