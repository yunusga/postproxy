const fs = require('fs');
const readline = require('readline-sync');

const { join } = require('path');
const { task, src, dest, series } = require('gulp');
const { log } = console;
const { bold, green, black, bgYellow, bgRed } = require('colorette');

module.exports = (dir) => {

  task('copy:boilerplate', (done) => {
    log(`${bold(green('[postproxy]'))} copy boilerplate`);

    const boilerplate = join(__dirname.replace('commands', ''), 'boilerplate', '**', '*');

    const stream = src(boilerplate, { dot: true })
      .pipe(dest(join(process.cwd(), dir)));

    stream.on('end', () => {
      done();
    });
  });

  dir = dir || '';

  const dirExists = dir.length && fs.existsSync(dir);
  const notEmpty = dirExists || !dir.length ? fs.readdirSync(join(process.cwd(), dir)).length : false;
  const hasPostProxy = fs.existsSync(join(dir, '.postproxy'));

  if (hasPostProxy) {
    log(`${bgRed(' ERROR ')} postproxy project has already initialized in ${join(process.cwd(), dir)}`);
    process.exit(0);
  }

  if (notEmpty) {
    log(`${bgYellow(black(' WARN '))} Directory is not empty. Some files may be overwritten. Continue?`);

    const agree = readline.question('(yes|no):');

    if (agree !== 'yes') {
      log(`${bgRed(' ERROR ')} initialization aborted`);
      process.exit(0);
    }
  }

  series('copy:boilerplate')();
}
