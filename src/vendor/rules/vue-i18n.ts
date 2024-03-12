import type { RuleConfig } from '@antfu/eslint-define-config';

export interface VueI18nRules {
  'key-format-style': RuleConfig<['camelCase' | 'kebab-case' | 'snake_case', { allowArray?: boolean; splitByDots?: boolean }]>;
  'no-deprecated-i18n-component': RuleConfig<[]>;
  'no-deprecated-i18n-place-attr': RuleConfig<[]>;
  'no-deprecated-i18n-places-prop': RuleConfig<[]>;
  'no-duplicate-keys-in-locale': RuleConfig<[{ ignoreI18nBlock?: boolean }]>;
  'no-dynamic-keys': RuleConfig<[]>;
  'no-html-messages': RuleConfig<[]>;
  'no-i18n-t-path-prop': RuleConfig<[]>;
  'no-missing-keys': RuleConfig<[]>;
  'no-missing-keys-in-other-locales': RuleConfig<[{ ignoreLocales?: string[] }]>;
  'no-raw-text': RuleConfig<[{
    attributes?: Record<string, string[]>;
    ignoreNodes?: string[];
    ignorePattern?: string;
    ignoreText?: string[];
  }]>;
  'no-unknown-locale': RuleConfig<[{
    locales?: string[];
    disableRFC5646?: boolean;
  }]>;
  'no-unused-keys': RuleConfig<[
    {
      src?: string;
      extensions?: string[];
      ignores?: string[];
      enableFix?: boolean;
    },
  ]>;
  'no-v-html': RuleConfig<[]>;
  'prefer-linked-key-with-paren': RuleConfig<[]>;
  'prefer-sfc-lang-attr': RuleConfig<[]>;
  'sfc-locale-attr': RuleConfig<['always' | 'never']>;
  'valid-message-syntax': RuleConfig<[]>;
}
