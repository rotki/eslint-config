import type { RuleConfig } from '@antfu/eslint-define-config';

export type ValidVLostConfiguration = [{
  allowModifiers?: boolean;
}];

export interface VuetifyRules {
  'vue/valid-v-slot': RuleConfig<ValidVLostConfiguration>;

  'vuetify/no-deprecated-classes': RuleConfig<[]>;
  'vuetify/no-deprecated-colors': RuleConfig<[]>;
  'vuetify/no-deprecated-components': RuleConfig<[]>;
  'vuetify/no-deprecated-events': RuleConfig<[]>;
  'vuetify/no-deprecated-props': RuleConfig<[]>;
  'vuetify/no-deprecated-slots': RuleConfig<[]>;

  'vuetify/grid-unknown-attributes': RuleConfig<[]>;
}
