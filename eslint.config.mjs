import rotki from './dist/index.js';

export default rotki({
  vue: true,
  typescript: true,
  formatters: true,
  stylistic: true,
}, {
  name: 'config/perfectionist/rules',
  files: ['src/**/*.ts'],
  rules: {
    'perfectionist/sort-objects': 'error',
  },
}, {
  name: 'config/require-await/disable',
  files: ['src/configs/*.ts'],
  rules: {
    'require-await': 'off',
  },
});
