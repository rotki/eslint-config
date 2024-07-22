import rotki from './dist/index.js';

export default rotki({
  vue: true,
  typescript: true,
  formatters: true,
  stylistic: true,
  type: 'lib',
}, {
  name: 'config/perfectionist/rules',
  files: ['src/**/*.ts'],
  rules: {
    'perfectionist/sort-objects': 'error',
  },
});
