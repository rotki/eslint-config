import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';
import type { ParserOptions } from '@typescript-eslint/parser';
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks';
import type { TypedFlatConfigItem } from './types';
import type { VendoredPrettierOptions } from './vendor/prettier';

export type OptionsTypescript = (OptionsTypeScriptWithTypes & OptionsOverrides) | (OptionsTypeScriptParserOptions & OptionsOverrides);

export interface OptionsFormatters {
  /**
   * Enable formatting support for CSS, Less, Sass, and SCSS.
   *
   * Currently only support Prettier.
   */
  css?: 'prettier' | boolean;

  /**
   * Enable formatting support for HTML.
   *
   * Currently only support Prettier.
   */
  html?: 'prettier' | boolean;

  /**
   * Enable formatting support for XML.
   *
   * Currently only support Prettier.
   */
  xml?: 'prettier' | boolean;

  /**
   * Enable formatting support for Markdown.
   *
   * Support both Prettier and dprint.
   *
   * When set to `true`, it will use Prettier.
   */
  markdown?: 'prettier' | 'dprint' | boolean;

  /**
   * Custom options for Prettier.
   *
   * By default it's controlled by our own config.
   */
  prettierOptions?: VendoredPrettierOptions;

  /**
   * Custom options for dprint.
   *
   * By default it's controlled by our own config.
   */
  dprintOptions?: boolean;
}

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[];
}

export interface OptionsVue extends OptionsOverrides {
  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @defaultValue true
   */
  sfcBlocks?: boolean | VueBlocksOptions;
}

interface VueI18nNoRawTextIgnores {
  nodes?: string[];
  pattern?: string;
  text?: string[];
}

export interface OptionsVueI18n extends OptionsOverrides {
  /**
   * The source directory where of the project where vue-i18n is setup.
   */
  src?: string;
  /**
   * The locales directory under the source directory
   *
   * @defaultValue locales
   */
  localesDirectory?: string;
  /**
   * Optional configuration for the `@intlify/vue-i18n/no-raw-text` rule
   */
  noRawTextIgnores?: VueI18nNoRawTextIgnores;
}

export interface OptionsRotkiPlugin extends OptionsOverrides {
  /** Key patterns ignored by `@rotki/no-unused-i18n-keys` */
  ignoreKeys?: string[];
  /** @defaultValue 'src' */
  src?: string;
}

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem['rules'];
}

export interface OptionsProjectType {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @defaultValue 'app'
   */
  type?: 'app' | 'lib';
}

export interface OptionsRegExp {
  /**
   * Override rulelevels
   */
  level?: 'error' | 'warn';
}

export interface OptionsComponentExts {
  /**
   * File extensions linted as components alongside the source globs.
   *
   * @example ['vue']
   * @defaultValue []
   */
  componentExts?: string[];
}

export interface OptionsMarkdown extends OptionsOverrides {
  /**
   * Use GitHub Flavored Markdown
   *
   * @defaultValue true
   */
  gfm?: boolean;

  /**
   * Override rules for markdown source files.
   */
  overridesMarkdown?: TypedFlatConfigItem['rules'];
}

export interface OptionsJsdoc extends OptionsOverrides, OptionsStylistic {
  /**
   * Validate that doc comments parse as TSDoc.
   *
   * Requires installing:
   * - `eslint-plugin-tsdoc`
   *
   * @defaultValue true
   */
  tsdoc?: boolean;
}

export interface OptionsSonarjs extends OptionsOverrides {
  /**
   * Report functions above this cognitive complexity score.
   *
   * Off by default, for two reasons: on an existing tree it produces a backlog that has to
   * be scheduled rather than absorbed, and the javascript config already gates functions on
   * cyclomatic `complexity` (max 10). The two measure different things, so this is a second
   * gate rather than a replacement: cyclomatic counts branches and treats flat and nested
   * code alike, cognitive charges extra for each level of nesting and reads a wide `switch`
   * as simple. Turn it on to catch deep nesting that stays under the branch count.
   *
   * SonarJS itself defaults to 15.
   *
   * @defaultValue false
   */
  cognitiveComplexity?: number | false;

  /**
   * Enable the rules that report code which can be written more directly:
   * collapsible ifs, redundant booleans, single-boolean returns.
   *
   * @defaultValue true
   */
  simplification?: boolean;
}

export interface OptionsE18e extends OptionsOverrides {
  /**
   * Enable modernization rules.
   *
   * @defaultValue true
   */
  modernization?: boolean;

  /**
   * Enable module replacement rules.
   *
   * @defaultValue true when `type === 'lib'` and `isInEditor`
   */
  moduleReplacements?: boolean;

  /**
   * Enable performance improvement rules.
   *
   * @defaultValue true
   */
  performanceImprovements?: boolean;
}

export interface OptionsUnicorn {
  /**
   * Include all rules recommended by `eslint-plugin-unicorn`, instead of only ones picked by Anthony.
   *
   * @defaultValue false
   */
  allRecommended?: boolean;
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>;

  /**
   * Glob patterns for files that should be type aware.
   * @defaultValue `['**\/*.{ts,tsx}']`
   */
  filesTypeAware?: string[];

  /**
   * Glob patterns for files that should not be type aware.
   * @defaultValue `['**\/*.md\/**', '**\/*.astro/*.ts']`
   */
  ignoresTypeAware?: string[];
}

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string;

  /**
   * Override type-aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem['rules'];
}

export interface OptionsHasTypeScript {
  typescript?: boolean;
}

export interface OptionsStylistic {
  stylistic?: boolean | StylisticConfig;
}

export interface StylisticConfig
  extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'jsx' | 'semi' | 'braceStyle'> {
}

export interface OptionsIsInEditor {
  isInEditor?: boolean;
}

export interface OptionsPnpm extends OptionsIsInEditor {
  /** Requires catalogs usage. Detects automatically based on pnpm-workspace.yaml */
  catalogs?: boolean;
  /**
   * Enable linting for package.json
   *
   * @defaultValue true
   */
  json?: boolean;
  /**
   * Enable linting for pnpm-workspace.yaml
   *
   * @defaultValue true
   */
  yaml?: boolean;
  /**
   * Sort entries in pnpm-workspace.yaml
   *
   * @defaultValue false
   */
  sort?: boolean;
}
