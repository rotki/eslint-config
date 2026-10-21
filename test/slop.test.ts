import type { TypedFlatConfigItem } from '../src/types';
import { isAbsolute, resolve } from 'node:path';
import process from 'node:process';
import parserTs from '@typescript-eslint/parser';
import { ESLint } from 'eslint';
import { execa } from 'execa';
import { describe, expect, it } from 'vitest';
import { slop } from '../src';

// A tracked file whose committed text holds an em dash on a line nobody has touched.
const TRACKED_FILE = 'test/factory-snap.test.ts';

function slopSettings(configs: TypedFlatConfigItem[]): Record<string, unknown> | undefined {
  return configs.find(config => config.name === 'rotki/slop/rules')?.settings?.slop as Record<string, unknown> | undefined;
}

async function emDashReports(configs: TypedFlatConfigItem[]): Promise<number> {
  const { stdout: committed } = await execa('git', ['show', `HEAD:${TRACKED_FILE}`]);
  const eslint = new ESLint({
    overrideConfig: [{ files: ['**/*.ts'], languageOptions: { parser: parserTs } }, ...configs] as any,
    overrideConfigFile: true,
  });
  const [result] = await eslint.lintText(committed, { filePath: resolve(TRACKED_FILE) });
  // A parse failure reports nothing either, which would pass the inspection assertion vacuously.
  expect(result.messages.filter(message => message.fatal)).toEqual([]);
  return result.messages.filter(message => message.ruleId === 'slop/no-em-dash').length;
}

describe('slop', () => {
  it('always passes an absolute cwd to the plugin', async () => {
    const withoutCwd = slopSettings(await slop());
    expect(typeof withoutCwd?.cwd).toBe('string');
    expect(isAbsolute(withoutCwd?.cwd as string)).toBe(true);

    const withCwd = slopSettings(await slop({ cwd: 'test' }));
    expect(withCwd?.cwd).toBe(resolve(process.cwd(), 'test'));
  });

  it('honours inspection without an explicit cwd', async () => {
    // The plugin drops `settings.slop` without a string `cwd`, which turned this into a
    // whole-file inspection that reported the untouched em dash.
    expect(await emDashReports(await slop({ inspection: 'uncommitted' }))).toBe(0);
  });

  it('reports the same text under full inspection', async () => {
    expect(await emDashReports(await slop({ inspection: 'full' }))).toBeGreaterThan(0);
  });
});
