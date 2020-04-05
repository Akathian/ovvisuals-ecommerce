module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
    mocha: true
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  globals: {
    use: false,
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true, parser: 'flow' }],
    // "eslint quotes": ["error", "single"],
    'no-console': 'off',
    'arrow-parens': 'off',
    'max-len': [
      'error',
      {
        code: 150,
        ignoreComments: true,
        ignoreUrls: true,
        ignorePattern: '^\\s*const\\s.+=\\s*require\\s*\\(',
        ignoreStrings: true
      }
    ]
  },
  plugins: ['mocha', 'prettier'],
  overrides: [
    {
      files: 'test/test_*.js',
      rules: {
        'no-unused-expressions': 'off'
      }
    }
  ]
};
