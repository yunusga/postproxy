const { existsSync, writeFileSync } = require('fs');
const { join } = require('path');
const { log } = console;

const {
  bold, green, red, yellow, bgRed,
} = require('picocolors');

const pkg = require('../package.json');
const auth = require('../modules/auth');
const proxy = require('browser-sync').create('Proxy Server');

const gulp = require('gulp');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');

module.exports = (opts) => {
  const configPath = join(process.cwd(), 'postproxy.config.js');
  const hasPostProxy = existsSync(configPath);

  if (!hasPostProxy) {
    log(`${red('[error]')} ${yellow('postproxy.config.js')} not found`);
    process.exit(0);
  }

  const config = require(configPath);
  const browserslistrcPath = join(process.cwd(), '.browserslistrc');

  if (!existsSync(browserslistrcPath)) {
    log(`${red('[error]')} ${yellow('.browserslistrc')} not found`);
    process.exit(0);
  }

  process.env.BROWSERSLIST_CONFIG = browserslistrcPath;

  /**
   * Proxy Auth
   */
  proxy.use(require('bs-auth'), {
    user: auth(opts.auth, pkg.name)[0],
    pass: auth(opts.auth, pkg.name)[1],
    use: opts.auth,
  });

  /**
   * Styles
   */
  gulp.task('styles', (done) => {
    const postcss = require('gulp-postcss');
    const flexBugsFixes = require('postcss-flexbugs-fixes');
    const momentumScrolling = require('postcss-momentum-scrolling');
    const easingGradients = require('postcss-easing-gradients');
    const combineAndSortMQ = require('postcss-sort-media-queries');
    const inlineSvg = require('postcss-inline-svg');

    const autoprefixer = require('autoprefixer');
    const stylus = require('../modules/gulp/stylus');

    gulp.src(config.styles.src)
      .pipe(plumber({
        errorHandler: (error) => {
          console.error(`Ошибка: проверьте стили ${error.plugin}`);
          console.error(error.toString());

          proxy.sockets.emit('error:message', error);
        },
      }))
      .pipe(stylus({
        'include css': true,
      }))
      .pipe(postcss([
        combineAndSortMQ(),
        momentumScrolling(),
        flexBugsFixes(),
        inlineSvg(),
        easingGradients(),
        autoprefixer(),
      ], { from: undefined }))
      .pipe(gulp.dest(config.paths.dist))
      .pipe(proxy.stream());

    done();
  });

  /**
   * Scripts
   */
  gulp.task('scripts', (done) => {
    let hasError = false;

    const stream = gulp.src(config.scripts.src)
      .pipe(plumber({
        errorHandler: (error) => {
          proxy.sockets.emit('error:message', error);
          hasError = true;

          log(`${red('[error]')} error in scripts ${error.plugin}`);
          log(`${red('[error]')} ${error.message}`);
        },
      }))
      .pipe(babel({
        presets: ['@babel/preset-env'].map(require.resolve),
        plugins: ['@babel/plugin-transform-object-assign'].map(require.resolve),
      }))
      .pipe(concat('app.js'))
      .pipe(gulp.dest(config.paths.dist));

    stream.on('end', () => {
      if (!hasError) {
        log(`${green('[scripts]')} ${bold(green('done'))}`);
        proxy.reload();
      }

      done();
    });

    stream.on('error', (error) => {
      proxy.sockets.emit('error:message', error);
      log(`${red('[error]')} error in script\n${error}`);
      done(error);
    });
  });

  gulp.task('watch', (done) => {
    const watchOpts = {
      ignoreInitial: true,
      ignored: [
        join(process.cwd(),'**', '*.db'),
        join(process.cwd(), '**', '*tmp*')
      ],
      usePolling: false,
      cwd: process.cwd(),
    };

    /* Styles */
    gulp.watch(
      config.styles.watch,
      watchOpts,
      gulp.parallel('styles')
    );

    /* Scripts */
    gulp.watch(
      config.scripts.watch,
      watchOpts,
      gulp.parallel('scripts'),
    );

    done();
  });

  gulp.task('proxy-server', (done) => {
    proxy.use(require('../modules/browser-sync/screen-message'));

    proxy.init(config.proxy, () => {
      done();
    });
  });

  gulp.series('watch', 'scripts', 'styles', 'proxy-server')();
}
