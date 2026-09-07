import type { Linter } from 'eslint';
import type { Awaitable, ConfigNames, OptionsConfig, StylisticConfig, TypedFlatConfigItem } from './types';
import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { findUpSync } from 'find-up-simple';
import { isPackageExists } from 'local-pkg';

import {
  comments,
  disables,
  e18e,
  formatters,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  perfectionist,
  regexp,
  rotkiPlugin,
  slop,
  sonarjs,
  sortPackageJson,
  sortTsconfig,
  storybook,
  stylistic,
  test,
  typescript,
  unicorn,
  vue,
  vueI18n,
  yaml,
} from './configs';
import { pnpm } from './configs/pnpm';
import { GLOB_MARKDOWN } from './globs';
import { interopDefault, isInEditorEnv } from './utils';

const flatConfigProps = [
  'name',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings',
] satisfies (keyof TypedFlatConfigItem)[];

const VuePackages = [
  'vue',
  'nuxt',
  'vitepress',
  '@slidev/cli',
];

export const defaultPluginRenaming = {
  'import-lite': 'import',
  'n': 'node',
  'vitest': 'test',
  'yml': 'yaml',
};

interface ResolvedConfig {
  autoRenamePlugins: boolean;
  componentExts: string[];
  enableE18e: OptionsConfig['e18e'];
  enableGitignore: OptionsConfig['gitignore'];
  enablePerfectionist: boolean;
  enablePnpm: boolean;
  enableRegexp: OptionsConfig['regexp'];
  enableRotki: OptionsConfig['rotki'];
  enableStorybook: OptionsConfig['storybook'];
  enableTypeScript: OptionsConfig['typescript'];
  enableUnicorn: OptionsConfig['unicorn'];
  enableVue: boolean;
  enableVueI18n: OptionsConfig['vueI18n'];
  isInEditor: boolean;
  stylisticOptions: StylisticConfig | false;
  typescriptOptions: ResolvedOptions<OptionsConfig['typescript']>;
}

function resolveStylisticOptions(options: OptionsConfig, jsx: boolean): StylisticConfig | false {
  if (options.stylistic === false)
    return false;

  const stylisticOptions = typeof options.stylistic === 'object' ? options.stylistic : {};

  if (!('jsx' in stylisticOptions))
    stylisticOptions.jsx = jsx;

  return stylisticOptions;
}

function resolveEnableFlags(options: OptionsConfig): Pick<ResolvedConfig, 'autoRenamePlugins' | 'enableE18e' | 'enableGitignore' | 'enablePerfectionist' | 'enablePnpm' | 'enableRegexp' | 'enableRotki' | 'enableStorybook' | 'enableUnicorn' | 'enableVueI18n'> {
  return {
    autoRenamePlugins: options.autoRenamePlugins ?? true,
    enableE18e: options.e18e ?? true,
    enableGitignore: options.gitignore ?? true,
    enablePerfectionist: !!(options.perfectionist ?? true),
    enablePnpm: !!(options.pnpm ?? findUpSync('pnpm-workspace.yaml')),
    enableRegexp: options.regexp ?? false,
    enableRotki: options.rotki,
    enableStorybook: options.storybook,
    enableUnicorn: options.unicorn ?? true,
    enableVueI18n: options.vueI18n,
  };
}

function resolveIsInEditor(options: OptionsConfig): boolean {
  let isInEditor = options.isInEditor;
  if (isInEditor === null) {
    isInEditor = isInEditorEnv();
    if (isInEditor) {
      // eslint-disable-next-line no-console -- the editor detection is worth announcing once, and a config has no logger of its own
      console.log('[@rotki/eslint-config] Detected running in editor, some rules are disabled.');
    }
  }
  return !!isInEditor;
}

function resolveOptions(options: OptionsConfig): ResolvedConfig {
  const jsx = options.jsx ?? true;
  const enableVue = !!(options.vue ?? VuePackages.some(i => isPackageExists(i)));

  return {
    ...resolveEnableFlags(options),
    componentExts: [...(options.componentExts ?? []), ...(enableVue ? ['vue'] : [])],
    enableTypeScript: options.typescript ?? (isPackageExists('typescript') || isPackageExists('@typescript/native-preview')),
    enableVue,
    isInEditor: resolveIsInEditor(options),
    stylisticOptions: resolveStylisticOptions(options, jsx),
    typescriptOptions: resolveSubOptions(options, 'typescript'),
  };
}

function buildLanguageConfigs(configs: Awaitable<TypedFlatConfigItem[]>[], options: OptionsConfig, resolved: ResolvedConfig): void {
  const { enableE18e, enableGitignore, enablePerfectionist, enableUnicorn, isInEditor, stylisticOptions } = resolved;

  if (enableGitignore) {
    const gitignoreOptions = typeof enableGitignore !== 'boolean' ? enableGitignore : { strict: false };
    configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
      name: 'rotki/gitignore',
      ...gitignoreOptions,
    })]));
  }

  // Base configs
  configs.push(
    ignores(options.ignores),
    javascript({
      isInEditor,
      overrides: getOverrides(options, 'javascript'),
    }),
    comments(),
    node(),
    imports({
      overrides: getOverrides(options, 'imports'),
      stylistic: stylisticOptions,
    }),
  );

  if (enablePerfectionist) {
    configs.push(perfectionist({
      overrides: getOverrides(options, 'perfectionist'),
    }));
  }

  if (enableUnicorn) {
    configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn));
  }

  if (enableE18e) {
    configs.push(e18e({
      ...(typeof enableE18e === 'boolean' ? {} : enableE18e),
      isInEditor,
      type: options.type,
    }));
  }
}

function buildQualityConfigs(configs: Awaitable<TypedFlatConfigItem[]>[], options: OptionsConfig, resolved: ResolvedConfig): void {
  if (options.jsdoc ?? true) {
    configs.push(jsdoc({
      ...resolveSubOptions(options, 'jsdoc'),
      overrides: getOverrides(options, 'jsdoc'),
      stylistic: !!resolved.stylisticOptions,
    }));
  }

  if (options.slop) {
    configs.push(slop({
      ...resolveSubOptions(options, 'slop'),
      overrides: getOverrides(options, 'slop'),
    }));
  }

  if (options.sonarjs) {
    configs.push(sonarjs({
      ...resolveSubOptions(options, 'sonarjs'),
      overrides: getOverrides(options, 'sonarjs'),
    }));
  }
}

function buildTypeScriptAndStyleConfigs(configs: Awaitable<TypedFlatConfigItem[]>[], options: OptionsConfig, resolved: ResolvedConfig): void {
  const { componentExts, enableRegexp, enableTypeScript, isInEditor, stylisticOptions, typescriptOptions } = resolved;

  if (enableTypeScript) {
    configs.push(typescript({
      ...typescriptOptions,
      componentExts,
      isInEditor,
      overrides: getOverrides(options, 'typescript'),
      type: options.type,
    }));
  }

  if (stylisticOptions) {
    configs.push(stylistic({
      ...stylisticOptions,
      overrides: getOverrides(options, 'stylistic'),
    }));
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === 'boolean' ? {} : enableRegexp));
  }

  if (options.test ?? true) {
    configs.push(test({
      isInEditor,
      overrides: getOverrides(options, 'test'),
    }));
  }
}

function buildFrameworkConfigs(configs: Awaitable<TypedFlatConfigItem[]>[], options: OptionsConfig, resolved: ResolvedConfig): void {
  const { enableRotki, enableStorybook, enableTypeScript, enableVue, enableVueI18n, stylisticOptions } = resolved;

  if (enableVue) {
    configs.push(vue({
      ...resolveSubOptions(options, 'vue'),
      overrides: getOverrides(options, 'vue'),
      stylistic: stylisticOptions,
      typescript: !!enableTypeScript,
    }));
  }

  if (enableRotki) {
    configs.push(rotkiPlugin({
      ...resolveSubOptions(options, 'rotki'),
      overrides: getOverrides(options, 'rotki'),
      stylistic: stylisticOptions,
      typescript: !!enableTypeScript,
    }));
  }

  if (enableVueI18n) {
    configs.push(vueI18n({
      ...resolveSubOptions(options, 'vueI18n'),
      overrides: getOverrides(options, 'vueI18n'),
      typescript: !!enableTypeScript,
    }));
  }

  if (enableStorybook) {
    configs.push(storybook({
      overrides: getOverrides(options, 'storybook'),
    }));
  }
}

function buildFileFormatConfigs(configs: Awaitable<TypedFlatConfigItem[]>[], options: OptionsConfig, resolved: ResolvedConfig): void {
  const { componentExts, enablePnpm, isInEditor, stylisticOptions } = resolved;

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, 'jsonc'),
        stylistic: stylisticOptions,
      }),
      sortPackageJson(),
      sortTsconfig(),
    );
  }

  if (enablePnpm) {
    configs.push(
      pnpm({
        isInEditor,
        json: options.jsonc !== false,
        yaml: options.yaml !== false,
        ...resolveSubOptions(options, 'pnpm'),
      }),
    );
  }

  if (options.yaml ?? true) {
    configs.push(yaml({
      overrides: getOverrides(options, 'yaml'),
      stylistic: stylisticOptions,
    }));
  }

  if (options.markdown ?? true) {
    configs.push(markdown({
      componentExts,
      overrides: getOverrides(options, 'markdown'),
    }));
  }

  if (options.formatters) {
    configs.push(formatters(
      options.formatters,
      typeof stylisticOptions === 'boolean' ? {} : stylisticOptions,
    ));
  }
}

function finalizeComposer(
  configs: Awaitable<TypedFlatConfigItem[]>[],
  options: OptionsConfig & Omit<TypedFlatConfigItem, 'files' | 'ignores'>,
  resolved: ResolvedConfig,
  userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.FlatConfig[]>[],
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options) {
      acc[key] = options[key] as any;
    }
    return acc;
  }, {} as TypedFlatConfigItem);
  if (Object.keys(fusedConfig).length > 0) {
    configs.push([fusedConfig]);
  }

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

  composer = composer.append(
    ...configs,
    ...userConfigs as any,
  );

  // Scope rules without explicit `files` away from markdown files, so that
  // JS-only rules (including user overrides) don't run against the markdown
  // `SourceCode`, which lacks methods like `getAllComments()`.
  if (options.markdown ?? true) {
    composer = composer.setDefaultIgnores(prev => [...prev, GLOB_MARKDOWN]);
  }

  if (resolved.autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming);
  }

  if (resolved.isInEditor) {
    composer = composer
      .disableRulesFix([
        'unused-imports/no-unused-imports',
        'test/no-only-tests',
        'prefer-const',
      ], {
        builtinRules: () => import(['eslint', 'use-at-your-own-risk'].join('/')).then(r => r.builtinRules),
      });
  }

  return composer;
}

/**
 * Construct an array of ESLint flat config items.
 */

export function rotki(
  options: OptionsConfig & Omit<TypedFlatConfigItem, 'files' | 'ignores'> = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.FlatConfig[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  if ('files' in options) {
    throw new Error('[@rotki/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.');
  }

  const resolved = resolveOptions(options);
  const configs: Awaitable<TypedFlatConfigItem[]>[] = [];

  buildLanguageConfigs(configs, options, resolved);
  buildQualityConfigs(configs, options, resolved);
  buildTypeScriptAndStyleConfigs(configs, options, resolved);
  buildFrameworkConfigs(configs, options, resolved);
  buildFileFormatConfigs(configs, options, resolved);

  configs.push(disables());

  return finalizeComposer(configs, options, resolved, userConfigs);
}

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean'
    ? {} as any
    : options[key] || {} as any;
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): TypedFlatConfigItem['rules'] {
  const sub = resolveSubOptions(options, key);
  return {
    ...'overrides' in sub
      ? sub.overrides
      : {},
  };
}
