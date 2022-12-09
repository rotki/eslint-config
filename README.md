# @rotki/eslint-config

Inspired by [@antfu/eslint-config](https://github.com/antfu/eslint-config) and [@sxzz/eslint-config](https://github.com/sxzz/eslint-config).

A common configuration to be used across the different [rotki](https://github.com/rotki) TypeScript and JavaScript repositories.

## Usage

### Install

```
pnpm add -D eslint @rotki/eslint-config
```


### Config `.eslintrc`

```json
{
  "extends": "@rotki"
}
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

Type aware rules are enabled when a `tsconfig.eslint.json` is found in the project root, which will introduce some stricter rules into your project. If you want to enable it while have no `tsconfig.eslint.json` in the project root, you can change tsconfig name by modifying `ESLINT_TSCONFIG` env.

```js
// .eslintrc.js
process.env.ESLINT_TSCONFIG = 'tsconfig.json'
module.exports = {
  extends: '@rotki'
}
```

## License

[AGPL-3.0](./LICENSE) License &copy; 2023- [Rotki Solutions GmbH](https://github.com/rotki)