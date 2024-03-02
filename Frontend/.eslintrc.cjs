const stylistic = require('@stylistic/eslint-plugin')

const style = stylistic.configs.customize({})

module.exports = {
  root: false,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', '@stylistic'],
  rules: {
    'react-refresh/only-export-components': [
      'warn', { allowConstantExport: true },
    ],
    ...style.rules,
  },
}
