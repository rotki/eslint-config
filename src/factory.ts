import type { Linter } from 'eslint';
import type { RuleOptions } from './typegen';
import type { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from './types';
import { FlatConfigComposer } from 'eslint-flat-config-utils';
import { isPackageExists } from 'local-pkg';
import {
  comments,
  cypress,
  disables,
  formatters,
  ignores,
  imports,
  javascript,
  jsonc,
  markdown,
  node,
  perfectionist,
  regexp,
  rotkiPlugin,
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
import { pnpmCatalogs } from './configs/pnpm-catalogs';
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
  'import-x': 'import',
  'n': 'node',
  'vitest': 'test',
  'yml': 'yaml',
};

/**
 * Construct an array of ESLint flat config items.
 */

export function rotki(
  options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.FlatConfig[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    autoRenamePlugins = true,
    componentExts = [],
    cypress: enableCypress,
    gitignore: enableGitignore = true,
    pnpmCatalogs: enablePnpmCatalogs = false,
    regexp: enableRegexp = false,
    rotki: enableRotki,
    storybook: enableStorybook,
    typescript: enableTypeScript = isPackageExists('typescript'),
    unicorn: enableUnicorn = true,
    vue: enableVue = VuePackages.some(i => isPackageExists(i)),
    vueI18n: enableVueI18n,
  } = options;

  let isInEditor = options.isInEditor;
  if (isInEditor === null) {
    isInEditor = isInEditorEnv();
    if (isInEditor) {
      // eslint-disable-next-line no-console
      console.log('[@rotki/eslint-config] Detected running in editor, some rules are disabled.');
    }
  }

  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === 'object'
      ? options.stylistic
      : {};

  if (stylisticOptions && !('jsx' in stylisticOptions)) {
    stylisticOptions.jsx = options.jsx ?? true;
  }

  const configs: Awaitable<TypedFlatConfigItem[]>[] = [];

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean') {
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
        name: 'rotki/gitignore',
        ...enableGitignore,
      })]));
    }
    else {
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r({
        name: 'rotki/gitignore',
        strict: false,
      })]));
    }
  }

  const typescriptOptions = resolveSubOptions(options, 'typescript');

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

    // Optional plugins (installed but not enabled by default)
    perfectionist(),
  );

  if (enableUnicorn) {
    configs.push(unicorn(enableUnicorn === true ? {} : enableUnicorn));
  }

  if (enableVue) {
    componentExts.push('vue');
  }

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

  if (enableVue) {
    configs.push(vue({
      ...resolveSubOptions(options, 'vue'),
      overrides: getOverrides(options, 'vue'),
      stylistic: stylisticOptions,
      typescript: !!enableTypeScript,
    }));
  }

  if (enableCypress) {
    configs.push(cypress({
      ...resolveSubOptions(options, 'cypress'),
      overrides: getOverrides(options, 'cypress'),
      typescript: !!enableTypeScript,
    }));
  }

  if (enableRotki) {
    configs.push(rotkiPlugin({
      overrides: getOverrides(options, 'rotki'),
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

  if (enablePnpmCatalogs) {
    configs.push(
      pnpmCatalogs(),
    );
  }

  if (options.yaml ?? true) {
    configs.push(yaml({
      overrides: getOverrides(options, 'yaml'),
      stylistic: stylisticOptions,
    }));
  }

  if (options.markdown ?? true) {
    configs.push(
      markdown(
        {
          componentExts,
          overrides: getOverrides(options, 'markdown'),
        },
      ),
    );
  }

  if (options.formatters) {
    configs.push(formatters(
      options.formatters,
      typeof stylisticOptions === 'boolean' ? {} : stylisticOptions,
    ));
  }

  configs.push(disables());

  if ('files' in options) {
    throw new Error('[@rotki/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.');
  }

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

  if (autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming);
  }

  if (isInEditor) {
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
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key);
  return {
    ...'overrides' in sub
      ? sub.overrides
      : {},
  } as any; // We need to cast to any otherwise we get a bunch of TS errors on dts generation;
}
