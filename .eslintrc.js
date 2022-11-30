module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  plugins: [
    'prettier', 'unicorn'
  ],
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
  }
}
