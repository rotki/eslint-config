# @rotki/eslint-config

[![npm (scoped)](https://img.shields.io/npm/v/@rotki/eslint-config?style=flat-square)](https://www.npmjs.com/package/@rotki/eslint-config)

Inspired by [@antfu/eslint-config](https://github.com/antfu/eslint-config) and [@sxzz/eslint-config](https://github.com/sxzz/eslint-config).

A common configuration to be used across the different [rotki](https://github.com/rotki) TypeScript and JavaScript repositories.

## Usage

### Install

```
pnpm i -D eslint @rotki/eslint-config
```

### Config `eslint.config.mjs`

```js
import rotki from '@rotki/eslint-config';

// eslint-disable-next-line import/no-default-export
export default rotki();
```

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### @intlify/eslint-plugin-vue-i18n

```js
// eslint.config.mjs
import rotki from '@rotki/eslint-config';

// eslint-disable-next-line import/no-default-export
export default rotki({
  vueI18n: {
    src: path.join('app', 'src'), // defaults to src for @intlify/vue-i18n/no-unused-keys,
    localeDir: 'locales', // that would be under app/src/
    ignores: [], // for @intlify/vue-i18n/no-unused-keys
  },
});
```

### TypeScript Aware Rules

```js
// eslint.config.mjs
import rotki from '@rotki/eslint-config';

// eslint-disable-next-line import/no-default-export
export default rotki({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
});
```

### Editor Specific Disables

Auto-fixing for the following rules are disabled when ESLint is running in a code editor:

- [`prefer-const`](https://eslint.org/docs/rules/prefer-const)
- [`test/no-only-tests`](https://github.com/levibuzolic/eslint-plugin-no-only-tests)
- [`unused-imports/no-unused-imports`](https://www.npmjs.com/package/eslint-plugin-unused-imports)

The rules above are non-fixable with the use of [this helper](https://github.com/antfu/eslint-flat-config-utils#composerdisablerulesfix).

This is to improve the developer experience during refactoring by not allowing the editor to remove them.
These rules will be normally applied when you run ESLint in the terminal or [Lint Staged](#lint-staged).

## License

[AGPL-3.0](./LICENSE) License &copy; 2023- [Rotki Solutions GmbH](https://github.com/rotki)
