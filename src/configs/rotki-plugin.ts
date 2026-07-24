import type { OptionsFiles, OptionsHasTypeScript, OptionsRotkiPlugin, OptionsStylistic, TypedFlatConfigItem } from '../types';
import globals from 'globals';
import { GLOB_SRC, GLOB_VUE } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function rotkiPlugin(options: OptionsRotkiPlugin & OptionsHasTypeScript & OptionsStylistic & OptionsFiles = {}): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_SRC, GLOB_VUE],
    ignoreKeys = [],
    overrides = {},
    src = 'src',
    stylistic = true,
    typescript,
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
          parser: typescript
            ? await interopDefault(import('@typescript-eslint/parser')) as any
            : null,
          sourceType: 'module',
        },
      },
      name: 'rotki/rotki/rules',
      rules: {
        '@rotki/composable-no-default-export': 'error',
        '@rotki/composable-prefer-shallowref': 'error',
        '@rotki/composable-require-cleanup': 'error',
        '@rotki/composable-return-readonly': 'error',
        '@rotki/composable-ssr-safety': 'error',
        '@rotki/consistent-ref-type-annotation': ['error', { allowInference: true }],
        '@rotki/no-deprecated-classes': 'error',
        '@rotki/no-deprecated-props': 'error',
        '@rotki/no-dot-ts-imports': 'error',

        '@rotki/no-unused-i18n-keys': [
          'error',
          {
            extensions: ['.ts', '.vue'],
            ignoreKeys,
            src,
          },
        ],

        ...stylistic
          ? {
              '@rotki/composable-input-flexibility': 'error' as const,
              '@rotki/composable-naming-convention': 'error' as const,
              '@rotki/require-jsdoc-on-composable-options': 'error' as const,
            }
          : {},

        ...overrides,
      },
    },
  ];
}
