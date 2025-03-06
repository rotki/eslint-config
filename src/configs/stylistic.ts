import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from '../types';
import { pluginAntfu } from '../plugins';
import { interopDefault } from '../utils';

export const StylisticConfigDefaults: StylisticConfig = {
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
    flat: true,
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
        ...config.rules,

        'antfu/consistent-chaining': 'error',
        'antfu/consistent-list-newline': 'error',

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

        ...customRules,
        ...overrides,
      },
    },
  ];
}
