import rotki from './dist/index.js';

export default rotki({
  vue: true,
  typescript: true,
  formatters: true,
}, {
  files: ['src/**/*.ts'],
  rules: {
    'perfectionist/sort-objects': 'error',
  },
});
