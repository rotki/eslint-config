import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs';
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
    overrides = {},
    src = 'src',
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

  // needed for @intlify/vue-i18n/no-unused-keys that depends on legacy conf
  // https://github.com/intlify/eslint-plugin-vue-i18n/blob/7042275c88eb8a3619a802354eb4f298a6d3e284/lib/utils/collect-keys.ts#L140
  // if the plugin adds official support for flat config we can drop this.
  const projectDir = path.join(process.cwd(), src, '..');
  const legacyConfig = path.join(projectDir, '.eslintrc.json');
  if (!fs.existsSync(legacyConfig)) {
    fs.writeFileSync(legacyConfig, JSON.stringify({
      parser: 'vue-eslint-parser',
      parserOptions: {
        ...parserOptions,
        ...(options.typescript ? { parser: '@typescript-eslint/parser' } : {}),
      },
    }, null, 2));
  }

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
            ignoreNodes: ['md-icon', 'v-icon', 'vicon'],
            ignorePattern: '^[-#:()&/+=!.]+$',
            ignoreText: ['EUR', 'HKD', 'USD'],
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
