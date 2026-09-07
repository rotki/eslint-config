import type { OptionsJsdoc, TypedFlatConfigItem } from '../types';
import { GLOB_SRC, GLOB_TS, GLOB_VUE } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function jsdoc(options: OptionsJsdoc = {}): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    stylistic = true,
    tsdoc = true,
  } = options;

  await ensurePackages([tsdoc ? 'eslint-plugin-tsdoc' : undefined]);

  const [pluginJsdoc, pluginTsdoc] = await Promise.all([
    interopDefault(import('eslint-plugin-jsdoc')),
    tsdoc ? interopDefault(import('eslint-plugin-tsdoc')) : undefined,
  ] as const);

  const configs: TypedFlatConfigItem[] = [
    {
      name: 'rotki/jsdoc/setup',
      plugins: {
        jsdoc: pluginJsdoc,
      },
    },
    {
      files: [GLOB_SRC, GLOB_VUE],
      name: 'rotki/jsdoc/rules',
      rules: {
        // A renamed parameter leaves its tag behind, still describing the old name.
        'jsdoc/check-access': 'error',
        'jsdoc/check-param-names': ['error', { checkDestructured: false }],
        'jsdoc/check-property-names': 'error',
        // A modifier tag carrying prose is prose nothing will read.
        'jsdoc/empty-tags': 'error',
        'jsdoc/escape-inline-tags': 'error',
        'jsdoc/implements-on-classes': 'error',
        // A doc whose words only restate the identifier is the shape worth removing.
        'jsdoc/informative-docs': 'error',
        // `/* @param */` with one asterisk is not a doc block, and nothing reads it as one.
        'jsdoc/no-bad-blocks': 'error',
        // Tags with nothing above them: the block documents its parts and not the thing itself.
        'jsdoc/no-blank-block-descriptions': 'error',
        'jsdoc/no-blank-blocks': 'error',
        'jsdoc/no-multi-asterisks': 'error',
        // `{Type}` duplicates the TypeScript signature and drifts from it silently.
        'jsdoc/no-types': 'error',
        // A bare `@param name` restates the signature. Tag it only to say what the signature cannot.
        'jsdoc/require-param-description': 'error',
        'jsdoc/require-param-name': 'error',
        'jsdoc/require-property': 'error',
        'jsdoc/require-property-description': 'error',
        'jsdoc/require-property-name': 'error',
        'jsdoc/require-returns-check': 'error',
        'jsdoc/require-returns-description': 'error',
        'jsdoc/require-yields-check': 'error',

        ...(stylistic
          ? {
              'jsdoc/check-alignment': 'error',
              'jsdoc/require-asterisk-prefix': 'error',
              // `@param name - description`, which is what TSDoc parses.
              'jsdoc/require-hyphen-before-param-description': 'error',
            }
          : {}),

        ...overrides,
      },
    },
  ];

  if (tsdoc) {
    configs.push({
      files: [GLOB_TS, GLOB_VUE],
      name: 'rotki/jsdoc/tsdoc',
      plugins: {
        tsdoc: pluginTsdoc,
      },
      rules: {
        // A `/** */` block is only TSDoc if it parses as TSDoc. Unvalidated, blocks drift into
        // JSDoc: `@param {Type}` duplicating the TypeScript type, `@return` for `@returns`.
        'tsdoc/syntax': 'error',
      },
    });
  }

  return configs;
}
