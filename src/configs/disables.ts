import { GLOB_SRC, GLOB_SRC_EXT } from '../globs';
import type { TypedFlatConfigItem } from '../types';

export async function disables(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [
        `**/*.config.${GLOB_SRC_EXT}`,
        `**/*.config.*.${GLOB_SRC_EXT}`,
        `**/.vitepress/config.${GLOB_SRC}`,
      ],
      name: 'rotki/disables/config',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        'import/no-default-export': 'off',
        'no-console': 'off',
      },
    },
    {
      files: [
        '**/bin/**/*',
        `**/bin.${GLOB_SRC_EXT}`,
        `**/eslint.config.${GLOB_SRC_EXT}`,
      ],
      name: 'rotki/disables/bin',
      rules: {
        'antfu/no-import-dist': 'off',
        'antfu/no-import-node-modules-by-path': 'off',
      },
    },
    {
      files: [`**/scripts/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
      name: 'rotki/disables/cli',
      rules: {
        'max-lines': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['**/*.d.?([cm])ts'],
      name: 'rotki/disables/dts',
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.{test,spec,cy}.ts?(x)'],
      name: 'rotki/disables/test',
      rules: {
        'import/max-dependencies': 'off',
        'max-lines': 'off',
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      name: 'rotki/disables/cjs',
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ];
}
