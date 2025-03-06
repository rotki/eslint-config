import type { OptionsFiles, OptionsHasTypeScript, OptionsOverrides, TypedFlatConfigItem } from '../types';
import globals from 'globals';
import { GLOB_SRC, GLOB_VUE } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function rotkiPlugin(options: OptionsOverrides & OptionsHasTypeScript & OptionsFiles = {}): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC, GLOB_VUE],
    overrides = {},
  } = options;

  await ensurePackages([
    '@rotki/eslint-plugin',
  ]);

  const [pluginRotki, parserVue] = await Promise.all([
    interopDefault(import('@rotki/eslint-plugin')),
    interopDefault(import('vue-eslint-parser')),
  ] as const);

  return [
    {
      name: 'rotki/rotki/setup',
      plugins: {
        '@rotki': pluginRotki,
      },
    },
    {
      files,
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.es2015,
        },
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ecmaVersion: 2022,
          extraFileExtensions: ['.vue'],
          parser: options.typescript
            ? await interopDefault(import('@typescript-eslint/parser')) as any
            : null,
          sourceType: 'module',
        },
      },
      name: 'rotki/rotki/rules',
      rules: {
        '@rotki/consistent-ref-type-annotation': ['error', { allowInference: true }],
        '@rotki/no-deprecated-classes': 'error',
        '@rotki/no-deprecated-props': 'error',
        '@rotki/no-dot-ts-imports': 'error',

        ...overrides,
      },
    },
  ];
}
