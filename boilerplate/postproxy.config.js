const path = require('path');
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
    join('.', paths.source, '**', '*.{styl,scss}'),
  ],
  src: [
    join(paths.source, '*.{styl,scss}'),
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
  autoprefixer: [
    'last 2 versions',
  ],
};

/**
 * Browsersync paths
 * @link https://browsersync.io/docs/options
 */
const browserSync = {
  proxy: 'https://github.com/solversgroup/postproxy',
  port: 9000,
  serveStatic: ['./'],
  watch: false,
  ghostMode: false,
  ui: false,
  open: false,
  notify: true,
  logLevel: 'info',
  logPrefix: 'Postproxy',
  snippetOptions: {
    rule: {
      match: /<\/head>/i,
      fn: (snippet, match) => {
        const css = `<link rel="stylesheet" type="text/css" href="/${paths.dist}/app.css">`;
        return css + snippet + match;
      }
    }
  },
  // https://browsersync.io/docs/options#option-rewriteRules
};

module.exports = {
  browserSync,
  paths,
  postcss,
  scripts,
  styles,
};
