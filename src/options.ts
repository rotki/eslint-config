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
     * @default true
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
   * @default locales
   */
  localesDirectory?: string;
  /**
   * Optional configuration for @intlify/vue-i18n/no-raw-text rule
   */
  noRawTextIgnores?: VueI18nNoRawTextIgnores;
}

export interface OptionsRotkiPlugin extends OptionsOverrides {
  /** Key patterns ignored by @rotki/no-unused-i18n-keys */
  ignoreKeys?: string[];
  /** @default 'src' */
  src?: string;
}

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem['rules'];
}

export interface OptionsProjectType {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default 'app'
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
     * Additional extensions for components.
     *
     * @example ['vue']
     * @default []
     */
  componentExts?: string[];
}

export interface OptionsMarkdown extends OptionsOverrides {
  /**
   * Use GitHub Flavored Markdown
   *
   * @default true
   */
  gfm?: boolean;

  /**
   * Override rules for markdown source files.
   */
  overridesMarkdown?: TypedFlatConfigItem['rules'];
}

export interface OptionsE18e extends OptionsOverrides {
  /**
   * Enable modernization rules.
   *
   * @default true
   */
  modernization?: boolean;

  /**
   * Enable module replacement rules.
   *
   * @default true when `type === 'lib'` and `isInEditor`
   */
  moduleReplacements?: boolean;

  /**
   * Enable performance improvement rules.
   *
   * @default true
   */
  performanceImprovements?: boolean;
}

export interface OptionsUnicorn {
  /**
   * Include all rules recommended by `eslint-plugin-unicorn`, instead of only ones picked by Anthony.
   *
   * @default false
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
     * @default ['**\/*.{ts,tsx}']
     */
  filesTypeAware?: string[];

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
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
  extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'jsx' | 'semi'> {
}

export interface OptionsIsInEditor {
  isInEditor?: boolean;
}

export interface OptionsPnpm extends OptionsIsInEditor {
  /** Requires catalogs usage. Detects automatically based on pnpm-workspace.yaml */
  catalogs?: boolean;
  /** Enable linting for package.json @default true */
  json?: boolean;
  /** Enable linting for pnpm-workspace.yaml @default true */
  yaml?: boolean;
  /** Sort entries in pnpm-workspace.yaml @default false */
  sort?: boolean;
}
