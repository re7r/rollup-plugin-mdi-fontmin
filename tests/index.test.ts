import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { rollup } from 'rollup';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

import mdiFontmin from '../dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, 'output');

beforeEach(() => {
  fs.rmSync(outputDir, { recursive: true, force: true });
});

afterEach(() => {
  fs.rmSync(outputDir, { recursive: true, force: true });
});

describe('rollup-plugin-mdi-fontmin', () => {
  it('generates correct subset', async () => {
    const bundle = await rollup({
      input: './tests/fixtures/main.mjs',
      plugins: [
        mdiFontmin({
          names: ['arrow-left', 'arrow-right'],
          output: 'tests/output',
          silent: false,
          logPrefix: '[test]',
        }),
      ],
    });

    await bundle.generate({ format: 'es' });
    const files = fs.readdirSync(outputDir).sort();

    expect(files).toMatchSnapshot('file list matches snapshot');

    const contents: Record<string, string> = {};

    for (const file of files) {
      const ext = path.extname(file);
      const fullPath = path.join(outputDir, file);

      if (ext === '.css') {
        contents[file] = fs.readFileSync(fullPath, 'utf8');
      } else {
        contents[file] = fs.readFileSync(fullPath).toString('base64');
      }
    }

    expect(contents).toMatchSnapshot('file contents match snapshot');
  });
});
