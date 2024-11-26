import path from 'node:path';
import process from 'node:process';
import globals from 'globals';
import { GLOB_JSON, GLOB_JSON5, GLOB_TS, GLOB_VUE, GLOB_YAML } from '../globs';
import { ensurePackages, interopDefault } from '../utils';
import type { ParserOptions } from '@antfu/eslint-define-config';
import type { OptionsFiles, OptionsHasTypeScript, OptionsIsInEditor, OptionsVueI18n, TypedFlatConfigItem } from '../types';

export async function vueI18n(options: OptionsHasTypeScript & OptionsIsInEditor & OptionsFiles & OptionsVueI18n = {}): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_TS, GLOB_VUE],
    ignores = [],
    isInEditor = false,
    localesDirectory = 'locales',
    noRawTextIgnores = {
      nodes: ['md-icon', 'v-icon', 'vicon'],
      pattern: '^[-#:()&/+=!.]+$',
      text: ['EUR', 'HKD', 'USD'],
    },
    overrides = {},
    src = 'src',
    version = 9,
  } = options;

  const fileGlobs = files.map(x => `**/${src}/${x}`);

  if (localesDirectory) {
    fileGlobs.push(
      `**/${src}/${localesDirectory}/${GLOB_JSON}`,
      `**/${src}/${localesDirectory}/${GLOB_JSON5}`,
      `**/${src}/${localesDirectory}/${GLOB_YAML}`,
    );
  }

  const localeDir = path.resolve(path.join(process.cwd(), src, localesDirectory));

  await ensurePackages(['@intlify/eslint-plugin-vue-i18n']);

  const [pluginVueI18n, parserVue] = await Promise.all([
    interopDefault(import('@intlify/eslint-plugin-vue-i18n')),
    interopDefault(import('vue-eslint-parser')),
  ] as const);

  const parserOptions: ParserOptions = {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2022,
    extraFileExtensions: ['.vue'],
    parser: options.typescript
      ? await interopDefault(import('@typescript-eslint/parser')) as any
      : null,
    sourceType: 'module',
  };

  return [
    {
      name: 'rotki/vue-i18n/setup',
      plugins: {
        '@intlify/vue-i18n': pluginVueI18n,
      },
    },
    {
      files: fileGlobs,
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.es2015,
        },
        parser: parserVue,
        parserOptions,
      },
      name: 'rotki/vue-i18n/rules',
      rules: {
        ...pluginVueI18n.configs.recommended.rules,

        '@intlify/vue-i18n/key-format-style': [
          'error',
          'snake_case',
          {
            allowArray: false,
          },
        ],
        '@intlify/vue-i18n/no-duplicate-keys-in-locale': 'error',
        '@intlify/vue-i18n/no-raw-text': [
          isInEditor ? 'warn' : 'error',
          {
            ignoreNodes: noRawTextIgnores.nodes,
            ignorePattern: noRawTextIgnores.pattern,
            ignoreText: noRawTextIgnores.text,
          },
        ],
        '@intlify/vue-i18n/no-unused-keys': [
          'error',
          {
            extensions: ['.ts', '.vue'],
            ignores,
            src: path.join('.', src),
          },
        ],

        ...(version === 8
          ? {
              '@intlify/vue-i18n/no-deprecated-i18n-component': 'off',
            }
          : {}),

        ...overrides,

      },
      settings: {
        'vue-i18n': {
          localeDir: `${localeDir}/*.{json,json5,yaml,yml}`,
          messageSyntaxVersion: '^9.0.0',
        },
      },
    },
  ];
}
