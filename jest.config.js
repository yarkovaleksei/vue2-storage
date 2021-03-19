const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname),
  verbose: true,
  silent: false,
  bail: true,
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleDirectories: ['node_modules'],
  setupFiles: ['<rootDir>/test/setup.ts'],
  transform: {
    '.+\\.ts$': '<rootDir>/node_modules/ts-jest',
  },
  testRegex: '\\.spec\\.ts$',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
};
