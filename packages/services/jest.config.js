// eslint-disable-next-line @typescript-eslint/no-var-requires
const base = require('../../node_modules/@standardnotes/config/src/jest.json');

module.exports = {
  ...base,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  }
};