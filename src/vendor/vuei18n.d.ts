declare module '@intlify/eslint-plugin-vue-i18n' {
  import type { VueI18nRules } from './rules';
  import { ParserOptions, Prefix } from '@antfu/eslint-define-config';

  const vueI18n = {
    configs: {
      recommended: {
        env: {
          browser: true,
          es6: true,
        },
        parserOptions: ParserOptions,
        rules: {
          '@intlify/vue-i18n/no-html-messages': 'warn' as const,
          '@intlify/vue-i18n/no-missing-keys': 'warn' as const,
          '@intlify/vue-i18n/no-raw-text': 'warn' as const,
          '@intlify/vue-i18n/no-v-html': 'warn' as const,
        },
      },
    },
    rules: Prefix<VueI18nRules, '@intlify/vue-i18n/'>,
  };

  // eslint-disable-next-line import/no-default-export
  export default vueI18n;

}
