/**
 * Types are based on v2.x of vuetify plugin.
 * Not paying to much attention to it since we are going to use the
 * recommended anyway.
 */
declare module 'eslint-plugin-vuetify' {
  import type { ValidVLostConfiguration, VuetifyRules } from './rules/vuetify';
  import type { RuleConfig } from '@antfu/eslint-define-config';

  const baseRules = {
    'vue/valid-v-slot': ['error' as const, {
      allowModifiers: true,
    }] satisfies RuleConfig<ValidVLostConfiguration>,

    'vuetify/no-deprecated-classes': 'error' as const,
    'vuetify/no-deprecated-colors': 'error' as const, // v2.x
    'vuetify/no-deprecated-components': 'error' as const,
    'vuetify/no-deprecated-events': 'error' as const, // v2.x
    'vuetify/no-deprecated-props': 'error' as const,
    'vuetify/no-deprecated-slots': 'error' as const, // v2.x
  };

  const baseConfig = {
    plugins: ['vuetify'],
    rules: baseRules,
  };

  export const vuetify: {
    rules: VuetifyRules;
    configs: {
      base: typeof baseConfig;
      recommended: typeof baseConfig & {
        rules: {
          'vuetify/grid-unknown-attributes': 'error';
        };
      };
    };
  };

  // eslint-disable-next-line import/no-default-export
  export default vuetify;
}
