import type { OptionsConfig } from './types';

export const CONFIG_PRESET_FULL_ON: OptionsConfig = {
  formatters: true,
  gitignore: true,
  imports: {},
  jsonc: true,
  jsx: true,
  markdown: true,
  pnpm: true,
  regexp: true,
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
  jsonc: false,
  jsx: false,
  markdown: false,
  pnpm: false,
  regexp: false,
  stylistic: false,
  test: false,
  typescript: false,
  unicorn: false,
  vue: false,
  yaml: false,
};
