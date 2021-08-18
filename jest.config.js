
module.exports = {
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  roots: [
    '<rootDir>/tests',
  ],
  testMatch: [
    '**/*.spec.ts',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
