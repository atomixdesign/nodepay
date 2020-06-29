module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts',
  ],
  setupFiles: ['dotenv/config'],
  verbose: true,
}
