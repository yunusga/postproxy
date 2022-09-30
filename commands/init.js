const { existsSync, readdirSync } = require('fs');
const { join } = require('path');
const { log } = console;

const {
  bold, bgRed, green,
} = require('picocolors');

const gulp = require('gulp');

module.exports = (dir, opts) => {

  gulp.task('copy:boilerplate', (done) => {
    log(`${bold(green('[postproxy]'))} copy:boilerplate`);

    const stream = gulp.src(
      join(__dirname.replace('commands', ''), 'boilerplate', '**', '*'),
      { dot: true },
    )
      .pipe(gulp.dest(join(process.cwd(), dir)));

    stream.on('end', () => {
      done();
    });
  });

  dir = dir || '';

  const isDirExists = dir.length && existsSync(dir);
  const isNotEmpty = isDirExists || !dir.length ? readdirSync(join(process.cwd(), dir)).length : false;
  const hasPostProxy = existsSync(join(dir, 'postproxy.config.js'));

  if (hasPostProxy) {
    log(`${bgRed('[error]')} project is already initialized`);
    process.exit(0);
  }

  if (isNotEmpty) {
    log(`${bgRed('[error]')} directory is not empty`);
    process.exit(0);
  }

  gulp.series('copy:boilerplate')();
};
