import type { RuleConfig } from '@antfu/eslint-define-config';

interface AwaitInteractionsRule {
  'await-interactions': RuleConfig<[]>;
}

interface ContextInPlayFunctionRule {
  'context-in-play-function': RuleConfig<[]>;
}

interface CsfComponentsRule {
  'csf-component': RuleConfig<[]>;
}

interface DefaultExportsRule {
  'default-exports': RuleConfig<[]>;
}

interface HierarchySeparatorRule {
  'hierarchy-separator': RuleConfig<[]>;
}

interface MetaInlinePropertiesRule {
  'meta-inline-properties': RuleConfig<[{ csfVersion?: number }]>;
}

interface NoRedundantStoryNameRule {
  'no-redundant-story-name': RuleConfig<[]>;
}

interface NoStoriesOfRule {
  'no-stories-of': RuleConfig<[]>;
}

interface NoTitlePropertyInMetaRule {
  'no-title-property-in-met': RuleConfig<[]>;
}

interface NoUninstalledAddonRule {
  'no-uninstalled-addons': RuleConfig<[{ packageJsonLocation?: string; ignore?: string[] }]>;
}

interface PreferPascalCaseRule {
  'prefer-pascal-case': RuleConfig<[]>;
}

interface StoryExportsRule {
  'prefer-pascal-case': RuleConfig<[]>;
}

interface UseStorybookExpectRule {
  'use-storybook-expect': RuleConfig<[]>;
}

interface UseStorybookTestingLibraryRule {
  'use-storybook-testing-library': RuleConfig<[]>;
}

export type StorybookRules = AwaitInteractionsRule
  & ContextInPlayFunctionRule
  & CsfComponentsRule
  & DefaultExportsRule
  & HierarchySeparatorRule
  & MetaInlinePropertiesRule
  & NoRedundantStoryNameRule
  & NoStoriesOfRule
  & NoTitlePropertyInMetaRule
  & NoUninstalledAddonRule
  & PreferPascalCaseRule
  & StoryExportsRule
  & UseStorybookExpectRule
  & UseStorybookTestingLibraryRule;
