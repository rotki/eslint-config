import fs from 'node:fs/promises';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import JS from '@eslint/js';
import { combine, comments, cypress, formatters, imports, javascript, jsonc, markdown, node, perfectionist, regexp, rotkiPlugin, sortPackageJson, storybook, stylistic, test, typescript, unicorn, vue, vueI18n, yaml } from '../src';

const configs = await combine(
  {
    plugins: {
      '': {
        rules: JS.configs.all,
      },
    },
  },
  comments(),
  cypress(),
  formatters(),
  imports(),
  javascript(),
  jsonc(),
  markdown(),
  node(),
  perfectionist(),
  sortPackageJson(),
  storybook(),
  stylistic(),
  test(),
  regexp(),
  rotkiPlugin(),
  typescript(),
  unicorn(),
  vue(),
  vueI18n(),
  yaml(),
);

const configNames = configs.map(i => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
});

// type generation does not work correctly for vue-i18n
dts = dts.replaceAll(/(_(IntlifyVueI18N(.*))){2}/g, `IntlifyVueI18n$3`);

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')}
`;

await fs.writeFile('src/typegen.d.ts', dts);
