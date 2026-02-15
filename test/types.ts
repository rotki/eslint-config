import type { Linter } from 'eslint';
import type { TypedFlatConfigItem } from '../src';

// TypedFlatConfigItem should be assignable to Linter.Config
((): Linter.Config => ({}) as TypedFlatConfigItem)();
