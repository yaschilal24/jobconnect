module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEach: undefined,
  setupFilesAfterEnv: ['./tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 20000,
};