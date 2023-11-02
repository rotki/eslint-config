import { pluginComments } from '../plugins';
import type { FlatConfigItem } from '../types';

export function comments(): FlatConfigItem[] {
  return [
    {
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
      },
    },
  ];
}
