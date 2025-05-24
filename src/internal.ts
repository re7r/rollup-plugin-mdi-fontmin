interface Match {
  name: string;
  code: string;
}

/**
 * Parses the provided CSS string to extract icon class names and corresponding Unicode values.
 *
 * @param css - The CSS string to be parsed for icon class definitions.
 * @param [names] - An optional array of class names to filter the extracted results.
 * @returns An array of objects containing the `name` and `code` properties for each extracted icon.
 */
export function parseCss(css: string, names: string[] = []): Match[] {
  let match: RegExpExecArray | null;
  const regex = /\.mdi-([a-z0-9-]+):{1,2}before\{content:"\\([A-Fa-f0-9]+)"/g;
  const result: Match[] = [];

  while ((match = regex.exec(css))) {
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
 * @param css - The CSS string to be modified.
 * @param [names] - An optional array of class names to retain in the CSS string.
 * If a class is not in this list, it will be removed.
 * @returns The modified CSS string after processing.
 */
export function modifyCss(css: string, names: string[] = []): string {
  const result = css.replaceAll(/\.mdi-([a-z0-9-]+):{1,2}before\{content:"\\[A-Fa-f0-9]+"\}/g, (match, name) => {
    return names.includes(name) ? match : '';
  });

  return `${result
    .replaceAll('../fonts/', './')
    .replace(/\/\*# sourceMappingURL=.*? \*\//, '')
    .replaceAll(/\n+/g, '')}\n`;
}

/**
 * Converts an array of match objects containing Unicode code points into a single string of glyphs.
 *
 * @param matches - An array of objects, each containing a `code` property representing a Unicode code point in hex format.
 * @returns A string of glyphs generated from the Unicode code points.
 */
export function makeGlyphs(matches: Match[]): string {
  return matches.map((match) => String.fromCodePoint(Number.parseInt(match.code, 16))).join();
}
