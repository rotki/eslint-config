import type { TypedFlatConfigItem } from '../types';
import { GLOB_EXCLUDE } from '../globs';

export async function ignores(userIgnores: string[] | ((originals: string[]) => string[]) = []): Promise<TypedFlatConfigItem[]> {
  return [{
    ignores: typeof userIgnores === 'function'
      ? userIgnores(GLOB_EXCLUDE)
      : [
          ...GLOB_EXCLUDE,
          ...userIgnores,
        ],
    name: 'rotki/ignores',
  }];
}
