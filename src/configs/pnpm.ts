import type { TypedFlatConfigItem } from '../types';
import { interopDefault } from '../utils';

export async function pnpm(): Promise<TypedFlatConfigItem[]> {
  const [
    jsoncParser,
    yamlParser,
    pluginPnpm,
  ] = await Promise.all([
    interopDefault(import('jsonc-eslint-parser')),
    interopDefault(import('yaml-eslint-parser')),
    interopDefault(import('eslint-plugin-pnpm')),
  ]);

  return [
    {
      files: ['package.json', '**/package.json'],
      languageOptions: { parser: jsoncParser },
      name: 'rotki/pnpm/json',
      plugins: { pnpm: pluginPnpm },
      rules: {
        'pnpm/json-enforce-catalog': 'error',
        'pnpm/json-prefer-workspace-settings': 'error',
        'pnpm/json-valid-catalog': 'error',
      },
    },
    {
      files: ['pnpm-workspace.yaml'],
      languageOptions: { parser: yamlParser },
      name: 'rotki/pnpm/yaml',
      plugins: { pnpm: pluginPnpm },
      rules: {
        'pnpm/yaml-no-duplicate-catalog-item': 'error',
        'pnpm/yaml-no-unused-catalog-item': 'error',
      },
    },
  ];
}
