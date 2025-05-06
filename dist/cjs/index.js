'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var Fontmin = require('fontmin');
var path = require('path');

/**
 * Checks if the specified TTF and CSS files exist in the file system.
 * Throws an error if any of the files do not exist.
 *
 * @param {string} ttfFile - The path to the TTF font file to check.
 * @param {string} cssFile - The path to the CSS file to check.
 * @return {void} Throws an error if the files do not exist.
 */
function checkSourcesExists(ttfFile, cssFile) {
    if (!fs.existsSync(ttfFile)) {
        throw new Error(`font file ${ttfFile} does not exist,\ncheck if the @mdi/font package is properly installed.`);
    }
    if (!fs.existsSync(cssFile)) {
        throw new Error(`CSS file ${cssFile} does not exists,\ncheck if the @mdi/font package is properly installed.`);
    }
}
/**
 * Parses the provided CSS string to extract icon class names and corresponding Unicode values.
 *
 * @param {string} css - The CSS string to be parsed for icon class definitions.
 * @param {string[]} [names=[]] - An optional array of class names to filter the extracted results.
 * @return {Object[]} An array of objects containing the `name` and `code` properties for each extracted icon.
 */
function parseCss(css, names = []) {
    let match;
    const regex = /\.mdi-([a-z0-9-]+):{1,2}before{content:"\\([A-Fa-f0-9]+?)"/g;
    const result = [];
    while (match = regex.exec(css)) {
        if (names.includes(match[1])) {
            result.push({
                name: match[1],
                code: match[2],
            });
        }
    }
    return result;
}
/**
 * Modifies the given CSS string by filtering class definitions based on provided names,
 * updating font paths and removing source mapping URL.
 *
 * @param {string} css - The CSS string to be modified.
 * @param {string[]} [names=[]] - An optional array of class names to retain in the CSS string.
 *                                If a class is not in this list, it will be removed.
 * @return {string} - The modified CSS string after processing.
 */
function modifyCss(css, names = []) {
    const result = css.replace(/\.mdi-([a-z0-9-]+):{1,2}before{content:"\\[A-Fa-f0-9]+?"}/g, (match, name) => {
        return names.includes(name) ? match : '';
    });
    return result
        .replace(/\.\.\/fonts\//g, './')
        .replace(/\/\*# sourceMappingURL=.*? \*\//, '')
        .replace(/\n+/g, '') + '\n';
}
/**
 * Converts an array of match objects containing Unicode code points into a single string of glyphs.
 *
 * @param {Array<Object>} matches - An array of objects, each containing a `code` property representing a Unicode code point in hexadecimal format.
 * @return {string} A string of glyphs generated from the Unicode code points.
 */
function makeGlyphs(matches) {
    return matches.map(match => String.fromCodePoint(parseInt(match.code, 16))).join();
}

/**
 * A Rollup plugin for subsetting Material Design Icons (MDI) font files.
 *
 * @param {Object} [options] - Plugin options.
 * @param {string[]} options.names - List of MDI icon names to include in the subset.
 * @param {string} [options.output] - The output directory for the subsetted font files. Defaults to 'public/fonts/mdi' if not provided.
 * @param {boolean} [options.silent] - Whether to suppress console output. Defaults to false.
 * @param {string} [options.logPrefix] - Prefix for console output. Defaults to '[rollup-plugin-mdi-fontmin]'.
 * @returns Plugin instance.
 */
function mdiFontmin(options) {
    return {
        name: 'rollup-plugin-mdi-fontmin',
        async buildStart() {
            options = {
                ...{
                    names: [],
                    output: 'public/fonts/mdi',
                    silent: false,
                    logPrefix: '[rollup-plugin-mdi-fontmin]',
                }, ...options ?? {},
            };
            const mdi = 'materialdesignicons';
            const logPrefix = options.logPrefix ? ` ${options.logPrefix}` : '';
            const ttfFile = path.resolve(`node_modules/@mdi/font/fonts/${mdi}-webfont.ttf`);
            const cssFile = path.resolve(`node_modules/@mdi/font/css/${mdi}.min.css`);
            const outputPath = path.normalize(options.output.replace(/^\/+/, ''));
            const outputDir = path.resolve(outputPath);
            try {
                checkSourcesExists(ttfFile, cssFile);
                if (fs.existsSync(path.join(outputDir, `${mdi}.min.css`)) &&
                    fs.existsSync(path.join(outputDir, `${mdi}-webfont.ttf`)) &&
                    fs.existsSync(path.join(outputDir, `${mdi}-webfont.eot`)) &&
                    fs.existsSync(path.join(outputDir, `${mdi}-webfont.woff`)) &&
                    fs.existsSync(path.join(outputDir, `${mdi}-webfont.woff2`))) {
                    if (!options.silent) {
                        console.log(`✅${logPrefix} Font files already exist, skipping generation.`);
                    }
                    return;
                }
                if (!options.silent) {
                    console.log(`✅${logPrefix} Starting Subset mdi fonts generation...`);
                }
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }
                const css = fs.readFileSync(cssFile, 'utf8');
                const matches = parseCss(css, options.names);
                const glyphs = makeGlyphs(matches);
                await new Fontmin()
                    .src(ttfFile)
                    .dest(outputDir)
                    .use(Fontmin.glyph({ text: glyphs, hinting: true }))
                    .use(Fontmin.ttf2eot())
                    .use(Fontmin.ttf2woff())
                    .use(Fontmin.ttf2woff2())
                    .runAsync();
                try {
                    const processedCSS = modifyCss(css, options.names);
                    fs.writeFileSync(path.join(outputDir, `${mdi}.min.css`), processedCSS);
                    if (!options.silent) {
                        console.log(`✅${logPrefix} Subset mdi fonts generated at ` + outputPath);
                    }
                }
                catch (err) {
                    console.error(`❌${logPrefix} Subset mdi .css generation failed:`, err);
                }
            }
            catch (err) {
                console.error(`❌${logPrefix} Subset mdi fonts generation failed:`, err);
            }
        },
    };
}

exports.default = mdiFontmin;
module.exports = Object.assign(exports.default, exports);
//# sourceMappingURL=index.js.map
