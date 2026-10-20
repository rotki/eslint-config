import type { OptionsUnicorn, TypedFlatConfigItem } from '../types';
import { GLOB_SRC, GLOB_VUE } from '../globs';
import { pluginUnicorn } from '../plugins';

// A string entry is compiled by the rule as `new RegExp(pattern, 'u')`. Kept as a
// string because unicorn 74 types `ignore` as `(string | object)[]`, which a RegExp
// literal no longer satisfies.
const FILENAME_CASE_IGNORE = '^[A-Z]+\\..*$';

export async function unicorn(options: OptionsUnicorn = {}): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [GLOB_SRC, GLOB_VUE],
      name: 'rotki/unicorn/rules',
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        ...(options.allRecommended
          ? pluginUnicorn.configs.recommended.rules as Required<TypedFlatConfigItem['rules']>
          : {
              'unicorn/catch-error-name': 'error',
              'unicorn/consistent-destructuring': 'error',
              'unicorn/custom-error-definition': 'error',
              'unicorn/error-message': 'error',
              'unicorn/escape-case': 'error',
              'unicorn/explicit-length-check': 'error',
              'unicorn/filename-case': [
                'error',
                {
                  cases: { kebabCase: true, pascalCase: true },
                  ignore: [FILENAME_CASE_IGNORE],
                },
              ],
              'unicorn/new-for-builtins': 'error',
              // 'unicorn/no-array-callback-reference': 'error',
              'unicorn/no-array-method-this-argument': 'error',
              'unicorn/no-async-iterator-callback': 'error',
              'unicorn/no-barrel-files': 'error',
              'unicorn/no-conflicting-constraints': 'error',
              'unicorn/no-console-spaces': 'error',
              'unicorn/no-for-loop': 'error',
              'unicorn/no-incomplete-accessor-override': 'error',
              'unicorn/no-ineffective-csp-directives': 'error',
              'unicorn/no-instanceof-builtins': 'error',
              'unicorn/no-invalid-boolean-attribute-value': 'error',
              'unicorn/no-invalid-dom-token': 'error',
              'unicorn/no-invalid-integrity': 'error',
              'unicorn/no-invalid-intl-options': 'error',
              'unicorn/no-invalid-property-descriptor': 'error',
              'unicorn/no-invalid-remove-event-listener': 'error',
              'unicorn/no-invalid-response-options': 'error',
              'unicorn/no-invalid-style-set-property': 'error',
              'unicorn/no-invalid-temporal-arithmetic': 'error',
              'unicorn/no-invalid-url-protocol-comparison': 'error',
              'unicorn/no-lonely-if': 'error',
              // 'unicorn/no-new-array': 'error',
              'unicorn/no-new-buffer': 'error',
              'unicorn/no-prevent-default-in-passive-listener': 'error',
              'unicorn/no-static-only-class': 'error',
              'unicorn/no-unnecessary-await': 'error',
              'unicorn/no-unsafe-json-serialization': 'error',
              'unicorn/no-unused-iterator-helper': 'error',
              'unicorn/no-unused-properties': 'warn',
              'unicorn/no-url-in-search-params': 'error',
              'unicorn/no-useless-set-construction': 'error',
              'unicorn/no-using-resource-escape': 'error',
              'unicorn/no-zero-fractions': `error`,
              // 'unicorn/prefer-add-event-listener': 'error',
              'unicorn/prefer-array-find': 'error',
              'unicorn/prefer-array-flat-map': 'error',
              'unicorn/prefer-array-index-of': 'error',
              'unicorn/prefer-array-some': 'error',
              'unicorn/prefer-at': 'error',
              'unicorn/prefer-blob-reading-methods': 'error',
              'unicorn/prefer-date-now': 'error',
              // 'unicorn/prefer-dom-node-append': 'error',
              // 'unicorn/dom-node-dataset': 'error',
              // 'unicorn/prefer-dom-node-remove': 'error',
              'unicorn/prefer-dom-node-text-content': 'error',
              'unicorn/prefer-escaped-irregular-whitespace': 'error',
              'unicorn/prefer-includes': 'error',
              'unicorn/prefer-iterator-helpers': 'error',
              'unicorn/prefer-keyboard-event-key': 'error',
              'unicorn/prefer-literal-ascii': 'error',
              'unicorn/prefer-math-trunc': 'error',
              'unicorn/prefer-modern-dom-apis': 'error',
              'unicorn/prefer-modern-math-apis': 'error',
              'unicorn/prefer-negative-index': 'error',
              'unicorn/prefer-node-protocol': 'error',
              // 'unicorn/prefer-number-properties': 'error', TODO: re-evaluate
              'unicorn/prefer-optional-catch-binding': 'error',
              'unicorn/prefer-prototype-methods': 'error',
              // 'unicorn/prefer-query-selector': 'error', TODO: re-evaluate
              'unicorn/prefer-reflect-apply': 'error',
              'unicorn/prefer-regexp-test': 'error',
              'unicorn/prefer-single-call': 'error',
              // 'unicorn/prefer-string-replace-all': 'error', TODO: re-evaluate
              // 'unicorn/prefer-string-slice': 'error', TODO re-evaluate
              'unicorn/prefer-string-starts-ends-with': 'error',
              'unicorn/prefer-string-trim-start-end': 'error',
              'unicorn/prefer-top-level-await': 'error',
              'unicorn/prefer-type-error': 'error',
              'unicorn/prefer-unicode-code-point-escapes': 'error',
              'unicorn/require-text-decoder-streaming': 'error',
              'unicorn/single-line-block-comment-style': ['error', 'single-line'],
              'unicorn/throw-new-error': 'error',
            }),
      },
    },
  ];
}
