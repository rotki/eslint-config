import type { OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '../types';
import { pluginAntfu, pluginImport } from '../plugins';
import { ensurePackages, interopDefault } from '../utils';

export async function imports(
  options: OptionsStylistic & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    stylistic = true,
  } = options;

  await ensurePackages([
    '@rotki/eslint-plugin',
  ]);

  const pluginRotki = await interopDefault(import('@rotki/eslint-plugin'));

  return [
    {
      name: 'rotki/import/rules',
      plugins: {
        '@rotki': pluginRotki,
        'antfu': pluginAntfu,
        'import': pluginImport,
      },
      rules: {
        'antfu/import-dedupe': 'error',
        'antfu/no-import-dist': 'error',
        'antfu/no-import-node-modules-by-path': 'error',

        // Available in import-lite
        'import/consistent-type-specifier-style': ['error', 'top-level'],
        'import/first': 'error',
        'import/no-default-export': 'warn',
        'import/no-duplicates': ['error', { 'prefer-inline': true }],
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        ...stylistic
          ? {
              'import/newline-after-import': ['error', { considerComments: true, count: 1 }],
            }
          : {},

        // Max dependencies rule from @rotki/eslint-plugin
        '@rotki/max-dependencies': [
          'error',
          {
            ignoreTypeImports: false,
            max: 20,
          },
        ],

        ...overrides,
      },
    },
  ];
}
