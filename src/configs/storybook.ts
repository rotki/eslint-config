import { ensurePackages, interopDefault } from '../utils';
import { GLOB_SRC_EXT } from '../globs';
import type { OptionsOverrides, TypedFlatConfigItem } from '../types';

export async function storybook(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = { },
  } = options;

  await ensurePackages(['eslint-plugin-storybook']);

  const [pluginStorybook] = await Promise.all([
    interopDefault(import('eslint-plugin-storybook')),
  ] as const);

  return [
    {
      name: 'rotki/storybook/setup',
      plugins: {
        storybook: pluginStorybook,
      },
    },
    {
      files: [
        `*.stories.${GLOB_SRC_EXT}`,
        `*.story.${GLOB_SRC_EXT}`,
      ],
      name: 'rotki/storybook/rules',
      rules: {
        'import/no-anonymous-default-export': 'off',
        'storybook/await-interactions': 'error',
        'storybook/context-in-play-function': 'error',
        'storybook/default-exports': 'error',
        'storybook/hierarchy-separator': 'warn',
        'storybook/no-redundant-story-name': 'warn',
        'storybook/prefer-pascal-case': 'warn',
        'storybook/story-exports': 'error',
        'storybook/use-storybook-expect': 'error',
        'storybook/use-storybook-testing-library': 'error',

        ...overrides,
      },
    },
    {
      files: [`.storybook/main.${GLOB_SRC_EXT}`],
      name: 'rotki/storybook/main',
      rules: {
        'storybook/no-uninstalled-addons': 'error',
      },
    },
  ];
}
