module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-var-requires': 0, // 使用 require
    '@typescript-eslint/no-explicit-any': ["off"], // 使用 any
    '@typescript-eslint/explicit-module-boundary-types': ["off"]
  }
}
