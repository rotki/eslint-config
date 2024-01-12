import globals from 'globals';
import { ensurePackages, interopDefault } from '../utils';
import { GLOB_SRC, GLOB_VUE } from '../globs';
import type { FlatConfigItem, OptionsFiles, OptionsHasTypeScript, OptionsOverrides } from '../types';

export async function vuetify(options: OptionsOverrides & OptionsHasTypeScript & OptionsFiles = {}): Promise<FlatConfigItem[]> {
  const {
    files = [GLOB_SRC, GLOB_VUE],
    overrides = { },
  } = options;

  await ensurePackages(['eslint-plugin-vuetify']);

  const [pluginVuetify, parserVue] = await Promise.all([
    interopDefault(import('eslint-plugin-vuetify')),
    interopDefault(import('vue-eslint-parser')),
  ] as const);

  return [
    {
      plugins: {
        vuetify: pluginVuetify,
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
      rules: {
        ...pluginVuetify.configs.base.rules,
        ...pluginVuetify.configs.recommended.rules,
        ...overrides,
      },
    },
  ];
}
