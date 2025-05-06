import type {RollupOptions} from 'rollup';
import mdiFontmin from '..';

const config: RollupOptions = {
  input: 'main.js',
  output: {
    file: 'bundle.js',
    format: 'iife',
  },
  plugins: [
    mdiFontmin({
      names: [
        'arrow-left',
        'arrow-right',
      ],
      output: 'public/custom-fonts/mdi',
      silent: false,
      logPrefix: '[test]',
    }),
  ],
};

export default config;
