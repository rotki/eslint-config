import rotki from './dist/index.mjs';

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
}, {
  // The package entry and the two internal aggregators are barrels on purpose:
  // `src/index.ts` is the published API surface, and the other two exist so the
  // config modules import from one place.
  name: 'config/barrels',
  files: ['src/index.ts', 'src/configs/index.ts', 'src/plugins.ts'],
  rules: {
    'unicorn/no-barrel-files': 'off',
  },
});
