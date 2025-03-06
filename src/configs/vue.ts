import { mergeProcessors } from 'eslint-merge-processors';
import { GLOB_VUE } from '../globs';
import { interopDefault } from '../utils';
import type {
  OptionsFiles,
  OptionsHasTypeScript,
  OptionsOverrides,
  OptionsStylistic,
  OptionsVue,
  TypedFlatConfigItem,
} from '../types';

export async function vue(
  options: OptionsVue & OptionsHasTypeScript & OptionsOverrides & OptionsStylistic & OptionsFiles = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_VUE],
    overrides = {},
    stylistic = true,
  } = options;

  const sfcBlocks = options.sfcBlocks === true
    ? {}
    : options.sfcBlocks ?? {};

  const {
    indent = 2,
  } = typeof stylistic === 'boolean' ? {} : stylistic;

  const [
    pluginVue,
    parserVue,
    processorVueBlocks,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser')),
    interopDefault(import('eslint-processor-vue-blocks')),
  ] as const);

  const customRules: typeof pluginVue['rules'] = {
    'max-lines': ['warn', { max: 800 }],
    // migration
    'vue/component-api-style': ['error', ['script-setup']],
    'vue/define-props-declaration': ['error', 'type-based'],
    'vue/first-attribute-linebreak': ['error', {
      multiline: 'below',
      singleline: 'ignore',
    }],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          component: 'always',
          normal: 'always',
          void: 'always',
        },
        math: 'always',
        svg: 'always',
      },
    ],
    'vue/multiline-html-element-content-newline': [
      'error',
      {
        allowEmptyLines: false,
        ignores: ['pre', 'textarea'],
        ignoreWhenEmpty: true,
      },
    ],
    'vue/no-constant-condition': 'warn',
    'vue/no-deprecated-dollar-listeners-api': 'error',
    'vue/no-deprecated-events-api': 'error',
    'vue/no-deprecated-filter': 'error',
    'vue/no-duplicate-attr-inheritance': 'error',
    'vue/no-empty-component-block': 'error',
    'vue/no-static-inline-styles': [
      'error',
      {
        allowBinding: false,
      },
    ],
    'vue/prefer-import-from-vue': 'error',
    'vue/require-explicit-emits': 'error',
    'vue/require-macro-variable-name': ['error', {
      defineEmits: 'emit',
      defineProps: 'props',
      defineSlots: 'slots',
      useAttrs: 'attrs',
      useSlots: 'slots',
    }],
    'vue/v-bind-style': ['error', 'shorthand'],
    'vue/v-on-handler-style': [
      'error',
      'inline',
      {
        ignoreIncludesComment: false,
      },
    ],
    'vue/v-on-style': ['error', 'shorthand'],
    'vue/v-slot-style': [
      'error',
      {
        atComponent: 'shorthand',
        default: 'shorthand',
        named: 'shorthand',
      },
    ],
    // custom
    'vue/valid-v-slot': [
      'error',
      {
        allowModifiers: true,
      },
    ],
  };

  return [
    {
      // https://github.com/vuejs/eslint-plugin-vue/pull/2422
      languageOptions: {
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly',
        },
      },
      // This allows Vue plugin to work with auto imports
      name: 'rotki/vue/setup',
      plugins: {
        vue: pluginVue,
      },
    },
    {
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: ['.vue'],
          parser: options.typescript
            ? await interopDefault(import('@typescript-eslint/parser')) as any
            : null,
          sourceType: 'module',
        },
      },
      name: 'rotki/vue/rules',
      processor: sfcBlocks === false
        ? pluginVue.processors['.vue']
        : mergeProcessors([
            pluginVue.processors['.vue'],
            processorVueBlocks({
              ...sfcBlocks,
              blocks: {
                styles: true,
                ...sfcBlocks.blocks,
              },
            }),
          ]),
      rules: {
        ...pluginVue.configs.base.rules,
        ...pluginVue.configs['vue3-essential'].rules,
        ...pluginVue.configs['vue3-strongly-recommended'].rules,
        ...pluginVue.configs['vue3-recommended'].rules,

        '@typescript-eslint/explicit-function-return-type': 'off',
        'node/prefer-global/process': 'off',

        'vue/block-order': ['error', {
          order: ['script', 'template', 'style'],
        }],
        'vue/component-name-in-template-casing': [
          'error',
          'PascalCase',
          {
            ignores: ['i18n', 'i18n-t', 'i18n-d', 'i18n-n'],
            registeredComponentsOnly: false,
          },
        ],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/custom-event-name-casing': ['error', 'kebab-case', {
          ignores: ['/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u'],
        }],
        'vue/define-macros-order': ['error', {
          defineExposeLast: true,
          order: [
            'definePage',
            'defineOptions',
            'defineModel',
            'defineProps',
            'defineEmits',
            'defineSlots',
          ],
        }],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/eqeqeq': ['error', 'smart'],
        'vue/html-indent': ['error', indent],
        'vue/html-quotes': ['error', 'double'],
        'vue/max-attributes-per-line': [
          'error',
          {
            multiline: {
              max: 1,
            },
            singleline: {
              max: 1,
            },
          },
        ],
        'vue/multi-word-component-names': 'off',
        'vue/no-dupe-keys': 'off',
        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
        ],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-setup-props-reactivity-loss': 'off',
        'vue/no-sparse-arrays': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-html': 'off',
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],

        ...stylistic
          ? {
              'vue/array-bracket-spacing': ['error', 'never'],
              'vue/arrow-spacing': ['error', { after: true, before: true }],
              'vue/block-spacing': ['error', 'always'],
              'vue/block-tag-newline': ['error', {
                multiline: 'always',
                singleline: 'always',
              }],
              'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
              'vue/comma-dangle': ['error', 'always-multiline'],
              'vue/comma-spacing': ['error', { after: true, before: false }],
              'vue/comma-style': ['error', 'last'],
              'vue/html-comment-content-spacing': ['error', 'always', {
                exceptions: ['-'],
              }],
              'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
              'vue/keyword-spacing': ['error', { after: true, before: true }],
              'vue/object-curly-newline': 'off',
              'vue/object-curly-spacing': ['error', 'always'],
              'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
              'vue/operator-linebreak': ['error', 'before'],
              'vue/padding-line-between-blocks': ['error', 'always'],
              'vue/quote-props': ['error', 'consistent-as-needed'],
              'vue/space-in-parens': ['error', 'never'],
              'vue/template-curly-spacing': 'error',
            }
          : {},

        ...customRules,

        ...overrides,
      },
    },
  ];
}
