# @rotki/eslint-config

[![npm (scoped)](https://img.shields.io/npm/v/@rotki/eslint-config?style=flat-square)](https://www.npmjs.com/package/@rotki/eslint-config)

Inspired by [@antfu/eslint-config](https://github.com/antfu/eslint-config) and [@sxzz/eslint-config](https://github.com/sxzz/eslint-config).

A common configuration to be used across the different [rotki](https://github.com/rotki) TypeScript and JavaScript repositories.

## Usage

### Install

```
pnpm i -D eslint @rotki/eslint-config
```

### Config `eslint.config.js`

With `"type":"module"`

```js
import rotki from '@rotki/eslint-config';

// eslint-disable-next-line import/no-default-export
export default rotki();
```

With CommonJS

```js
const rotki = require('@rotki/eslint-config').default;

module.exports = rotki();
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

### TypeScript Aware Rules

```js
// eslint.config.js
import rotki from '@rotki/eslint-config';

// eslint-disable-next-line import/no-default-export
export default rotki({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
});
```

## License

[AGPL-3.0](./LICENSE) License &copy; 2023- [Rotki Solutions GmbH](https://github.com/rotki)
