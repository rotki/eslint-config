# @rotki/eslint-config

[![npm (scoped)](https://img.shields.io/npm/v/@rotki/eslint-config?style=flat-square)](https://www.npmjs.com/package/@rotki/eslint-config)

A comprehensive ESLint configuration preset for [rotki](https://github.com/rotki) TypeScript and JavaScript repositories. Based on [@antfu/eslint-config](https://github.com/antfu/eslint-config) and inspired by [@sxzz/eslint-config](https://github.com/sxzz/eslint-config).

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Configuration](#basic-configuration)
  - [Vue I18n Support](#vue-i18n-support)
  - [TypeScript Configuration](#typescript-configuration)
- [Editor Integration](#editor-integration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- 📝 TypeScript and JavaScript support
- 🔧 Auto-fixable rules
- 🌐 Vue I18n integration
- ⚡ Editor-aware configurations
- 🛠️ Preconfigured best practices

## Requirements

- Node.js >=20 < 21
- ESLint >=9.10.0
- TypeScript >=5.0.0 (for TypeScript support)

## Installation

Using pnpm (recommended):

```bash
pnpm add -D eslint @rotki/eslint-config
```

Using npm:

```bash
npm install --save-dev eslint @rotki/eslint-config
```

Using yarn:

```bash
yarn add -D eslint @rotki/eslint-config
```

## Usage

### Basic Configuration

Create an `eslint.config.ts` file in your project root:

```js
import rotki from '@rotki/eslint-config';

// eslint-disable-next-line import/no-default-export
export default rotki();
```

Add scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### Vue I18n Support

For projects using Vue I18n, configure the plugin in your `eslint.config.ts`:

```js
import path from 'node:path';
import rotki from '@rotki/eslint-config';

// eslint-disable-next-line import/no-default-export
export default rotki({
  vueI18n: {
    src: path.join('app', 'src'), // Source directory
    localeDir: 'locales', // Locales directory
    ignores: [], // Ignored paths
  },
});
```

### TypeScript Configuration

For TypeScript projects, specify your `tsconfig.json` location:

```js
import rotki from '@rotki/eslint-config';

// eslint-disable-next-line import/no-default-export
export default rotki({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
});
```

## Editor Integration

This configuration includes special handling for editor environments. The following rules are disabled during editing but enabled during CI/CD:

- [`prefer-const`](https://eslint.org/docs/rules/prefer-const)
- [`test/no-only-tests`](https://github.com/levibuzolic/eslint-plugin-no-only-tests)
- [`unused-imports/no-unused-imports`](https://www.npmjs.com/package/eslint-plugin-unused-imports)

This improves the development experience while maintaining code quality in production.

## Troubleshooting

Common issues and their solutions:

- If you encounter parsing errors, ensure your TypeScript version matches the requirements
- For Vue I18n issues, verify your directory structure matches the configuration

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

[AGPL-3.0](./LICENSE) License &copy; 2023- [Rotki Solutions GmbH](https://github.com/rotki)
