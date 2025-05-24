// noinspection ExceptionCaughtLocallyJS,JSUnusedGlobalSymbols

import { makeGlyphs, modifyCss, parseCss } from './internal';
import type { Plugin } from 'rollup';

export interface RollupMdiFontminOptions {
  /**
   * List of MDI icon names to include in the subset.
   */
  names: string[];

  /**
   * The output directory for the subsetted font files.
   * Defaults to 'public/fonts/mdi' if not provided.
   */
  output?: string;

  /**
   * Whether to suppress console output.
   * Defaults to false.
   */
  silent?: boolean;

  /**
   * Prefix for console output.
   * Defaults to '[mdi-fontmin]'.
   */
  logPrefix?: string;
}

/**
 * A Rollup plugin for subsetting Material Design Icons (MDI) font files.
 *
 * @param [options] - Plugin options.
 * @returns Plugin instance.
 */
export default function mdiFontmin(options?: RollupMdiFontminOptions): Plugin {
  return {
    name: 'mdi-fontmin',

    async buildStart() {
      options = Object.assign(
        {
          names: [],
          output: 'public/fonts/mdi',
          silent: false,
          logPrefix: '[mdi-fontmin]',
        },
        options ?? {},
      );

      const mdi = 'materialdesignicons';
      const fs = (await import('node:fs')).default;
      const path = (await import('node:path')).default;
      const Fontmin = (await import('fontmin')).default;
      const logPrefix = options.logPrefix ? ` ${options.logPrefix}` : '';
      const ttfFile = path.resolve(`node_modules/@mdi/font/fonts/${mdi}-webfont.ttf`);
      const cssFile = path.resolve(`node_modules/@mdi/font/css/${mdi}.min.css`);
      const outputPath = path.normalize(options.output!.replace(/^\/+/, ''));
      const outputDir = path.resolve(outputPath);

      try {
        if (!fs.existsSync(ttfFile)) {
          throw new Error(
            `font file ${ttfFile} does not exist,\n` + `check if the @mdi/font package is properly installed.`,
          );
        }

        if (!fs.existsSync(cssFile)) {
          throw new Error(
            `css file ${ttfFile} does not exist,\n` + `check if the @mdi/font package is properly installed.`,
          );
        }

        if (
          fs.existsSync(path.join(outputDir, `${mdi}.min.css`)) &&
          fs.existsSync(path.join(outputDir, `${mdi}-webfont.ttf`)) &&
          fs.existsSync(path.join(outputDir, `${mdi}-webfont.eot`)) &&
          fs.existsSync(path.join(outputDir, `${mdi}-webfont.woff`)) &&
          fs.existsSync(path.join(outputDir, `${mdi}-webfont.woff2`))
        ) {
          if (!options.silent) {
            console.info(`✅${logPrefix} Font files already exist, skipping generation.`);
          }

          return;
        }

        if (!options.silent) {
          console.info(`✅${logPrefix} Starting Subset mdi fonts generation...`);
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
            console.info(`✅${logPrefix} Subset mdi fonts generated at ${outputPath}`);
          }
        } catch (error) {
          console.error(`❌${logPrefix} Subset mdi .css generation failed:`, error);
        }
      } catch (error) {
        console.error(`❌${logPrefix} Subset mdi fonts generation failed:`, error);
      }
    },
  };
}
