import type { TypedFlatConfigItem } from '../types';
import { pluginComments } from '../plugins';

export async function comments(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: 'rotki/eslint-comments/rules',
      plugins: {
        'eslint-comments': pluginComments,
      },
      rules: {
        'eslint-comments/disable-enable-pair': [
          'error',
          { allowWholeFile: true },
        ],
        'eslint-comments/no-aggregating-enable': 'error',
        'eslint-comments/no-duplicate-disable': 'error',
        'eslint-comments/no-unlimited-disable': 'error',
        'eslint-comments/no-unused-enable': 'error',
        // A suppression without a reason is a decision nobody can review later. Write it as
        // `-- why`, which is the shape the codebase already uses where it bothers.
        'eslint-comments/require-description': 'error',
      },
    },
  ];
}
