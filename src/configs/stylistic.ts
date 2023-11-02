import { interopDefault } from '../utils';
import { pluginAntfu } from '../plugins';
import type { FlatConfigItem, OptionsOverrides, StylisticConfig } from '../types';

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: true,
};

export async function stylistic(
  options: StylisticConfig & OptionsOverrides = {},
): Promise<FlatConfigItem[]> {
  const {
    indent,
    jsx,
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

  const customRules: FlatConfigItem['rules'] = {
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
        next: ['interface', 'type', 'class', 'function', 'export'],
        prev: '*',
      },
    ],
    '@stylistic/wrap-iife': ['error', 'any', { functionPrototypeMethods: true }],
  };

  return [
    {
      plugins: {
        '@stylistic': pluginStylistic,
        'antfu': pluginAntfu,
      },
      rules: {
        ...config.rules,

        'antfu/consistent-list-newline': 'error',
        'antfu/if-newline': 'error',
        'antfu/top-level-function': 'error',

        'curly': ['error', 'multi-or-nest', 'consistent'],

        ...customRules,
        ...overrides,
      },
    },
  ];
}
