[npm]: https://img.shields.io/npm/v/rollup-plugin-mdi-fontmin
[npm-url]: https://www.npmjs.com/package/rollup-plugin-mdi-fontmin
[size]: https://packagephobia.now.sh/badge?p=rollup-plugin-mdi-fontmin
[size-url]: https://packagephobia.now.sh/result?p=rollup-plugin-mdi-fontmin

[![npm][npm]][npm-url]
[![size][size]][size-url]

# rollup-plugin-mdi-fontmin

🍕 A Rollup plugin to subset Material Design Icons (MDI) font files.

## Requirements

This plugin requires Node.js v14.16.1+ ([LTS](https://github.com/nodejs/Release) recommended).

## Install

```sh
npm install rollup-plugin-mdi-fontmin @mdi/font fontmin --save-dev
```

If you want to use fontmin `1.x.x version`

```sh
npm install rollup-plugin-mdi-fontmin @mdi/font fontmin@1 --save-dev
```

## Usage

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin:

```js
import mdiFontmin from 'rollup-plugin-mdi-fontmin';

export default {
  // ...
  plugins: [
    // ...
    mdiFontmin({
      names: ['home', 'account', 'settings'], // List of icons to include (required)
    }),
  ],
};
```

Full configuration example:

```js
import mdiFontmin from 'rollup-plugin-mdi-fontmin';

export default {
  // ...
  plugins: [
    // ...
    mdiFontmin({
      names: ['home', 'account', 'settings'], // List of icons to include (required)
      output: 'public/fonts/mdi', // Output directory
      silent: false, // Whether to suppress console output
      logPrefix: '[mdi]', // Custom log prefix
    }),
  ],
};
```

Then call `rollup` either via the [CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or
the [API](https://www.rollupjs.org/guide/en/#javascript-api).

## Options

### `names`

Type: `Array<string>`  
**Required**: Yes

A list of Material Design Icons (MDI) names to include in the subset.  
These correspond to _css_ class names without the `mdi-` prefix.

### `output`

Type: `string`  
Default: `'public/fonts/mdi'`

The output directory for the subsetted font files.

### `silent`

Type: `boolean`  
Default: `false`

Whether to suppress console output.

### `logPrefix`

Type: `string`  
Default: `'[rollup-plugin-mdi-fontmin]'`

Prefix for console output.

## How it works

The plugin will check if the font files already exist in the output directory. If they do, it will skip the generation step. Otherwise, it
will:

1. Read the Material Design Icons CSS file.
2. Parse and extract the glyphs corresponding to the specified icon names.
3. Generate the subsetted font files (`.ttf`, `.eot`, `.woff`, `.woff2`).
4. Modify the CSS file to only include the necessary icons and save it to the output directory.

## Meta

[LICENSE (MIT)](/LICENSE)
