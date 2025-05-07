import {builtinModules} from 'module';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import {relative} from 'path';
import {readFileSync} from 'fs';

export default createConfig({
  pkg: JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')),
});

interface PKG {
  dependencies: object;
  peerDependencies: object;
  main: string;
}

/**
 * Creates a configuration object for a module bundler.
 *
 * @param options - The configuration options.
 * @param options.pkg - The package.json contents, containing `dependencies`, `peerDependencies` and `main` fields.
 * @returns The generated configuration object.
 */
function createConfig({pkg}: { pkg: PKG }): object {
  const ts = 'src/index.ts';
  const min = relative('.', pkg.main);
  const js = min.replace('.min.js', '.js');
  const deps = Object.keys(pkg.dependencies || {})
    .concat(Object.keys(pkg.peerDependencies || {}))
    .concat(builtinModules);

  return {
    input: ts,
    external: deps,
    output: [{
      file: js,
      format: 'cjs',
      sourcemap: true,
    }, {
      file: min,
      format: 'cjs',
      plugins: [terser()],
      sourcemap: true,
    }],
    plugins: [typescript()],
  };
}
