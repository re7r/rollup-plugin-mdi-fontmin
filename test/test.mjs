import {rollup} from 'rollup';
import {fileURLToPath} from 'url';
import test from 'ava';
import path from 'path';
import fs from 'fs';

import mdiFontmin from '../dist/es/index.min.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, 'mdi');

test.beforeEach(() => {
  fs.rmSync(outputDir, {recursive: true, force: true});
});

test.afterEach(() => {
  fs.rmSync(outputDir, {recursive: true, force: true});
});

test('rollup-plugin-mdi-fontmin generates correct subset', async t => {
  const bundle = await rollup({
    input: './test/fixtures/basic/main.mjs',
    plugins: [
      mdiFontmin({
        names: ['arrow-left', 'arrow-right'],
        output: 'test/mdi',
        silent: false,
        logPrefix: '[test]',
      }),
    ],
  });

  await bundle.generate({format: 'es'});
  const files = fs.readdirSync(outputDir).sort();
  t.snapshot(files, 'file list matches snapshot');

  const contents = {};

  for (const file of files) {
    const ext = path.extname(file);
    const fullPath = path.join(outputDir, file);

    if (ext === '.css') {
      contents[file] = fs.readFileSync(fullPath, 'utf8');
    } else {
      contents[file] = fs.readFileSync(fullPath).toString('base64');
    }
  }

  t.snapshot(contents, 'file contents match snapshot');
});
