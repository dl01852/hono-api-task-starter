import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: true,
  type: 'app',
  typescript: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: 'single',
  },
}, {
  rules: {
    'no-console': ['off'],
    'antfu/no-top-level-await': ['off'],
    'node/prefer-global/process': ['off'],
    'node/no-process-env': ['error'],
    'unused-imports/no-unused-vars': ['warn'],
    'perfectionist/sort-imports': ['off'],
  },
});
