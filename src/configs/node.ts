import { pluginNode } from '../plugins';
import type { FlatConfigItem } from '../types';

export function node(): FlatConfigItem[] {
  return [
    {
      plugins: {
        node: pluginNode,
      },
      rules: {
        'node/handle-callback-err': ['error', '^(err|error)$'],
        'node/no-deprecated-api': 'error',
        'node/no-exports-assign': 'error',
        'node/no-new-require': 'error',
        'node/no-path-concat': 'error',
        'node/prefer-global/buffer': ['warn', 'never'],
        'node/prefer-global/process': ['warn', 'never'],
        'node/process-exit-as-throw': 'error',
      },
    },
  ];
}
