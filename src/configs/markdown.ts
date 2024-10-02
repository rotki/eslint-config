import { mergeProcessors, processorPassThrough } from 'eslint-merge-processors';
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from '../globs';
import { interopDefault, parserPlain } from '../utils';
import type { OptionsComponentExts, OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types';

export async function markdown(
  options: OptionsFiles & OptionsComponentExts & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    componentExts = [],
    files = [GLOB_MARKDOWN],
    overrides = {},
  } = options;

  const markdown = await interopDefault(import('@eslint/markdown'));

  return [
    {
      name: 'rotki/markdown/setup',
      plugins: {
        markdown,
      },
    },
    {
      files,
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      name: 'rotki/markdown/processor',
      // `eslint-plugin-markdown` only creates virtual files for code blocks,
      // but not the markdown file itself. We use `eslint-merge-processors` to
      // add a pass-through processor for the markdown file itself.
      processor: mergeProcessors([
        markdown.processors!.markdown,
        processorPassThrough,
      ]),
    },
    {
      files,
      languageOptions: {
        parser: parserPlain,
      },
      name: 'rotki/markdown/parser',
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
      name: 'rotki/markdown/disables',
      rules: {
        '@typescript-eslint/consistent-type-imports': 'off',

        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-redeclare': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
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

        ...overrides,
      },
    },
    {
      files,
      name: 'rotki/markdown/no-max',
      rules: {
        'max-lines': 'off',
      },
    },
  ];
}
