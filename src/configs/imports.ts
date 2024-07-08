import { pluginAntfu, pluginImport } from '../plugins';
import { GLOB_SRC, GLOB_SRC_EXT, GLOB_TESTS } from '../globs';
import type { OptionsStylistic, TypedFlatConfigItem } from '../types';

export async function imports(
  options: OptionsStylistic = {},
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
    {
      files: [
        ...GLOB_TESTS,
      ],
      name: 'rotki/import/disables/tests',
      rules: {
        'import/max-dependencies': 'off',
      },
    },
    {
      files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`, `**/.vitepress/config.${GLOB_SRC}`],
      name: 'rotki/import/disables/config',
      rules: {
        'import/no-default-export': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['**/bin/**/*', `**/bin.${GLOB_SRC_EXT}`, `**/eslint.config.${GLOB_SRC_EXT}`],
      name: 'rotki/import/disables/bin',
      rules: {
        'antfu/no-import-dist': 'off',
        'antfu/no-import-node-modules-by-path': 'off',
      },
    },
  ];
}
