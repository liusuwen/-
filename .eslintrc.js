module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'semi': ['error', 'always'],
    'linebreak-style': 0,
    'eol-last': ['warn', 'always'],
  },
};
