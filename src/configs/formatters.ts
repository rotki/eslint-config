import { GLOB_CSS, GLOB_LESS, GLOB_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS, GLOB_XML } from '../globs';
import { ensurePackages, interopDefault, isPackageInScope, parserPlain } from '../utils';
import { StylisticConfigDefaults } from './stylistic';
import type { VendoredPrettierOptions, VendoredPrettierRuleOptions } from '../vendor/prettier';
import type { OptionsFormatters, StylisticConfig, TypedFlatConfigItem } from '../types';

function mergePrettierOptions(
  options: VendoredPrettierOptions,
  overrides: VendoredPrettierRuleOptions = {},
): VendoredPrettierRuleOptions {
  return {
    ...options,
    ...overrides,
    plugins: [
      ...(overrides.plugins || []),
      ...(options.plugins || []),
    ],
  };
}

export async function formatters(
  options: OptionsFormatters | true = {},
  stylistic: StylisticConfig = {},
): Promise<TypedFlatConfigItem[]> {
  if (options === true) {
    options = {
      css: true,
      html: true,
      markdown: true,
      xml: isPackageInScope('@prettier/plugin-xml'),
    };
  }

  await ensurePackages([
    'eslint-plugin-format',
    options.xml ? '@prettier/plugin-xml' : undefined,
  ]);

  const {
    indent,
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...stylistic,
  };

  const prettierOptions: VendoredPrettierOptions = Object.assign(
        {
          endOfLine: 'auto',
          printWidth: 120,
          semi,
          singleQuote: quotes === 'single',
          tabWidth: typeof indent === 'number' ? indent : 2,
          trailingComma: 'all',
          useTabs: indent === 'tab',
        } satisfies VendoredPrettierOptions,
        options.prettierOptions || {},
  );

  const dprintOptions = Object.assign(
    {
      indentWidth: typeof indent === 'number' ? indent : 2,
      quoteStyle: quotes === 'single' ? 'preferSingle' : 'preferDouble',
      useTabs: indent === 'tab',
    },
    options.dprintOptions || {},
  );

  const prettierXmlOptions: VendoredPrettierOptions = {
    xmlQuoteAttributes: 'double',
    xmlSelfClosingSpace: true,
    xmlSortAttributesByKey: false,
    xmlWhitespaceSensitivity: 'ignore',
  };

  const pluginFormat = await interopDefault(import('eslint-plugin-format'));

  const configs: TypedFlatConfigItem[] = [
    {
      name: 'rotki/formatter/setup',
      plugins: {
        format: pluginFormat,
      },
    },
  ];

  if (options.css) {
    configs.push(
      {
        files: [GLOB_CSS, GLOB_POSTCSS],
        languageOptions: {
          parser: parserPlain,
        },
        name: 'rotki/formatter/css',
        rules: {
          'format/prettier': [
            'error',
            mergePrettierOptions(prettierOptions, {
              parser: 'css',
            }),
          ],
        },
      },
      {
        files: [GLOB_SCSS],
        languageOptions: {
          parser: parserPlain,
        },
        name: 'rotki/formatter/scss',
        rules: {
          'format/prettier': [
            'error',
            mergePrettierOptions(prettierOptions, {
              parser: 'scss',
            }),
          ],
        },
      },
      {
        files: [GLOB_LESS],
        languageOptions: {
          parser: parserPlain,
        },
        name: 'rotki/formatter/less',
        rules: {
          'format/prettier': [
            'error',
            mergePrettierOptions(prettierOptions, {
              parser: 'less',
            }),
          ],
        },
      },
    );
  }

  if (options.html) {
    configs.push({
      files: ['**/*.html'],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'rotki/formatter/html',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            parser: 'html',
          }),
        ],
      },
    });
  }

  if (options.xml) {
    configs.push({
      files: [GLOB_XML],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'rotki/formatter/xml',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions({
            ...prettierXmlOptions,
            ...prettierOptions,
          }, {
            parser: 'xml',
            plugins: [
              '@prettier/plugin-xml',
            ],
          }),
        ],
      },
    });
  }

  if (options.markdown) {
    const formater = options.markdown === true
      ? 'prettier'
      : options.markdown;

    configs.push({
      files: [GLOB_MARKDOWN],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'rotki/formatter/markdown',
      rules: {
        [`format/${formater}`]: [
          'error',
          formater === 'prettier'
            ? mergePrettierOptions(prettierOptions, {
              embeddedLanguageFormatting: 'off',
              parser: 'markdown',
            })
            : {
                ...dprintOptions,
                language: 'markdown',
              },
        ],
      },
    });
  }

  return configs;
}
