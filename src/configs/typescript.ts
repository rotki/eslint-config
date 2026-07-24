import type {
  OptionsComponentExts,
  OptionsFiles,
  OptionsIsInEditor,
  OptionsOverrides,
  OptionsProjectType,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptWithTypes,
  TypedFlatConfigItem,
} from '../types';
import process from 'node:process';
import { GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from '../globs';
import { pluginAntfu } from '../plugins';
import { interopDefault } from '../utils';

type TypeScriptOptions = OptionsFiles & OptionsComponentExts & OptionsOverrides & OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions & OptionsIsInEditor & OptionsProjectType;

const typeAwareCustom: TypedFlatConfigItem['rules'] = {
  '@typescript-eslint/consistent-type-assertions': [
    'error',
    {
      assertionStyle: 'never',
    },
  ],
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

const customRules: TypedFlatConfigItem['rules'] = {
  '@typescript-eslint/prefer-as-const': 'error',
  '@typescript-eslint/prefer-literal-enum-member': [
    'warn',
    { allowBitwiseExpressions: true },
  ],
  'max-lines': ['error', { max: 400 }],
};

function resolveTypeScriptFiles(options: TypeScriptOptions, componentExts: string[]): {
  files: string[];
  filesTypeAware: string[];
  ignoresTypeAware: string[];
} {
  return {
    files: options.files ?? [
      GLOB_TS,
      GLOB_TSX,
      ...componentExts.map(ext => `**/*.${ext}`),
    ],
    filesTypeAware: options.filesTypeAware ?? [GLOB_TS, GLOB_TSX],
    ignoresTypeAware: options.ignoresTypeAware ?? [
      `${GLOB_MARKDOWN}/**`,
    ],
  };
}

interface ResolvedTypeScriptOptions {
  componentExts: string[];
  files: string[];
  filesTypeAware: string[];
  ignoresTypeAware: string[];
  isInEditor: boolean;
  isTypeAware: boolean;
  overrides: TypedFlatConfigItem['rules'];
  overridesTypeAware: TypedFlatConfigItem['rules'];
  parserOptions: NonNullable<OptionsTypeScriptParserOptions['parserOptions']>;
  tsconfigPath: string | undefined;
  type: 'app' | 'lib';
}

function resolveTypeScriptOptions(options: TypeScriptOptions): ResolvedTypeScriptOptions {
  const {
    componentExts = [],
    isInEditor = false,
    overrides = {},
    overridesTypeAware = {},
    parserOptions = {},
    type = 'app',
  } = options;

  const tsconfigPath = options.tsconfigPath
    ? options.tsconfigPath
    : undefined;

  return {
    componentExts,
    isInEditor,
    isTypeAware: !!tsconfigPath,
    overrides,
    overridesTypeAware,
    parserOptions,
    tsconfigPath,
    type,
    ...resolveTypeScriptFiles(options, componentExts),
  };
}

function buildTypeAwareRules(isInEditor: boolean): TypedFlatConfigItem['rules'] {
  return {
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/dot-notation': ['error', { allowKeywords: true }],
    '@typescript-eslint/no-floating-promises': ['error', { ignoreIIFE: true }],
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-implied-eval': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unsafe-argument': isInEditor ? 'warn' : 'off',
    '@typescript-eslint/no-unsafe-assignment': isInEditor ? 'warn' : 'off',
    '@typescript-eslint/no-unsafe-call': isInEditor ? 'warn' : 'off',
    '@typescript-eslint/no-unsafe-member-access': isInEditor ? 'warn' : 'off',
    '@typescript-eslint/no-unsafe-return': isInEditor ? 'warn' : 'off',
    '@typescript-eslint/only-throw-error': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    '@typescript-eslint/return-await': ['error', 'in-try-catch'],
    // '@typescript-eslint/strict-boolean-expressions': ['error', { allowNullableBoolean: true, allowNullableObject: true }],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/unbound-method': 'warn',
    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'no-throw-literal': 'off',

    ...typeAwareCustom,
  };
}

function buildLibRules(type: TypeScriptOptions['type']): TypedFlatConfigItem['rules'] {
  return type === 'lib'
    ? {
        '@typescript-eslint/explicit-function-return-type': ['error', {
          allowExpressions: true,
          allowHigherOrderFunctions: true,
          allowIIFEs: true,
        }],
      }
    : {};
}

export async function typescript(
  options: TypeScriptOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    componentExts,
    files,
    filesTypeAware,
    ignoresTypeAware,
    isInEditor,
    isTypeAware,
    overrides,
    overridesTypeAware,
    parserOptions,
    tsconfigPath,
    type,
  } = resolveTypeScriptOptions(options);

  const [
    pluginTs,
    parserTs,
  ] = await Promise.all([
    interopDefault(import('@typescript-eslint/eslint-plugin')),
    interopDefault(import('@typescript-eslint/parser')),
  ] as const);

  function makeParser(typeAware: boolean, files: string[], ignores?: string[]): TypedFlatConfigItem {
    return {
      files,
      ...ignores ? { ignores } : {},
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: componentExts.map(ext => `.${ext}`),
          sourceType: 'module',
          ...typeAware
            ? {
                projectService: {
                  allowDefaultProject: ['./*.js'],
                  defaultProject: tsconfigPath,
                },
                tsconfigRootDir: process.cwd(),
              }
            : {},
          ...parserOptions as any,
        },
      },
      name: `rotki/typescript/${typeAware ? 'type-aware-parser' : 'parser'}`,
    };
  }

  return [
    {
      name: 'rotki/typescript/setup',
      plugins: {
        '@typescript-eslint': pluginTs,
        'antfu': pluginAntfu,
      },
    },
    // assign type-aware parser for type-aware files and type-unaware parser for the rest
    ...isTypeAware
      ? [
          makeParser(false, files),
          makeParser(true, filesTypeAware, ignoresTypeAware),
        ]
      : [
          makeParser(false, files),
        ],
    {
      files,
      name: 'rotki/typescript/rules',
      rules: {
        ...pluginTs.configs['eslint-recommended'].overrides![0].rules,
        ...pluginTs.configs.strict.rules,
        '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-expect-error': 'allow-with-description' }],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/consistent-type-imports': ['error', {
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        }],
        '@typescript-eslint/method-signature-style': ['error', 'property'], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
        '@typescript-eslint/no-dupe-class-members': 'error',
        '@typescript-eslint/no-dynamic-delete': 'off',
        '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/no-invalid-void-type': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-redeclare': 'off',
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': ['warn', { classes: false, functions: false, variables: true }],
        '@typescript-eslint/no-useless-constructor': 'off',
        '@typescript-eslint/no-wrapper-object-types': 'error',
        '@typescript-eslint/triple-slash-reference': 'off',
        '@typescript-eslint/unified-signatures': 'off',
        'no-dupe-class-members': 'off',
        'no-loss-of-precision': 'error',
        'no-redeclare': 'off',
        'no-use-before-define': 'off',
        'no-useless-constructor': 'off',
        ...buildLibRules(type),
        ...customRules,
        ...overrides,
      },
    },
    ...isTypeAware
      ? [{
          files: filesTypeAware,
          ignores: ignoresTypeAware,
          name: 'rotki/typescript/rules-type-aware',
          rules: {
            ...buildTypeAwareRules(isInEditor),
            ...overridesTypeAware,
          },
        }]
      : [],
  ];
}
