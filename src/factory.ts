import process from 'node:process';
import fs from 'node:fs';
import { isPackageExists } from 'local-pkg';
import {
  comments,
  cypress,
  formatters,
  ignores,
  imports,
  javascript,
  jsonc,
  markdown,
  node,
  perfectionist,
  rotkiPlugin,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  test,
  typescript,
  unicorn,
  vue,
  vueI18n,
  vuetify,
  yaml,
} from './configs';
import { combine, interopDefault } from './utils';
import type { Awaitable, FlatConfigItem, OptionsConfig, UserConfigItem } from './types';

const flatConfigProps: (keyof FlatConfigItem)[] = [
  'files',
  'ignores',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings',
];

const VuePackages = [
  'vue',
  'nuxt',
  'vitepress',
  '@slidev/cli',
];

/**
 * Construct an array of ESLint flat config items.
 */
// eslint-disable-next-line require-await
export async function rotki(
  options: OptionsConfig & FlatConfigItem = {},
  ...userConfigs: Awaitable<UserConfigItem | UserConfigItem[]>[]
): Promise<UserConfigItem[]> {
  const {
    componentExts = [],
    cypress: enableCypress,
    gitignore: enableGitignore = true,
    isInEditor = !!((process.env.VSCODE_PID || process.env.JETBRAINS_IDE || process.env.VIM) && !process.env.CI),
    rotki: enableRotki,
    typescript: enableTypeScript = isPackageExists('typescript'),
    vue: enableVue = VuePackages.some(i => isPackageExists(i)),
    vueI18n: enableVueI18n,
    vuetify: enableVuetify,
  } = options;

  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === 'object'
      ? options.stylistic
      : {};

  if (stylisticOptions && !('jsx' in stylisticOptions))
    stylisticOptions.jsx = options.jsx ?? true;

  const configs: Awaitable<FlatConfigItem[]>[] = [];

  if (enableGitignore) {
    if (typeof enableGitignore !== 'boolean')
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r(enableGitignore)]));

    else if (fs.existsSync('.gitignore'))
      configs.push(interopDefault(import('eslint-config-flat-gitignore')).then(r => [r()]));
  }

  // Base configs
  configs.push(
    ignores(),
    javascript({
      isInEditor,
      overrides: getOverrides(options, 'javascript'),
    }),
    comments(),
    node(),
    imports({
      stylistic: stylisticOptions,
    }),
    unicorn(),

    // Optional plugins (installed but not enabled by default)
    perfectionist(),
  );

  if (enableVue)
    componentExts.push('vue');

  if (enableTypeScript) {
    configs.push(typescript({
      ...resolveSubOptions(options, 'typescript'),
      componentExts,
      isInEditor,
      overrides: getOverrides(options, 'typescript'),
    }));
  }

  if (stylisticOptions) {
    configs.push(stylistic({
      ...stylisticOptions,
      overrides: getOverrides(options, 'stylistic'),
    }));
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

  if (enableVuetify) {
    configs.push(vuetify({
      ...resolveSubOptions(options, 'vuetify'),
      overrides: getOverrides(options, 'vuetify'),
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

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options)
      acc[key] = options[key] as any;
    return acc;
  }, {} as FlatConfigItem);
  if (Object.keys(fusedConfig).length > 0)
    configs.push([fusedConfig]);

  const merged = combine(
    ...configs,
    ...userConfigs,
  );

  return merged;
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
    : options[key] || {};
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
) {
  const sub = resolveSubOptions(options, key);
  return {
    ...'overrides' in sub
      ? sub.overrides
      : {},
  } as any; // We need to cast to any otherwise we get a bunch of TS errors on dts generation;
}
