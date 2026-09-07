import type { OptionsSlop, TypedFlatConfigItem } from '../types';
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

  const settings = {
    ...(cwd ? { cwd } : {}),
    ...(inspection ? { inspection } : {}),
  };

  return [
    {
      files: [GLOB_SRC, GLOB_VUE],
      name: 'rotki/slop/rules',
      plugins: {
        slop: pluginSlop,
      },
      // Each rule also accepts these per-rule; setting them here applies to all of them.
      ...(Object.keys(settings).length > 0 ? { settings: { slop: settings } } : {}),
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
    },
  ];
}
