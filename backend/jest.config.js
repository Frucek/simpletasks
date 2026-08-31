module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.js',
    '!node_modules/**',
    '!build/**',
    '!coverage/**',
    '!jest.config.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/coverage/'
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'text', 'text-summary'],
  testMatch: ['**/*.test.js']
};
