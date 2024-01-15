import process from 'node:process';
import { GLOB_SRC, GLOB_TS, GLOB_TSX } from '../globs';
import { pluginAntfu } from '../plugins';
import { interopDefault, toArray } from '../utils';
import type { ParserOptions } from '@antfu/eslint-define-config';
import type {
  FlatConfigItem,
  OptionsComponentExts,
  OptionsFiles,
  OptionsIsInEditor,
  OptionsOverrides,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptWithTypes,
} from '../types';

export async function typescript(
  options: OptionsFiles & OptionsComponentExts & OptionsOverrides & OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions & OptionsIsInEditor = {},
): Promise<FlatConfigItem[]> {
  const {
    componentExts = [],
    isInEditor = false,
    overrides = {},
    parserOptions = {},
  } = options;

  const files = options.files ?? [
    GLOB_SRC,
    ...componentExts.map(ext => `**/*.${ext}`),
  ];

  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];

  const typeAwareCustom: FlatConfigItem['rules'] = {
    // customizations
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: null,
        modifiers: ['destructured'],
        selector: 'variable',
      },
      {
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        selector: 'parameter',
      },
      {
        format: ['camelCase'],
        selector: 'variable',
      },
      {
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        modifiers: ['const'],
        selector: 'variable',
      },
      {
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        modifiers: ['private'],
        selector: 'memberLike',
      },
      {
        format: ['PascalCase'],
        selector: 'typeLike',
      },
    ],
  };

  const typeAwareRules: FlatConfigItem['rules'] = {
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/dot-notation': ['error', { allowKeywords: true }],
    '@typescript-eslint/no-floating-promises': ['error', { ignoreIIFE: true }],
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-implied-eval': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-throw-literal': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unsafe-argument': isInEditor ? 'warn' : 'off',
    '@typescript-eslint/no-unsafe-assignment': isInEditor ? 'warn' : 'off',
    '@typescript-eslint/no-unsafe-call': isInEditor ? 'warn' : 'off',
    '@typescript-eslint/no-unsafe-member-access': isInEditor ? 'warn' : 'off',
    '@typescript-eslint/no-unsafe-return': isInEditor ? 'warn' : 'off',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    '@typescript-eslint/unbound-method': 'error',
    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'no-throw-literal': 'off',

    ...typeAwareCustom,
  };

  const customRules: FlatConfigItem['rules'] = {
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'allow-as-parameter',
      },
    ],
    '@typescript-eslint/prefer-as-const': 'warn',
    '@typescript-eslint/prefer-literal-enum-member': [
      'error',
      { allowBitwiseExpressions: true },
    ],
    'max-lines': ['error', { max: 400 }],
  };

  const tsconfigPath = options?.tsconfigPath
    ? toArray(options.tsconfigPath)
    : undefined;

  const [
    pluginTs,
    parserTs,
  ] = await Promise.all([
    interopDefault(import('@typescript-eslint/eslint-plugin')),
    interopDefault(import('@typescript-eslint/parser')),
  ] as const);

  const commonParserOptions: ParserOptions = {
    extraFileExtensions: componentExts.map(ext => `.${ext}`),
    sourceType: 'module',
    ...parserOptions as any,
  };

  return [
    {
      plugins: {
        '@typescript-eslint': pluginTs,
        'antfu': pluginAntfu,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserTs,
        parserOptions: commonParserOptions,
      },
      rules: {
        ...pluginTs.configs['eslint-recommended'].overrides![0].rules,
        ...pluginTs.configs.strict.rules,
        '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
        '@typescript-eslint/ban-types': ['error', { types: { Function: false } }],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false, fixStyle: 'inline-type-imports', prefer: 'type-imports' }],
        '@typescript-eslint/no-dupe-class-members': 'error',
        '@typescript-eslint/no-dynamic-delete': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/no-invalid-void-type': 'off',
        '@typescript-eslint/no-loss-of-precision': 'error',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-redeclare': 'off',
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
        '@typescript-eslint/no-useless-constructor': 'off',
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/triple-slash-reference': 'off',
        '@typescript-eslint/unified-signatures': 'off',
        'no-dupe-class-members': 'off',
        'no-loss-of-precision': 'off',
        'no-redeclare': 'off',
        'no-use-before-define': 'off',
        'no-useless-constructor': 'off',
        ...customRules,
        ...overrides,
      },
    },
    {
      files: filesTypeAware,
      languageOptions: {
        parserOptions: {
          ...commonParserOptions,
          ...tsconfigPath
            ? {
                project: tsconfigPath,
                tsconfigRootDir: process.cwd(),
              }
            : {},
        },
      },
      rules: {
        ...tsconfigPath ? typeAwareRules : {},
        ...overrides,
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'eslint-comments/no-unlimited-disable': 'off',
        'import/no-duplicates': 'off',
        'no-restricted-syntax': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.{test,spec,cy}.ts?(x)'],
      rules: {
        'max-lines': 'off',
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['**/*.js', '**/*.cjs'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ];
}
