import type { Linter } from 'eslint';
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import type { ConfigWithExtends } from 'eslint-flat-config-utils';
import type {
  OptionsComponentExts,
  OptionsE18e,
  OptionsFormatters,
  OptionsJsdoc,
  OptionsMarkdown,
  OptionsOverrides,
  OptionsPnpm,
  OptionsProjectType,
  OptionsRegExp,
  OptionsRotkiPlugin,
  OptionsTypescript,
  OptionsUnicorn,
  OptionsVue,
  OptionsVueI18n,
  StylisticConfig,
} from './options';
import type { ConfigNames, RuleOptions } from './typegen';

export type {
  OptionsComponentExts,
  OptionsE18e,
  OptionsFiles,
  OptionsFormatters,
  OptionsHasTypeScript,
  OptionsIsInEditor,
  OptionsJsdoc,
  OptionsMarkdown,
  OptionsOverrides,
  OptionsPnpm,
  OptionsProjectType,
  OptionsRegExp,
  OptionsRotkiPlugin,
  OptionsStylistic,
  OptionsTypescript,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptWithTypes,
  OptionsUnicorn,
  OptionsVue,
  OptionsVueI18n,
  StylisticConfig,
} from './options';

export type Awaitable<T> = T | Promise<T>;

export interface Rules extends RuleOptions {}

export type { ConfigNames };

export type TypedFlatConfigItem = Omit<ConfigWithExtends, 'plugins' | 'rules'> & {
  // Relax plugins type limitation, as most of the plugins did not have correct type info yet.
  /**
   * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>;
  /**
   * An object containing the configured rules. When `files` or `ignores` are specified, these rule configurations are only available to the matching files.
   */
  rules?: Linter.RulesRecord & Rules;
};

export interface OptionsConfig extends OptionsComponentExts, OptionsProjectType {
  /**
   * Enable gitignore support.
   *
   * Passing an object to configure the options.
   *
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   * @defaultValue true
   */
  gitignore?: boolean | FlatGitignoreOptions;

  /**
   * Disable some opinionated rules to Anthony's preference.
   *
   * Including:
   * - `antfu/top-level-function`
   * - `antfu/if-newline`
   *
   * @defaultValue false
   */
  lessOpinionated?: boolean;

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides;

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @defaultValue auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypescript;

  /**
   * Enable JSX related rules.
   *
   * Currently only stylistic rules are included.
   *
   * @defaultValue true
   */
  jsx?: boolean;

  /**
   * Core rules. Can't be disabled;
   */
  imports?: OptionsOverrides;

  /**
   * Options for eslint-plugin-unicorn.
   *
   * @defaultValue true
   */
  unicorn?: boolean | OptionsUnicorn;

  /**
   * Enable test support.
   *
   * @defaultValue true
   */
  test?: boolean | OptionsOverrides;

  /**
   * Enable Vue support.
   *
   * @defaultValue auto-detect based on the dependencies
   */
  vue?: boolean | OptionsVue;

  /**
   * Enable doc-comment linting for JSDoc and TSDoc blocks.
   *
   * `tsdoc/syntax` comes with it and requires installing:
   * - `eslint-plugin-tsdoc`
   *
   * @defaultValue true
   */
  jsdoc?: boolean | OptionsJsdoc;

  /**
   * Enable JSONC support.
   *
   * @defaultValue true
   */
  jsonc?: boolean | OptionsOverrides;

  /**
   * Enable YAML support.
   *
   * @defaultValue true
   */
  yaml?: boolean | OptionsOverrides;

  /**
   * Enable linting for **code snippets** in Markdown.
   *
   * For formatting Markdown content, enable also `formatters.markdown`.
   *
   * @defaultValue true
   */
  markdown?: boolean | OptionsMarkdown;

  /**
   * Enable stylistic rules.
   *
   * @see https://eslint.style/
   * @defaultValue true
   */
  stylistic?: boolean | StylisticConfig;

  /**
   * Enable perfectionist (imports/exports sorting) rules.
   *
   * @see https://github.com/azat-io/eslint-plugin-perfectionist
   * @defaultValue true
   */
  perfectionist?: boolean | OptionsOverrides;

  /**
   * Enable regexp rules.
   *
   * @see https://ota-meshi.github.io/eslint-plugin-regexp/
   * @defaultValue true
   */
  regexp?: boolean | (OptionsRegExp & OptionsOverrides);

  /**
   * Additional ignore patterns, or a function that receives the default ignores and returns custom ignores.
   */
  ignores?: string[] | ((originals: string[]) => string[]);

  /**
   * Enable pnpm (workspace/catalogs) support.
   * Auto-detected based on pnpm-workspace.yaml presence.
   *
   * @see https://github.com/antfu/pnpm-workspace-utils
   * @defaultValue auto-detect
   */
  pnpm?: boolean | OptionsPnpm;

  /**
   * Use external formatters to format files.
   *
   * Requires installing:
   * - `eslint-plugin-format`
   *
   * When set to `true`, it will enable all formatters.
   *
   * @defaultValue false
   */
  formatters?: boolean | OptionsFormatters;

  /**
   * Enable rotki linting
   * Requires installing:
   * - `@rotki/eslint-plugin`
   *
   * @defaultValue false
   */
  rotki?: boolean | OptionsRotkiPlugin;

  /**
   * Enable vue-i18n linting support.
   * Requires installing:
   * - `@intlify/eslint-plugin-vue-i18n`
   *
   * @defaultValue false
   */
  vueI18n?: boolean | OptionsVueI18n;

  /**
   * Enable e18e rules for modernization and performance.
   *
   * @defaultValue true
   */
  e18e?: boolean | OptionsE18e;

  /**
   * Enable storybook linting support
   *
   * Requires installing:
   * - `eslint-plugin-storybook`
   *
   * @defaultValue false
   */
  storybook?: boolean | OptionsOverrides;

  /**
   * Control to disable some rules in editors.
   * @defaultValue auto-detect based on the process.env
   */
  isInEditor?: boolean;

  /**
   * Automatically rename plugins in the config.
   *
   * @defaultValue true
   */
  autoRenamePlugins?: boolean;
}
