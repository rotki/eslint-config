import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors';
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from '../globs';
import { interopDefault, parserPlain } from '../utils';
import type { FlatConfigItem, OptionsComponentExts, OptionsFiles, OptionsOverrides } from '../types';

export async function markdown(
  options: OptionsFiles & OptionsComponentExts & OptionsOverrides = {},
): Promise<FlatConfigItem[]> {
  const {
    componentExts = [],
    files = [GLOB_MARKDOWN],
    overrides = {},
  } = options;

  // @ts-expect-error missing types
  const markdown = await interopDefault(import('eslint-plugin-markdown'));

  return [
    {
      plugins: {
        markdown,
      },
    },
    {
      files,
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      // `eslint-plugin-markdown` only creates virtual files for code blocks,
      // but not the markdown file itself. We use `eslint-merge-processors` to
      // add a pass-through processor for the markdown file itself.
      processor: mergeProcessors([
        markdown.processors.markdown,
        processorPassThrough,
      ]),
    },
    {
      files,
      languageOptions: {
        parser: parserPlain,
      },
    },
    {
      files: [
        GLOB_MARKDOWN_CODE,
        ...componentExts.map(ext => `${GLOB_MARKDOWN}/**/*.${ext}`),
      ],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      rules: {
        '@typescript-eslint/consistent-type-imports': 'off',

        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-redeclare': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'import/newline-after-import': 'off',
        'no-alert': 'off',
        'no-console': 'off',

        'no-labels': 'off',
        'no-lone-blocks': 'off',

        'no-restricted-syntax': 'off',
        'no-undef': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'off',
        'no-unused-vars': 'off',
        'node/prefer-global/process': 'off',
        'style/comma-dangle': 'off',
        'style/eol-last': 'off',

        'unicode-bom': 'off',
        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',

        // Type aware rules
        ...{
          '@typescript-eslint/await-thenable': 'off',
          '@typescript-eslint/dot-notation': 'off',
          '@typescript-eslint/naming-convention': 'off',
          '@typescript-eslint/no-floating-promises': 'off',
          '@typescript-eslint/no-for-in-array': 'off',
          '@typescript-eslint/no-implied-eval': 'off',
          '@typescript-eslint/no-misused-promises': 'off',
          '@typescript-eslint/no-throw-literal': 'off',
          '@typescript-eslint/no-unnecessary-type-assertion': 'off',
          '@typescript-eslint/no-unsafe-argument': 'off',
          '@typescript-eslint/no-unsafe-assignment': 'off',
          '@typescript-eslint/no-unsafe-call': 'off',
          '@typescript-eslint/no-unsafe-member-access': 'off',
          '@typescript-eslint/no-unsafe-return': 'off',
          '@typescript-eslint/restrict-plus-operands': 'off',
          '@typescript-eslint/restrict-template-expressions': 'off',
          '@typescript-eslint/unbound-method': 'off',
        },

        ...overrides,
      },
    },
  ];
}
