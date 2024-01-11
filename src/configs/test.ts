import { interopDefault } from '../utils';
import { GLOB_TESTS } from '../globs';
import type { FlatConfigItem, OptionsFiles, OptionsIsInEditor, OptionsOverrides } from '../types';

export async function test(
  options: OptionsFiles & OptionsIsInEditor & OptionsOverrides = {},
): Promise<FlatConfigItem[]> {
  const {
    files = GLOB_TESTS,
    isInEditor = false,
    overrides = {},
  } = options;

  const [
    pluginVitest,
    pluginNoOnlyTests,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-vitest')),
    // @ts-expect-error missing types
    interopDefault(import('eslint-plugin-no-only-tests')),
  ] as const);

  return [
    {
      plugins: {
        test: {
          ...pluginVitest,
          rules: {
            ...pluginVitest.rules,
            // extend `test/no-only-tests` rule
            ...pluginNoOnlyTests.rules,
          },
        },
      },
    },
    {
      files,
      rules: {
        'node/prefer-global/process': 'off',

        'test/consistent-test-it': ['error', { fn: 'test', withinDescribe: 'test' }],
        'test/no-identical-title': 'error',
        'test/no-import-node-test': 'error',
        'test/no-only-tests': isInEditor ? 'off' : 'error',
        'test/prefer-hooks-in-order': 'error',
        'test/prefer-lowercase-title': 'error',

        ...overrides,
      },
    },
  ];
}