module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts',
  ],
  setupFiles: [
    'dotenv/config',
    'reflect-metadata'
  ],
  verbose: true,
  moduleNameMapper: {
    '^@atomixdesign/(nodepay-core/build)/(.*)$': '<rootDir>/../nodepay-core/src/$2',
    '^@atomixdesign/(nodepay-[a-z]+)/(.*)$': '<rootDir>/../$1/src/$2'
  },
  testTimeout: 60000
}
