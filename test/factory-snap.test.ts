import { expect, it } from 'vitest';
import { CONFIG_PRESET_FULL_OFF, CONFIG_PRESET_FULL_ON, rotki } from '../src';

const ignoredConfigNames = new Set([
  'rotki/gitignore',
  'rotki/ignores',
  'rotki/javascript/setup',
]);

function serialize(configs: Record<string, any>[]): Record<string, any>[] {
  return configs
    .filter(config => !ignoredConfigNames.has(config.name ?? ''))
    .map((config) => {
      const clone: Record<string, any> = { ...config };

      // Normalize plugins — only keep names
      if (clone.plugins) {
        clone.plugins = Object.keys(clone.plugins).sort();
      }

      // Normalize parser references
      if (clone.languageOptions?.parser) {
        clone.languageOptions = {
          ...clone.languageOptions,
          parser: clone.languageOptions.parser?.meta?.name ?? 'unknown-parser',
        };
      }

      // Normalize processor references
      if (clone.processor) {
        clone.processor = typeof clone.processor === 'string'
          ? clone.processor
          : 'object-processor';
      }

      // Sort rules by key for stability
      if (clone.rules) {
        clone.rules = Object.fromEntries(
          Object.entries(clone.rules).sort(([a], [b]) => a.localeCompare(b)),
        );
      }

      // Strip non-deterministic fields
      if (clone.languageOptions?.globals) {
        clone.languageOptions.globals = '/* globals */';
      }
      if (clone.languageOptions?.parserOptions?.tsconfigRootDir) {
        clone.languageOptions.parserOptions = {
          ...clone.languageOptions.parserOptions,
          tsconfigRootDir: '/* tsconfigRootDir */',
        };
      }

      return clone;
    });
}

async function run(name: string, configs: Record<string, any>[]): Promise<void> {
  const serialized = serialize(configs);
  await expect(JSON.stringify(serialized, null, 2)).toMatchFileSnapshot(`__snapshots__/factory/${name}.snap.json`);
}

it('default', async () => {
  const configs = await rotki({
    vue: false,
    pnpm: false,
  });
  await run('default', configs);
});

it('full-off', async () => {
  const configs = await rotki(CONFIG_PRESET_FULL_OFF);
  await run('full-off', configs);
});

it('full-on', async () => {
  const configs = await rotki(CONFIG_PRESET_FULL_ON);
  await run('full-on', configs);
});

it('less-opinionated', async () => {
  const configs = await rotki({
    lessOpinionated: true,
    vue: false,
    pnpm: false,
  });
  await run('less-opinionated', configs);
});

it('javascript-vue', async () => {
  const configs = await rotki({
    typescript: false,
    vue: true,
    pnpm: false,
  });
  await run('javascript-vue', configs);
});

it('in-editor', async () => {
  const configs = await rotki({
    isInEditor: true,
    vue: false,
    pnpm: false,
  });
  await run('in-editor', configs);
});
