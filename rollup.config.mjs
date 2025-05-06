import {builtinModules} from 'module';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import {readFileSync} from 'fs';

export default createConfig({
  pkg: JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')),
});

/**
 * Creates a configuration object for a module bundler.
 *
 * @param {Object} options - The configuration options.
 * @param {Object} options.pkg - The package.json contents, containing `dependencies`, `peerDependencies`, `main`, and `module` fields.
 * @param {Array} [options.external=[]] - Additional external modules to exclude from the bundle.
 * @return {Object} The generated configuration object.
 */
function createConfig({pkg, external = []}) {
  return {
    input: 'src/index.ts',
    external: Object.keys(pkg.dependencies || {})
      .concat(Object.keys(pkg.peerDependencies || {}))
      .concat(builtinModules)
      .concat(external),
    output: [
      {
        format: 'cjs',
        file: pkg.main,
        exports: 'named',
        footer: 'module.exports = Object.assign(exports.default, exports);',
        sourcemap: true,
      },
      {
        format: 'cjs',
        file: pkg.main.replace('.js', '.min.js'),
        exports: 'named',
        plugins: [terser()],
        footer: 'module.exports = Object.assign(exports.default, exports);',
        sourcemap: true,
      },
      {
        format: 'es',
        file: pkg.module,
        plugins: [emitModulePackageFile()],
        sourcemap: true,
      },
      {
        format: 'es',
        file: pkg.module.replace('.js', '.min.js'),
        plugins: [terser()],
        sourcemap: true,
      },
    ],
    plugins: [typescript({sourceMap: true})],
  };
}

function emitModulePackageFile() {
  return {
    name: 'emit-module-package-file',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'package.json',
        source: `{"type":"module"}`,
      });
    },
  };
}
