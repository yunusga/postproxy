const { existsSync } = require('fs');
const { join } = require('path');
const { log } = console;

const {
  red, yellow,
} = require('picocolors');

const proxy = require('browser-sync').create('Proxy Server');

module.exports = () => {
  const configPath = join(process.cwd(), 'postproxy.config.js');
  const hasPostProxy = existsSync(configPath);

  if (!hasPostProxy) {
    log(`${red('[error]')} ${yellow('postproxy.config.js')} not found`);
    process.exit(0);
  }

  const config = require(configPath);

  proxy.init(config.proxy);

  proxy.watch('./**/*.css').on('change', () => {
    // Since 2.6.0 - wildcards to reload ALL css files
    proxy.reload("*.css");
  });

  proxy.watch('./**/*.js').on('change', proxy.reload);
}
