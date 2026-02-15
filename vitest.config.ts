import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 60_000,
    exclude: ['**/node_modules/**', '**/dist/**', '**/fixtures/**', '**/_fixtures/**'],
  },
});
