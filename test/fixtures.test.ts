import type { OptionsConfig, TypedFlatConfigItem } from '../src/types';

import fs from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { execa } from 'execa';
import { glob } from 'tinyglobby';
import { afterAll, beforeAll, it } from 'vitest';

const isWindows = process.platform === 'win32';
const timeout = isWindows ? 300_000 : 60_000;

beforeAll(async () => {
  await fs.rm('_fixtures', { recursive: true, force: true });
});
afterAll(async () => {
  await fs.rm('_fixtures', { recursive: true, force: true });
});

runWithConfig('js', {
  typescript: false,
  vue: false,
});
runWithConfig('all', {
  typescript: true,
  vue: true,
});
runWithConfig('no-style', {
  typescript: true,
  vue: true,
  stylistic: false,
});
runWithConfig(
  'tab-double-quotes',
  {
    typescript: true,
    vue: true,
    stylistic: {
      indent: 'tab',
      quotes: 'double',
    },
  },
  {
    rules: {
      'style/no-mixed-spaces-and-tabs': 'off',
    },
  },
);

runWithConfig(
  'ts-override',
  {
    typescript: true,
  },
  {
    rules: {
      'ts/consistent-type-definitions': ['error', 'type'],
    },
  },
);

runWithConfig(
  'with-formatters',
  {
    typescript: true,
    vue: true,
    formatters: true,
  },
);

runWithConfig('less-opinionated', {
  typescript: true,
  vue: true,
  lessOpinionated: true,
});

runWithConfig('with-regexp', {
  typescript: true,
  regexp: true,
});

runWithConfig(
  'ts-strict',
  {
    typescript: {
      tsconfigPath: './tsconfig.json',
    },
  },
  {
    rules: {
      'ts/no-unsafe-return': ['off'],
    },
  },
);

runWithConfig(
  'no-markdown-with-formatters',
  {
    jsx: false,
    vue: false,
    markdown: false,
    formatters: {
      markdown: true,
    },
  },
);

function runWithConfig(name: string, configs: OptionsConfig, ...items: TypedFlatConfigItem[]) {
  it.concurrent(name, async ({ expect }) => {
    const from = resolve('fixtures/input');
    const output = resolve('fixtures/output', name);
    const target = resolve('_fixtures', name);

    await fs.cp(from, target, {
      recursive: true,
      filter: src => !src.includes('node_modules'),
    });
    await fs.writeFile(join(target, 'eslint.config.js'), `
// @eslint-disable
import rotki from '@rotki/eslint-config'

export default rotki(
  ${JSON.stringify(configs)},
  ...${JSON.stringify(items) ?? []},
)
  `);

    await execa('npx', ['eslint', '.', '--fix'], {
      cwd: target,
      stdio: 'pipe',
      reject: false,
    });

    const files = await glob('**/*', {
      ignore: [
        'node_modules',
        'eslint.config.js',
      ],
      cwd: target,
    });

    await Promise.all(files.map(async (file) => {
      const content = await fs.readFile(join(target, file), 'utf-8');
      const source = await fs.readFile(join(from, file), 'utf-8');
      const outputPath = join(output, file);
      if (content === source) {
        await fs.rm(outputPath, { force: true });
        return;
      }
      await expect.soft(content).toMatchFileSnapshot(join(output, file));
    }));
  }, timeout);
}
