import type { OptionsSonarjs, TypedFlatConfigItem } from '../types';
import { GLOB_SRC, GLOB_VUE } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function sonarjs(options: OptionsSonarjs = {}): Promise<TypedFlatConfigItem[]> {
  const {
    cognitiveComplexity = false,
    overrides = {},
    simplification = true,
  } = options;

  await ensurePackages(['eslint-plugin-sonarjs']);

  const [pluginSonarjs] = await Promise.all([
    interopDefault(import('eslint-plugin-sonarjs')),
  ] as const);

  return [
    {
      files: [GLOB_SRC, GLOB_VUE],
      name: 'rotki/sonarjs/rules',
      plugins: {
        sonarjs: pluginSonarjs,
      },
      rules: {
        // Every branch of the conditional does the same thing, so the condition decides nothing.
        'sonarjs/no-all-duplicated-branches': 'error',
        // Code kept as a comment is code nothing runs, tests, or updates.
        'sonarjs/no-commented-code': 'error',
        // A value written and never read: the line meant to have an effect and does not.
        // Distinct from no-unused-vars, which only sees a binding nothing reads at all.
        'sonarjs/no-dead-store': 'error',
        'sonarjs/no-element-overwrite': 'error',
        'sonarjs/no-empty-collection': 'error',
        // Two branches that cannot both be reached, or an expression compared against itself.
        'sonarjs/no-identical-conditions': 'error',
        'sonarjs/no-identical-expressions': 'error',
        // The same body written twice, which is the shape generated code arrives in.
        'sonarjs/no-identical-functions': 'error',
        'sonarjs/no-invariant-returns': 'error',
        'sonarjs/no-unused-collection': 'error',
        'sonarjs/no-use-of-empty-return-value': 'error',

        ...(simplification
          ? {
              'sonarjs/no-collapsible-if': 'error',
              'sonarjs/no-duplicated-branches': 'error',
              'sonarjs/no-gratuitous-expressions': 'error',
              'sonarjs/no-inverted-boolean-check': 'error',
              'sonarjs/no-redundant-boolean': 'error',
              'sonarjs/no-redundant-jump': 'error',
              'sonarjs/prefer-single-boolean-return': 'error',
            }
          : {}),

        // Off by default: on an existing tree this produces a backlog that has to be
        // scheduled rather than absorbed.
        ...(cognitiveComplexity === false
          ? {}
          : { 'sonarjs/cognitive-complexity': ['error', cognitiveComplexity] }),

        ...overrides,
      },
    },
  ];
}
