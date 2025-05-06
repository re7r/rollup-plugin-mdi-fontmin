import fs from 'fs';

interface Match {
  name: string;
  code: string;
}

/**
 * Checks if the specified TTF and CSS files exist in the file system.
 * Throws an error if any of the files do not exist.
 *
 * @param {string} ttfFile - The path to the TTF font file to check.
 * @param {string} cssFile - The path to the CSS file to check.
 * @return {void} Throws an error if the files do not exist.
 */
export function checkSourcesExists(ttfFile: string, cssFile: string): void {
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
export function parseCss(css: string, names: string[] = []): Match[] {
  let match: RegExpExecArray | null;
  const regex = /\.mdi-([a-z0-9-]+):{1,2}before{content:"\\([A-Fa-f0-9]+?)"/g;
  const result: Match[] = [];

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
export function modifyCss(css: string, names: string[] = []): string {
  const result = css.replace(
    /\.mdi-([a-z0-9-]+):{1,2}before{content:"\\[A-Fa-f0-9]+?"}/g, (match, name) => {
      return names.includes(name) ? match : '';
    },
  );

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
export function makeGlyphs(matches: Match[]): string {
  return matches.map(match => String.fromCodePoint(parseInt(match.code, 16))).join();
}
