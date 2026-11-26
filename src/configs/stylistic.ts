import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '../types';
import { pluginAntfu } from '../plugins';
import { interopDefault } from '../utils';

export const StylisticConfigDefaults: StylisticConfig = {
  braceStyle: 'stroustrup',
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: true,
};

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
  lessOpinionated?: boolean;
}

export async function stylistic(
  options: StylisticOptions = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    braceStyle,
    indent,
    jsx,
    lessOpinionated = false,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  };

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));

  const config = pluginStylistic.configs.customize({
    braceStyle,
    indent,
    jsx,
    quotes,
    semi,
  });

  const customRules: TypedFlatConfigItem['rules'] = {
    '@stylistic/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        multilineDetection: 'brackets',
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@stylistic/no-mixed-spaces-and-tabs': 'error',
    '@stylistic/operator-linebreak': 'off',
    '@stylistic/padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        next: ['interface', 'type', 'class', 'function', 'export'] as any,
        prev: '*',
      },
    ],
    '@stylistic/wrap-iife': ['error', 'any', { functionPrototypeMethods: true }],
  };

  return [
    {
      name: 'rotki/stylistic/rules',
      plugins: {
        '@stylistic': pluginStylistic,
        'antfu': pluginAntfu,
      },
      rules: {
        ...config.rules as Required<TypedFlatConfigItem['rules']>,

        // Since @stylistic v6, customize() enables `@stylistic/list-style` for bracket spacing and list
        // line breaks. It overlaps with `antfu/consistent-list-newline`, and running both on the same
        // node inserts duplicate line breaks. For parenthesized lists, `list-style` would also pull up
        // the `)` in `computed(() =>\n  value,\n)`, so the antfu rule keeps handling those and JSX
        // attributes (which `list-style` does not cover), and `list-style` handles everything else.
        '@stylistic/list-style': ['error', { overrides: { '()': 'off' } }],
        'antfu/consistent-chaining': 'error',
        'antfu/consistent-list-newline': ['error', {
          ArrayExpression: false,
          ArrayPattern: false,
          ExportNamedDeclaration: false,
          ImportDeclaration: false,
          JSONArrayExpression: false,
          JSONObjectExpression: false,
          ObjectExpression: false,
          ObjectPattern: false,
          TSInterfaceDeclaration: false,
          TSTupleType: false,
          TSTypeLiteral: false,
          TSTypeParameterDeclaration: false,
          TSTypeParameterInstantiation: false,
        }],

        ...(lessOpinionated
          ? {
              curly: ['error', 'all'],
            }
          : {
              'antfu/curly': 'error',
              'antfu/if-newline': 'error',
              'antfu/top-level-function': 'error',
            }
        ),

        '@stylistic/generator-star-spacing': ['error', { after: true, before: false }],
        '@stylistic/yield-star-spacing': ['error', { after: true, before: false }],

        ...customRules,
        ...overrides,
      },
    },
  ];
}
