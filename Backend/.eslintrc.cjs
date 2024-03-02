const stylistic = require('@stylistic/eslint-plugin')

const style = stylistic.configs.customize({})

module.exports = {
  root: false,
  env: { node: true },
  parserOptions: { sourceType: 'module' },
  plugins: [
    '@stylistic'
  ],
  rules: {
    ...style.rules,
  }
}
