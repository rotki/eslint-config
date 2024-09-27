import { pluginAntfu, pluginImport } from '../plugins';
import type { OptionsOverrides, OptionsStylistic, TypedFlatConfigItem } from '../types';

export async function imports(
  options: OptionsStylistic & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    stylistic = true,
  } = options;

  return [
    {
      name: 'rotki/import/rules',
      plugins: {
        antfu: pluginAntfu,
        import: pluginImport,
      },
      rules: {
        'antfu/import-dedupe': 'error',
        'antfu/no-import-dist': 'error',
        'antfu/no-import-node-modules-by-path': 'error',

        'import/first': 'error',
        'import/max-dependencies': [
          'error',
          {
            ignoreTypeImports: false,
            max: 20,
          },
        ],
        'import/no-cycle': 'error',
        'import/no-default-export': 'warn',
        'import/no-duplicates': ['error', { 'prefer-inline': true }],
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'import/order': [
          'error',
          {
            'groups': [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
              'object',
              'type',
            ],
            'newlines-between': 'never',
            'pathGroups': [{ group: 'internal', pattern: '{{@,~}/,#}**' }],
            'pathGroupsExcludedImportTypes': ['type'],
          },
        ],
        ...stylistic
          ? {
              'import/newline-after-import': ['error', { considerComments: true, count: 1 }],
            }
          : {},
      },
    },
  ];
}
