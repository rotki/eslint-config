import type { OptionsUnicorn, TypedFlatConfigItem } from '../types';
import { pluginUnicorn } from '../plugins';

export async function unicorn(options: OptionsUnicorn = {}): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'rotki/unicorn/rules',
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        ...(options.allRecommended
          ? pluginUnicorn.configs.recommended.rules
          : {
              'unicorn/better-regex': 'error',
              'unicorn/catch-error-name': 'error',
              'unicorn/custom-error-definition': 'error',
              'unicorn/error-message': 'error',
              'unicorn/escape-case': 'error',
              'unicorn/explicit-length-check': 'error',
              'unicorn/filename-case': [
                'error',
                {
                  cases: { kebabCase: true, pascalCase: true },
                  ignore: [/^[A-Z]+\..*$/],
                },
              ],
              'unicorn/new-for-builtins': 'error',
              // 'unicorn/no-array-callback-reference': 'error',
              'unicorn/no-array-method-this-argument': 'error',
              'unicorn/no-array-push-push': 'error',
              'unicorn/no-console-spaces': 'error',
              'unicorn/no-for-loop': 'error',
              'unicorn/no-hex-escape': 'error',
              'unicorn/no-instanceof-builtins': 'error',
              'unicorn/no-invalid-remove-event-listener': 'error',
              'unicorn/no-lonely-if': 'error',
              // 'unicorn/no-new-array': 'error',
              'unicorn/no-new-buffer': 'error',
              'unicorn/no-static-only-class': 'error',
              'unicorn/no-unnecessary-await': 'error',
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
              // 'unicorn/prefer-dom-node-dataset': 'error',
              // 'unicorn/prefer-dom-node-remove': 'error',
              'unicorn/prefer-dom-node-text-content': 'error',
              'unicorn/prefer-includes': 'error',
              'unicorn/prefer-keyboard-event-key': 'error',
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
              // 'unicorn/prefer-string-replace-all': 'error', TODO: re-evaluate
              // 'unicorn/prefer-string-slice': 'error', TODO re-evaluate
              'unicorn/prefer-string-starts-ends-with': 'error',
              'unicorn/prefer-string-trim-start-end': 'error',
              'unicorn/prefer-top-level-await': 'error',
              'unicorn/prefer-type-error': 'error',
              'unicorn/throw-new-error': 'error',
            }),
      },
    },
    {
      files: ['.github/**/*.md'],
      name: 'rotki/unicorn/github-markdown',
      rules: {
        'unicorn/filename-case': 'off',
      },
    },
  ];
}
