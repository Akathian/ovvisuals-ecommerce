module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
    mocha: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    use: false,
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  parser: '@typescript-eslint/parser',
  rules: {
    'prettier/prettier': ['error', { singleQuote: true, parser: 'flow' }],
    '@typescript-eslint/no-this-alias': 'off',
    'func-names': 'off',
    'consistent-return': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-console': 'off',
    'no-undef': 'off',
    'no-explicit-any': 'off',
    'arrow-parens': 'off',
    'max-len': [
      'error',
      {
        code: 150,
        ignoreComments: true,
        ignoreUrls: true,
        ignorePattern: '^\\s*const\\s.+=\\s*require\\s*\\(',
        ignoreStrings: true,
      },
    ],
  },
  plugins: ['mocha', 'prettier', '@typescript-eslint'],
  overrides: [
    {
      files: 'test/test_*.js',
      rules: {
        'import/prefer-default-export': 'off',
        'func-names': 'off',
      },
    },
  ],
};
