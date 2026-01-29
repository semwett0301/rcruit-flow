module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s', '!src/**/*.dto.ts', '!src/**/*.module.ts', '!src/main.ts'],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testEnvironment: 'node',
  testTimeout: 10000,
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  moduleNameMapper: {
    '^application/(.*)$': '<rootDir>/src/application/$1',
    '^domain/(.*)$': '<rootDir>/src/domain/$1',
    '^infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@repo/dto$': '<rootDir>/../../packages/dto/src/index.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};