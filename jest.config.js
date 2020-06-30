module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts',
  ],
  setupFiles: ['dotenv/config', 'reflect-metadata'],
  verbose: true,
  moduleNameMapper: {
    '^@atomixdesign/nodepay(.*)$': '<rootDir>/src/$1'
  }
}
