import type { OptionsFiles, OptionsOverrides, OptionsStylistic, StylisticConfig, TypedFlatConfigItem } from '../types';
import { GLOB_YAML } from '../globs';
import { interopDefault } from '../utils';

interface ResolvedYamlOptions {
  files: string[];
  indent: StylisticConfig['indent'];
  overrides: TypedFlatConfigItem['rules'];
  quotes: NonNullable<StylisticConfig['quotes']>;
  stylistic: boolean | StylisticConfig;
}

function resolveYamlOptions(options: OptionsOverrides & OptionsStylistic & OptionsFiles): ResolvedYamlOptions {
  const {
    files = [GLOB_YAML],
    overrides = {},
    stylistic = true,
  } = options;

  const {
    indent: rawIndent = 2,
    quotes = 'single',
  } = typeof stylistic === 'boolean' ? {} : stylistic;

  const indent = Array.isArray(rawIndent) ? rawIndent[0] : rawIndent;

  return {
    files,
    indent,
    overrides,
    quotes,
    stylistic,
  };
}

export async function yaml(
  options: OptionsOverrides & OptionsStylistic & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files,
    indent,
    overrides,
    quotes,
    stylistic,
  } = resolveYamlOptions(options);

  const [
    pluginYaml,
    parserYaml,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-yml')),
    interopDefault(import('yaml-eslint-parser')),
  ] as const);

  return [
    {
      name: 'rotki/yaml/setup',
      plugins: {
        yaml: pluginYaml,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserYaml,
      },
      name: 'rotki/yaml/rules',
      rules: {
        '@stylistic/spaced-comment': 'off',

        'yaml/block-mapping': 'error',
        'yaml/block-sequence': 'error',
        'yaml/no-empty-key': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/no-irregular-whitespace': 'error',
        'yaml/plain-scalar': 'error',

        'yaml/vue-custom-block/no-parsing-error': 'error',

        ...stylistic
          ? {
              'yaml/block-mapping-question-indicator-newline': 'error',
              'yaml/block-sequence-hyphen-indicator-newline': 'error',
              'yaml/flow-mapping-curly-newline': 'error',
              'yaml/flow-mapping-curly-spacing': 'error',
              'yaml/flow-sequence-bracket-newline': 'error',
              'yaml/flow-sequence-bracket-spacing': 'error',
              'yaml/indent': ['error', typeof indent === 'number' ? indent : 2],
              'yaml/key-spacing': 'error',
              'yaml/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
              'yaml/no-tab-indent': 'error',
              'yaml/quotes': ['error', { avoidEscape: true, prefer: quotes === 'backtick' ? 'single' : quotes }],
              'yaml/spaced-comment': 'error',
            }
          : {},

        'max-lines': 'off',

        ...overrides,
      },
    },
  ];
}
