import type { OptionsFiles, OptionsIsInEditor, OptionsOverrides, TypedFlatConfigItem } from '../types';
import { GLOB_TESTS } from '../globs';
import { interopDefault } from '../utils';

// Hold the reference so we don't redeclare the plugin on each call
let _pluginTest: any;

export async function test(
  options: OptionsFiles & OptionsIsInEditor & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = GLOB_TESTS,
    isInEditor = false,
    overrides = {},
  } = options;

  const [
    pluginVitest,
    pluginNoOnlyTests,
  ] = await Promise.all([
    interopDefault(import('@vitest/eslint-plugin')),
    // @ts-expect-error missing types
    interopDefault(import('eslint-plugin-no-only-tests')),
  ] as const);

  _pluginTest = _pluginTest || {
    ...pluginVitest,
    rules: {
      ...pluginVitest.rules,
      // extend `test/no-only-tests` rule
      ...pluginNoOnlyTests.rules,
    },
  };

  return [
    {
      name: 'rotki/test/setup',
      plugins: {
        test: _pluginTest,
      },
    },
    {
      files,
      name: 'rotki/test/rules',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',

        'node/prefer-global/process': 'off',
        'test/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
        'test/max-nested-describe': ['error', { max: 2 }],
        'test/no-conditional-in-test': 'warn',
        'test/no-duplicate-hooks': 'error',
        'test/no-identical-title': 'error',
        'test/no-import-node-test': 'error',
        'test/no-only-tests': isInEditor ? 'warn' : 'error',
        'test/prefer-hooks-in-order': 'error',
        'test/prefer-hooks-on-top': 'error',
        'test/prefer-lowercase-title': 'error',
        'test/prefer-mock-promise-shorthand': 'error',
        'test/prefer-to-be': 'error',
        'test/prefer-to-contain': 'error',
        'test/prefer-to-have-length': 'error',
        'test/require-top-level-describe': 'error',

        ...overrides,
      },
    },
  ];
}
