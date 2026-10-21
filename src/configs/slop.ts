import type { OptionsSlop, TypedFlatConfigItem } from '../types';
import { resolve } from 'node:path';
import process from 'node:process';
import { GLOB_SRC, GLOB_VUE } from '../globs';
import { ensurePackages, interopDefault } from '../utils';

export async function slop(options: OptionsSlop = {}): Promise<TypedFlatConfigItem[]> {
  const {
    cwd,
    inspection,
    jargon = true,
    maximumWords = 50,
    overrides = {},
  } = options;

  await ensurePackages(['eslint-plugin-slop']);

  const [pluginSlop] = await Promise.all([
    interopDefault(import('eslint-plugin-slop')),
  ] as const);

  // The plugin ignores `settings.slop` unless `cwd` is a string, so an `inspection` passed
  // without it would silently fall back to whole files.
  const settings = {
    cwd: resolve(cwd ?? process.cwd()),
    ...(inspection ? { inspection } : {}),
  };

  return [
    {
      files: [GLOB_SRC, GLOB_VUE],
      name: 'rotki/slop/rules',
      plugins: {
        slop: pluginSlop,
      },
      rules: {
        // A comment long enough to need a word count is documentation in the wrong place.
        'slop/max-comment-length': ['error', { ignoreJSDoc: true, maximumWords }],
        // `x as unknown as T` launders one type into another with nothing checking the trip.
        'slop/no-chained-type-assertions': 'error',
        // Mechanises the writing rule that nothing else checks.
        'slop/no-em-dash': 'error',
        // An alias that resolves to `unknown` or a primitive names nothing.
        'slop/no-trivial-type-aliases': 'error',

        // Inflated vocabulary in prose: the tell that a comment was generated rather than written.
        ...(jargon ? { 'slop/no-jargon': 'error' } : {}),

        // Deliberately off:
        // - `prefer-jsdoc` overlaps the jsdoc config and is narrower than it.
        // - `no-static-only-class` is already covered by `unicorn/no-static-only-class`.
        // - `no-trivial-functions` fights the one-composable-per-file style.

        ...overrides,
      },
      // Each rule also accepts these per-rule; setting them here applies to all of them.
      settings: { slop: settings },
    },
  ];
}
