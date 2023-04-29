const { existsSync, readdirSync, cpSync } = require('fs');
const { join } = require('path');

const {
  bold, green, yellow, bgRed,
} = require('picocolors');

const { log } = console;

module.exports = (directory) => {
  directory = directory || '';

  const isDirExists = directory.length && existsSync(directory);
  const isNotEmpty = isDirExists || !directory.length ? readdirSync(join(process.cwd(), directory)).length : false;
  const hasPostproxy = existsSync(join(directory, 'postproxy.config.js'));

  if (hasPostproxy) {
    log(`${bgRed(' ERROR ')} ${bold(yellow('postproxy'))} project is already initialized`);
    process.exit(0);
  }

  if (isNotEmpty) {
    log(`${bgRed(' ERROR ')} directory is not empty`);
    process.exit(0);
  }

  cpSync(
    join(__dirname.replace('commands', ''), 'boilerplate'),
    join(process.cwd(), directory),
    {
      recursive: true,
    }
  );

  log(`${bold(green('[postproxy]'))} initialized, type ${bold(yellow('postproxy'))} -h for help`);
}
