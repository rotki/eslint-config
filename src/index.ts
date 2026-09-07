import { rotki } from './factory';

export * from './config-presets';

export * from './configs';

export * from './factory';

export * from './globs';

export * from './types';

export * from './utils';

// eslint-disable-next-line import/no-default-export -- the factory is this package's entry point, and consumers write `import rotki from '@rotki/eslint-config'`
export default rotki;
