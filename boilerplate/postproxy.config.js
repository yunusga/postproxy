const { join } = require('path');
/**
 * Project directories structure
 */
const paths = {
  source: 'source',
  dist: 'dist',
};

const styles = {
  watch: [
    join('.', paths.source, '**', '*.styl'),
  ],
  src: [
    join(paths.source, '*.styl'),
  ],
  dest: paths.dist,
};

const scripts = {
  watch: [
    join('.', paths.source, '**', '*.js'),
  ],
  src: [
    join(paths.source, '*.js'),
  ],
  dest: paths.dist,
};

const postcss = {
  plugins: {
    'viewport-height-correction': null,
    'sort-media-queries': null,
    'flexbugs-fixes': null,
    'inline-svg': null,
    'momentum-scrolling': null,
  },
};

/**
 * Browsersync paths
 * @link https://browsersync.io/docs/options
 */
const proxy = {
  proxy: 'https://github.com/yunusga/postproxy',
  port: 9000,
  serveStatic: ['./'],
  watch: false,
  ghostMode: false,
  ui: false,
  open: false,
  notify: true,
  logLevel: 'debug',
  logPrefix: 'postproxy',
  snippetOptions: {
    // https://browsersync.io/docs/options#option-rewriteRules
    rule: {
      match: /<\/head>/i,
      fn: (snippet, match) => {
        const css = `<link rel="stylesheet" type="text/css" href="/${paths.dist}/app.css">`;
        return css + match + snippet;
      }
    }
  },

};

module.exports = {
  proxy,
  paths,
  styles,
  scripts,
  postcss,
};
