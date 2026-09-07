import type { OptionsConfig } from './types';

export const CONFIG_PRESET_FULL_ON: OptionsConfig = {
  formatters: true,
  gitignore: true,
  imports: {},
  jsdoc: true,
  jsonc: true,
  jsx: true,
  markdown: true,
  pnpm: true,
  regexp: true,
  sonarjs: true,
  stylistic: true,
  test: true,
  typescript: true,
  unicorn: true,
  vue: true,
  yaml: true,
};

export const CONFIG_PRESET_FULL_OFF: OptionsConfig = {
  formatters: false,
  gitignore: false,
  jsdoc: false,
  jsonc: false,
  jsx: false,
  markdown: false,
  pnpm: false,
  regexp: false,
  sonarjs: false,
  stylistic: false,
  test: false,
  typescript: false,
  unicorn: false,
  vue: false,
  yaml: false,
};
