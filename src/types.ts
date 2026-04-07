import type { Linter } from 'eslint';
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore';
import type { ConfigWithExtends } from 'eslint-flat-config-utils';
import type {
  OptionsE18e,
  OptionsFormatters,
  OptionsMarkdown,
  OptionsOverrides,
  OptionsPnpm,
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

export interface OptionsConfig {
  /**
     * Enable gitignore support.
     *
     * Passing an object to configure the options.
     *
     * @see https://github.com/antfu/eslint-config-flat-gitignore
     * @default true
     */
  gitignore?: boolean | FlatGitignoreOptions;

  /**
   * Disable some opinionated rules to Anthony's preference.
   *
   * Including:
   * - `antfu/top-level-function`
   * - `antfu/if-newline`
   *
   * @default false
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
     * @default auto-detect based on the dependencies
     */
  typescript?: boolean | OptionsTypescript;

  /**
     * Enable JSX related rules.
     *
     * Currently only stylistic rules are included.
     *
     * @default true
     */
  jsx?: boolean;

  /**
   * Core rules. Can't be disabled;
   */
  imports?: OptionsOverrides;

  /**
   * Options for eslint-plugin-unicorn.
   *
   * @default true
   */
  unicorn?: boolean | OptionsUnicorn;

  /**
     * Enable test support.
     *
     * @default true
     */
  test?: boolean | OptionsOverrides;

  /**
     * Enable Vue support.
     *
     * @default auto-detect based on the dependencies
     */
  vue?: boolean | OptionsVue;

  /**
     * Enable JSONC support.
     *
     * @default true
     */
  jsonc?: boolean | OptionsOverrides;

  /**
     * Enable YAML support.
     *
     * @default true
     */
  yaml?: boolean | OptionsOverrides;

  /**
     * Enable linting for **code snippets** in Markdown.
     *
     * For formatting Markdown content, enable also `formatters.markdown`.
     *
     * @default true
     */
  markdown?: boolean | OptionsMarkdown;

  /**
     * Enable stylistic rules.
     *
     * @see https://eslint.style/
     * @default true
     */
  stylistic?: boolean | StylisticConfig;

  /**
   * Enable regexp rules.
   *
   * @see https://ota-meshi.github.io/eslint-plugin-regexp/
   * @default true
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
   * @default auto-detect
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
   * @default false
   */
  formatters?: boolean | OptionsFormatters;

  /**
   * Enable rotki linting
   * Requires installing:
   * - `@rotki/eslint-plugin`
   *
   * @default false
   */
  rotki?: boolean | OptionsRotkiPlugin;

  /**
   * Enable vue-i18n linting support.
   * Requires installing:
   * - `@intlify/eslint-plugin-vue-i18n`
   *
   * @default false
   */
  vueI18n?: boolean | OptionsVueI18n;

  /**
   * Enable e18e rules for modernization and performance.
   *
   * @default true
   */
  e18e?: boolean | OptionsE18e;

  /**
   * Enable storybook linting support
   *
   * Requires installing
   * - `eslint-plugin-storybook
   */
  storybook?: boolean | OptionsOverrides;

  /**
     * Control to disable some rules in editors.
     * @default auto-detect based on the process.env
     */
  isInEditor?: boolean;

  /**
   * Automatically rename plugins in the config.
   *
   * @default true
   */
  autoRenamePlugins?: boolean;
}
