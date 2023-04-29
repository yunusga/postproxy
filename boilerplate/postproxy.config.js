/**
 * Browsersync config
 * @link https://browsersync.io/docs/options
 */
const proxy = {
  proxy: 'https://github.com/yunusga/postproxy',
  port: 9000,
  serveStatic: ['./src/'],
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
      match: /<\/body>/i,
      fn: (snippet, match) => {
        const css = `<link rel="stylesheet" type="text/css" href="/app.css">`;
        return css + snippet + match;
      }
    }
  },
  // rewriteRules: [
  //   {
  //     match: /What/g,
  //     fn: function (req, res, match) {
  //       return 'For';
  //     }
  //   }
  // ],
};

module.exports = {
  proxy,
};
