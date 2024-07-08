import globals from 'globals';
import { ensurePackages, interopDefault } from '../utils';
import { GLOB_CYPRESS, GLOB_SRC } from '../globs';
import type {
  OptionsCypress,
  OptionsFiles,
  OptionsHasTypeScript,
  OptionsOverrides,
  TypedFlatConfigItem,
} from '../types';

export async function cypress(options: OptionsOverrides & OptionsFiles & OptionsHasTypeScript & OptionsCypress = {}): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_CYPRESS, GLOB_SRC],
    overrides = {},
    testDirectory,
  } = options;

  await ensurePackages([
    'eslint-plugin-cypress',
  ]);

  const [pluginCypress] = await Promise.all([
    interopDefault(import('eslint-plugin-cypress')),
  ] as const);

  return [
    {
      name: 'rotki/cypress/setup',
      plugins: {
        cypress: pluginCypress,
      },
    },
    {
      files: testDirectory ? files.map(glob => `${testDirectory}/${glob}`) : files,
      languageOptions: {
        ...(options.typescript
          ? {
              parser: await interopDefault(import('@typescript-eslint/parser')),
            }
          : {}),
        globals: {
          ...globals.browser,
          ...globals.mocha,
          assert: false,
          chai: false,
          cy: false,
          Cypress: false,
          expect: false,
        },
        parserOptions: {
          ecmaVersion: 2019,
          sourceType: 'module',
        },
      },
      name: 'rotki/cypress/rules',

      rules: {
        ...pluginCypress.configs.recommended.rules,
        ...overrides,
      },
    },
  ];
}
