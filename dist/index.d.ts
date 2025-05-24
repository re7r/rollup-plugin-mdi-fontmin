import { Plugin } from "rollup";

interface RollupMdiFontminOptions {
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
   * Defaults to '[rollup-plugin-mdi-fontmin]'.
   */
  logPrefix?: string;
}
/**
 * A Rollup plugin for subsetting Material Design Icons (MDI) font files.
 *
 * @param [options] - Plugin options.
 * @returns Plugin instance.
 */
declare function mdiFontmin(options?: RollupMdiFontminOptions): Plugin; export { RollupMdiFontminOptions, mdiFontmin as default };